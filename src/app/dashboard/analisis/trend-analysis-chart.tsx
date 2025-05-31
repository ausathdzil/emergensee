'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'An interactive area chart';

const chartData = [
  { date: '2024-04-01', nonIgd: 222, igd: 150 },
  { date: '2024-04-02', nonIgd: 97, igd: 180 },
  { date: '2024-04-03', nonIgd: 167, igd: 120 },
  { date: '2024-04-04', nonIgd: 242, igd: 260 },
  { date: '2024-04-05', nonIgd: 373, igd: 290 },
  { date: '2024-04-06', nonIgd: 301, igd: 340 },
  { date: '2024-04-07', nonIgd: 245, igd: 180 },
  { date: '2024-04-08', nonIgd: 409, igd: 320 },
  { date: '2024-04-09', nonIgd: 59, igd: 110 },
  { date: '2024-04-10', nonIgd: 261, igd: 190 },
  { date: '2024-04-11', nonIgd: 327, igd: 350 },
  { date: '2024-04-12', nonIgd: 292, igd: 210 },
  { date: '2024-04-13', nonIgd: 342, igd: 380 },
  { date: '2024-04-14', nonIgd: 137, igd: 220 },
  { date: '2024-04-15', nonIgd: 120, igd: 170 },
  { date: '2024-04-16', nonIgd: 138, igd: 190 },
  { date: '2024-04-17', nonIgd: 446, igd: 360 },
  { date: '2024-04-18', nonIgd: 364, igd: 410 },
  { date: '2024-04-19', nonIgd: 243, igd: 180 },
  { date: '2024-04-20', nonIgd: 89, igd: 150 },
  { date: '2024-04-21', nonIgd: 137, igd: 200 },
  { date: '2024-04-22', nonIgd: 224, igd: 170 },
  { date: '2024-04-23', nonIgd: 138, igd: 230 },
  { date: '2024-04-24', nonIgd: 387, igd: 290 },
  { date: '2024-04-25', nonIgd: 215, igd: 250 },
  { date: '2024-04-26', nonIgd: 75, igd: 130 },
  { date: '2024-04-27', nonIgd: 383, igd: 420 },
  { date: '2024-04-28', nonIgd: 122, igd: 180 },
  { date: '2024-04-29', nonIgd: 315, igd: 240 },
  { date: '2024-04-30', nonIgd: 454, igd: 380 },
  { date: '2024-05-01', nonIgd: 165, igd: 220 },
  { date: '2024-05-02', nonIgd: 293, igd: 310 },
  { date: '2024-05-03', nonIgd: 247, igd: 190 },
  { date: '2024-05-04', nonIgd: 385, igd: 420 },
  { date: '2024-05-05', nonIgd: 481, igd: 390 },
  { date: '2024-05-06', nonIgd: 498, igd: 520 },
  { date: '2024-05-07', nonIgd: 388, igd: 300 },
  { date: '2024-05-08', nonIgd: 149, igd: 210 },
  { date: '2024-05-09', nonIgd: 227, igd: 180 },
  { date: '2024-05-10', nonIgd: 293, igd: 330 },
  { date: '2024-05-11', nonIgd: 335, igd: 270 },
  { date: '2024-05-12', nonIgd: 197, igd: 240 },
  { date: '2024-05-13', nonIgd: 197, igd: 160 },
  { date: '2024-05-14', nonIgd: 448, igd: 490 },
  { date: '2024-05-15', nonIgd: 473, igd: 380 },
  { date: '2024-05-16', nonIgd: 338, igd: 400 },
  { date: '2024-05-17', nonIgd: 499, igd: 420 },
  { date: '2024-05-18', nonIgd: 315, igd: 350 },
  { date: '2024-05-19', nonIgd: 235, igd: 180 },
  { date: '2024-05-20', nonIgd: 177, igd: 230 },
  { date: '2024-05-21', nonIgd: 82, igd: 140 },
  { date: '2024-05-22', nonIgd: 81, igd: 120 },
  { date: '2024-05-23', nonIgd: 252, igd: 290 },
  { date: '2024-05-24', nonIgd: 294, igd: 220 },
  { date: '2024-05-25', nonIgd: 201, igd: 250 },
  { date: '2024-05-26', nonIgd: 213, igd: 170 },
  { date: '2024-05-27', nonIgd: 420, igd: 460 },
  { date: '2024-05-28', nonIgd: 233, igd: 190 },
  { date: '2024-05-29', nonIgd: 78, igd: 130 },
  { date: '2024-05-30', nonIgd: 340, igd: 280 },
  { date: '2024-05-31', nonIgd: 178, igd: 230 },
  { date: '2024-06-01', nonIgd: 178, igd: 200 },
  { date: '2024-06-02', nonIgd: 470, igd: 410 },
  { date: '2024-06-03', nonIgd: 103, igd: 160 },
  { date: '2024-06-04', nonIgd: 439, igd: 380 },
  { date: '2024-06-05', nonIgd: 88, igd: 140 },
  { date: '2024-06-06', nonIgd: 294, igd: 250 },
  { date: '2024-06-07', nonIgd: 323, igd: 370 },
  { date: '2024-06-08', nonIgd: 385, igd: 320 },
  { date: '2024-06-09', nonIgd: 438, igd: 480 },
  { date: '2024-06-10', nonIgd: 155, igd: 200 },
  { date: '2024-06-11', nonIgd: 92, igd: 150 },
  { date: '2024-06-12', nonIgd: 492, igd: 420 },
  { date: '2024-06-13', nonIgd: 81, igd: 130 },
  { date: '2024-06-14', nonIgd: 426, igd: 380 },
  { date: '2024-06-15', nonIgd: 307, igd: 350 },
  { date: '2024-06-16', nonIgd: 371, igd: 310 },
  { date: '2024-06-17', nonIgd: 475, igd: 520 },
  { date: '2024-06-18', nonIgd: 107, igd: 170 },
  { date: '2024-06-19', nonIgd: 341, igd: 290 },
  { date: '2024-06-20', nonIgd: 408, igd: 450 },
  { date: '2024-06-21', nonIgd: 169, igd: 210 },
  { date: '2024-06-22', nonIgd: 317, igd: 270 },
  { date: '2024-06-23', nonIgd: 480, igd: 530 },
  { date: '2024-06-24', nonIgd: 132, igd: 180 },
  { date: '2024-06-25', nonIgd: 141, igd: 190 },
  { date: '2024-06-26', nonIgd: 434, igd: 380 },
  { date: '2024-06-27', nonIgd: 448, igd: 490 },
  { date: '2024-06-28', nonIgd: 149, igd: 200 },
  { date: '2024-06-29', nonIgd: 103, igd: 160 },
  { date: '2024-06-30', nonIgd: 446, igd: 400 },
];

const chartConfig = {
  cases: {
    label: 'Kasus',
  },
  nonIgd: {
    label: 'Non IGD',
    color: 'var(--primary)',
  },
  igd: {
    label: 'IGD',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function TrendAnalysisChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Analisis Tren Data Kesehatan</CardTitle>
        <CardDescription>
          Tren historis dan proyeksi potensi beban
        </CardDescription>
        <CardAction>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40 rounded-lg border px-3 py-2"
            aria-label="Select time range"
          >
            <option value="90d">3 bulan terakhir</option>
            <option value="30d">30 hari terakhir</option>
            <option value="7d">7 hari terakhir</option>
          </select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNonIgd" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-nonIgd)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-nonIgd)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIgd" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-igd)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-igd)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="igd"
              type="natural"
              fill="url(#fillIgd)"
              stroke="var(--color-igd)"
              stackId="a"
            />
            <Area
              dataKey="nonIgd"
              type="natural"
              fill="url(#fillNonIgd)"
              stroke="var(--color-nonIgd)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
