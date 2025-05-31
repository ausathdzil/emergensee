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
import { IconChevronDown } from '@tabler/icons-react';
export const description = 'An interactive area chart';

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
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

export function TrendAnalysisChart({
  data,
}: {
  data: Awaited<ReturnType<typeof getEmergencyAndNonEmergencyReports>>;
}) {
  const chartData = data.map((item) => ({
    date: item.date,
    nonIgd: item.nonIgd,
    igd: item.igd,
  }));

  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('30d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = chartData.length
      ? new Date(
          Math.max(...chartData.map((item) => new Date(item.date).getTime()))
        )
      : new Date();
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

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Analisis Tren Data Kesehatan</CardTitle>
        <CardDescription>
          Tren historis dan proyeksi potensi beban
        </CardDescription>
        <CardAction>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40 rounded-lg border px-3 py-2 appearance-none"
              aria-label="Select time range"
            >
              <option value="30d">1 bulan</option>
              <option value="14d">2 minggu</option>
              <option value="7d">1 minggu</option>
            </select>
            <IconChevronDown className="absolute size-4 right-3 top-1/2 -translate-y-1/2" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={sortedData}>
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
