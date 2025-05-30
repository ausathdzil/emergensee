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
import { getSymptomsAndLocations } from '@/db/data';
import type { FeatureCollection, Point } from 'geojson';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';

const INITIAL_CENTER = [106.83662, -6.18232] as LngLatLike;
const INITIAL_ZOOM = 11;

// Type for symptom location
type SymptomLocation = {
  symptom: string;
  longitude: string;
  latitude: string;
};

// Mock data for demo/testing
const symptomsAndLocationsDummy: SymptomLocation[] = [
  { symptom: 'Demam', longitude: '106.83662', latitude: '-6.18232' },
  { symptom: 'Demam', longitude: '106.83700', latitude: '-6.18300' },
  { symptom: 'Demam', longitude: '106.83900', latitude: '-6.18100' },
  { symptom: 'Demam', longitude: '106.84000', latitude: '-6.18000' },
  { symptom: 'Batuk', longitude: '106.84', latitude: '-6.18' },
  { symptom: 'Batuk', longitude: '106.84100', latitude: '-6.17900' },
  { symptom: 'Batuk', longitude: '106.84200', latitude: '-6.17800' },
  { symptom: 'Batuk', longitude: '106.835', latitude: '-6.175' },
  { symptom: 'Pusing', longitude: '106.83', latitude: '-6.185' },
  { symptom: 'Pusing', longitude: '106.845', latitude: '-6.178' },
  { symptom: 'Pusing', longitude: '106.84600', latitude: '-6.17700' },
  { symptom: 'Pusing', longitude: '106.84700', latitude: '-6.17600' },
  { symptom: 'Radang', longitude: '106.85000', latitude: '-6.18000' },
  { symptom: 'Radang', longitude: '106.85100', latitude: '-6.18100' },
  { symptom: 'Radang', longitude: '106.85200', latitude: '-6.18200' },
  { symptom: 'Lemas', longitude: '106.85500', latitude: '-6.18500' },
  { symptom: 'Lemas', longitude: '106.85600', latitude: '-6.18600' },
  { symptom: 'Lemas', longitude: '106.85700', latitude: '-6.18700' },
];

export function EpidemiologyMap({
  symptomsAndLocations,
}: {
  symptomsAndLocations: Awaited<ReturnType<typeof getSymptomsAndLocations>>;
}) {
  const mapRef = useRef<mapboxgl.Map>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [isDirty, setIsDirty] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Memoize unique symptoms for select options
  const uniqueSymptoms = useMemo(
    () =>
      Array.from(
        new Set(symptomsAndLocationsDummy.map((item) => item.symptom))
      ),
    []
  );
  const [selectedSymptom, setSelectedSymptom] = useState(
    uniqueSymptoms[0] || ''
  );

  const handleButtonClick = () => {
    mapRef.current!.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  // Initialize map only once
  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYXVzYXRoIiwiYSI6ImNtOXljZ3BlMzFnYmYyaW13YWkzOW80ZG8ifQ.UP1-jkro_aVkZ2cP2CEkNA';
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/dark-v11',
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
      // Initial data for the selected symptom
      const initialGeojson: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: symptomsAndLocationsDummy
          .filter((item) => item.symptom === selectedSymptom)
          .map((item) => ({
            type: 'Feature',
            properties: { symptom: item.symptom },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(item.longitude),
                parseFloat(item.latitude),
              ],
            },
          })),
      };
      // Remove source/layers if they already exist (for hot reload/dev)
      if (mapRef.current!.getLayer('symptoms-heatmap')) {
        mapRef.current!.removeLayer('symptoms-heatmap');
      }
      if (mapRef.current!.getLayer('symptoms-circle')) {
        mapRef.current!.removeLayer('symptoms-circle');
      }
      if (mapRef.current!.getSource('symptoms')) {
        mapRef.current!.removeSource('symptoms');
      }
      mapRef.current!.addSource('symptoms', {
        type: 'geojson',
        data: initialGeojson,
      });
      // Add heatmap layer
      mapRef.current!.addLayer({
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
      // Add circle layer for higher zoom, above the heatmap
      mapRef.current!.addLayer(
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
    });

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current!.getCenter();
      const mapZoom = mapRef.current!.getZoom();

      setCenter(mapCenter);
      setZoom(mapZoom);
      const isCenterDirty =
        Math.abs(mapCenter.lng - (INITIAL_CENTER as [number, number])[0]) >
          1e-5 ||
        Math.abs(mapCenter.lat - (INITIAL_CENTER as [number, number])[1]) >
          1e-5;
      const isZoomDirty = Math.abs(mapZoom - INITIAL_ZOOM) > 1e-5;
      setIsDirty(isCenterDirty || isZoomDirty);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update geojson source data when selectedSymptom changes and map is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const geojson: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: symptomsAndLocationsDummy
        .filter((item) => item.symptom === selectedSymptom)
        .map((item) => ({
          type: 'Feature',
          properties: { symptom: item.symptom },
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
            ],
          },
        })),
    };
    const source = mapRef.current.getSource(
      'symptoms'
    ) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    }
  }, [selectedSymptom, mapLoaded]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peta Konsentrasi Gejala</CardTitle>
        <CardDescription>
          Visualisasi berdasarkan laporan dari aplikasi mobile
        </CardDescription>
        <CardAction>
          <select
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            className="w-[150px] border border-input rounded-md px-2 py-1"
          >
            {uniqueSymptoms.map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
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
