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
import { getEmergencyAndNonEmergencyReports } from '@/db/data';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'An interactive area chart';

const chartConfig = {
  cases: {
    label: 'Kasus',
  },
  nonEmergency: {
    label: 'Non IGD',
    color: 'var(--primary)',
  },
  emergency: {
    label: 'IGD',
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

export function TrendAnalysisChart({
  data,
}: {
  data: Awaited<ReturnType<typeof getEmergencyAndNonEmergencyReports>>;
}) {
  const chartData = data;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('30d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date as string);
    const referenceDate = Math.max(
      ...chartData.map((item) => new Date(item.date as string).getTime())
    );
    let daysToSubtract = 30;
    if (timeRange === '14d') {
      daysToSubtract = 14;
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
            <option value="30d">1 bulan</option>
            <option value="14d">2 minggu</option>
            <option value="7d">1 minggu</option>
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
              <linearGradient id="fillnonEmergency" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-nonEmergency)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-nonEmergency)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEmergency" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-emergency)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-emergency)"
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
              dataKey="emergency"
              type="natural"
              fill="url(#fillEmergency)"
              stroke="var(--color-emergency)"
              stackId="a"
            />
            <Area
              dataKey="nonEmergency"
              type="natural"
              fill="url(#fillnonEmergency)"
              stroke="var(--color-nonEmergency)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
