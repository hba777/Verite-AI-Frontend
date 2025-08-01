"use client"

import * as React from "react"

import { Progress } from "@/features/Dashboard/ProgressBar/progress"

interface ProgressDemoProps {
  uploadProgress?: number;
}

export function ProgressDemo({ uploadProgress }: ProgressDemoProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (uploadProgress !== undefined) {
      setProgress(uploadProgress);
    }
  }, [uploadProgress]);

  return <Progress value={progress} className="w-[80%]" />
}
