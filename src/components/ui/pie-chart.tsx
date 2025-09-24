"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartPieDonutTextProps = {
  confidence: number // 0–100
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "var(--chart-1)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartPieDonutText({ confidence }: ChartPieDonutTextProps) {
  // Ensure confidence stays between 0–100
  const safeConfidence = Math.max(0, Math.min(100, confidence))

  const chartData = [
    { name: "confidence", value: safeConfidence, fill: "var(--chart-1)" },
    { name: "remaining", value: 100 - safeConfidence, fill: "var(--chart-2)" },
  ]

  return (
    <Card className="flex flex-col bg-black/40 border border-white/10">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Confidence</CardTitle>
        <CardDescription>Model prediction certainty</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              startAngle={90}
              endAngle={-270} // makes the donut start at top
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {safeConfidence}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Confidence
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">

        <div className="text-muted-foreground leading-none">
          Showing model confidence as a percentage
        </div>
      </CardFooter>
    </Card>
  )
}
