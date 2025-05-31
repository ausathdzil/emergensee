'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { SymptomWithLocations } from '@/db/data';
import { IconChevronDown } from '@tabler/icons-react';
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
} from 'geojson';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

const INITIAL_CENTER = [117.96886, -2.5669] as LngLatLike;
const INITIAL_ZOOM = 4.5;

const CITIES = [
  { name: 'Indonesia', coords: [117.96886, -2.5669], zoom: 4.5 },
  { name: 'Jakarta', coords: [106.8456, -6.2088], zoom: 10 },
  { name: 'Surabaya', coords: [112.7508, -7.2575], zoom: 11 },
  { name: 'Medan', coords: [98.6722, 3.5952], zoom: 11 },
  { name: 'Bandung', coords: [107.6191, -6.9175], zoom: 11 },
  { name: 'Makassar', coords: [119.4124, -5.1477], zoom: 11 },
  { name: 'Denpasar', coords: [115.2167, -8.65], zoom: 11 },
  { name: 'Yogyakarta', coords: [110.3695, -7.7956], zoom: 11 },
  { name: 'Palembang', coords: [104.7458, -2.9909], zoom: 11 },
  { name: 'Semarang', coords: [110.4269, -6.9932], zoom: 11 },
  { name: 'Balikpapan', coords: [116.8312, -1.2654], zoom: 11 },
];

export function EpidemiologyMap({
  symptomsAndLocations,
}: {
  symptomsAndLocations: SymptomWithLocations[];
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const citySelectId = useId();

  const [isDirty, setIsDirty] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const uniqueSymptoms: string[] = useMemo(
    () => Array.from(new Set(symptomsAndLocations.map((item) => item.symptom))),
    [symptomsAndLocations]
  );
  const [selectedSymptom, setSelectedSymptom] = useState<string>(
    uniqueSymptoms[0] || ''
  );
  const [selectedCity, setSelectedCity] = useState(CITIES[0].name);

  useEffect(() => {
    if (!uniqueSymptoms.includes(selectedSymptom)) {
      setSelectedSymptom(uniqueSymptoms[0] || '');
    }
  }, [uniqueSymptoms, selectedSymptom]);

  const handleButtonClick = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
      container: mapContainerRef.current,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    const handleMove = () => {
      if (!mapRef.current) return;
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      const isCenterDirty =
        Math.abs(mapCenter.lng - (INITIAL_CENTER as [number, number])[0]) >
          1e-5 ||
        Math.abs(mapCenter.lat - (INITIAL_CENTER as [number, number])[1]) >
          1e-5;
      const isZoomDirty = Math.abs(mapZoom - INITIAL_ZOOM) > 1e-5;
      setIsDirty(isCenterDirty || isZoomDirty);
    };

    mapRef.current.on('move', handleMove);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('move', handleMove);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    // Only generate features for valid locations
    const features: Feature<Point, GeoJsonProperties>[] =
      symptomsAndLocations
        .filter((item) => item.symptom === selectedSymptom)
        .flatMap((item) =>
          Array.isArray(item.locations)
            ? item.locations
                .filter(
                  (loc) =>
                    loc &&
                    !isNaN(Number(loc.longitude)) &&
                    !isNaN(Number(loc.latitude))
                )
                .map((loc) => ({
                  type: 'Feature' as const,
                  properties: { symptom: item.symptom },
                  geometry: {
                    type: 'Point' as const,
                    coordinates: [
                      parseFloat(String(loc.longitude)),
                      parseFloat(String(loc.latitude)),
                    ],
                  },
                }))
            : []
        ) || [];

    const geojson: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features,
    };

    const source = map.getSource('symptoms');
    if (!source) {
      map.addSource('symptoms', {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: 'symptoms-heatmap',
        type: 'heatmap',
        source: 'symptoms',
        maxzoom: 15,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            15,
            3,
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            1,
            14,
            0,
          ],
        },
      });
      map.addLayer(
        {
          id: 'symptoms-circle',
          type: 'circle',
          source: 'symptoms',
          minzoom: 13,
          paint: {
            'circle-radius': 6,
            'circle-color': '#FF5722',
            'circle-opacity': 0.7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        },
        'symptoms-heatmap'
      );
    } else if ('setData' in source) {
      (source as mapboxgl.GeoJSONSource).setData(geojson);
    }
  }, [selectedSymptom, mapLoaded, symptomsAndLocations]);

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedSymptom(e.target.value),
    []
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const city = CITIES.find((c) => c.name === e.target.value);
      setSelectedCity(city?.name || CITIES[0].name);
      if (city && mapRef.current) {
        mapRef.current.flyTo({
          center: city.coords as [number, number],
          zoom: city.zoom,
        });
      }
    },
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peta Konsentrasi Gejala</CardTitle>
        <CardDescription>
          Visualisasi berdasarkan laporan dari aplikasi mobile
        </CardDescription>
        <CardAction>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <select
                id={selectId}
                value={selectedSymptom}
                onChange={handleSelectChange}
                className="w-56 rounded-lg border px-3 py-2 appearance-none truncate"
              >
                {uniqueSymptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                  </option>
                ))}
              </select>
              <IconChevronDown className="absolute size-4 right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <select
                id={citySelectId}
                value={selectedCity}
                onChange={handleCityChange}
                className="w-56 rounded-lg border px-3 py-2 appearance-none truncate"
              >
                {CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <IconChevronDown className="absolute size-4 right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="relative">
        {isDirty && (
          <Button
            className="absolute top-2 left-8 z-10"
            onClick={handleButtonClick}
          >
            Reset
          </Button>
        )}
        <div
          className="w-full h-[450px] rounded-md"
          id="map-container"
          ref={mapContainerRef}
        />
      </CardContent>
    </Card>
  );
}
