'use client';

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, Cell } from 'recharts';

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
  // const chartData = symptomsTrend.map((item) => ({
  //   symptom: item.symptom,
  //   count: Number(item.count),
  // }));
  //
  // const chartConfig: ChartConfig = {
  //   symptom: {
  //     label: 'Gejala',
  //   },
  //   count: {
  //     label: 'Kasus',
  //   },
  // };

  const chartData = [
    { symptom: 'Radang', count: 50 },
    { symptom: 'Sakit Kepala', count: 40 },
    { symptom: 'Pilek', count: 30 },
    { symptom: 'DBD', count: 25 },
    { symptom: 'Batuk', count: 20 },
    { symptom: 'Asam Lambung', count: 20 },
    { symptom: 'Sakit Perut', count: 15 },
    { symptom: 'Demam', count: 10 },
    { symptom: 'Diare', count: 10 },
    { symptom: 'Meriang', count: 10 },
  ];

  const barColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ];

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
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="symptom"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" strokeWidth={2} radius={8} fill={barColors[0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
