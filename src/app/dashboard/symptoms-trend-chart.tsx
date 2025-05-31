'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';

import {
  Card,
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
import { getReportsBySymptoms } from '@/db/data';

export function SymptomsTrendChart({
  symptomsTrend,
}: {
  symptomsTrend: Awaited<ReturnType<typeof getReportsBySymptoms>>;
}) {
  const chartData = symptomsTrend.map((item) => ({
    symptom: item.symptom,
    count: Number(item.count),
  }));

  const chartConfig: ChartConfig = {
    symptom: {
      label: 'Gejala',
    },
    count: {
      label: 'Kasus',
    },
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Trend Gejala</CardTitle>
        <CardDescription>Gejala yang paling sering dilaporkan</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity="1"
                />
              </linearGradient>
              <linearGradient id="barGradient5" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-5)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-5)"
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="symptom"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" strokeWidth={2} radius={8}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient${5 - (index % 5)})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
