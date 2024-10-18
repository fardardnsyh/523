"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type CalendarDay } from "~/server/queries";

const chartConfig = {
  commits: {
    label: "Commits",
    color: "hsl(var(--chart-2))",
  },
};

export default function ActivityChart({ days }: { days: CalendarDay[] }) {
  const [timeRange, setTimeRange] = useState<Interval>("90d");
  const filteredData = filterData(days, timeRange);
  const total = filteredData.reduce((acc, current) => acc + current.commits, 0);
  const subtitle = getSubtitle(timeRange);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Github Activity</CardTitle>
          <CardDescription>
            Showing commit data for the past {subtitle}
          </CardDescription>
        </div>
        <div className="flex">
          <div className="mr-2 flex flex-1 flex-col justify-center gap-1 px-4 py-2 text-left sm:border-r">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total}
            </span>
          </div>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 90 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Last 12 months
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 90 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="commits" fill={`var(--color-commits)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type Interval = "12m" | "90d" | "30d";

function filterData(days: CalendarDay[], interval: Interval) {
  if (interval === "30d") return days.slice(days.length - 30);
  if (interval === "90d") return days.slice(days.length - 90);

  const weeks = new Array(53);
  let weekIdx = 52;
  let dayIdx = days.length - 1;

  while (dayIdx >= 0) {
    const week = { commits: 0, date: days[dayIdx]?.date };
    for (let idx = 0; idx < 7 && dayIdx >= 0; idx++) {
      week.commits += days[dayIdx]!.commits;
      dayIdx--;
    }
    weeks[weekIdx] = week;
    weekIdx--;
  }
  return weeks as CalendarDay[];
}

function getSubtitle(interval: Interval) {
  if (interval === "30d") return "30 days";
  if (interval === "90d") return "90 days";
  return "12 months";
}
