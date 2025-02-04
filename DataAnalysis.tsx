"use client"

import { useEffect } from "react"

interface DataAnalysisProps {
  data: any[]
  onReportGenerated: (report: any) => void
}

export default function DataAnalysis({ data, onReportGenerated }: DataAnalysisProps) {
  useEffect(() => {
    const analyzeData = () => {
      const report = {
        missingValues: {},
        outliers: {},
        inconsistentFormats: {},
        duplicates: 0,
      }

      // Check for missing values
      Object.keys(data[0]).forEach((column) => {
        const missingCount = data.filter((row) => !row[column]).length
        if (missingCount > 0) {
          report.missingValues[column] = missingCount
        }
      })

      // Check for outliers (using IQR method for numeric columns)
      Object.keys(data[0]).forEach((column) => {
        const values = data.map((row) => Number.parseFloat(row[column])).filter((val) => !isNaN(val))
        if (values.length > 0) {
          const sorted = values.sort((a, b) => a - b)
          const q1 = sorted[Math.floor(sorted.length / 4)]
          const q3 = sorted[Math.floor((3 * sorted.length) / 4)]
          const iqr = q3 - q1
          const lowerBound = q1 - 1.5 * iqr
          const upperBound = q3 + 1.5 * iqr
          const outliers = values.filter((val) => val < lowerBound || val > upperBound)
          if (outliers.length > 0) {
            report.outliers[column] = outliers.length
          }
        }
      })

      // Check for inconsistent formats (focusing on date columns)
      Object.keys(data[0]).forEach((column) => {
        if (column.toLowerCase().includes("date")) {
          const formats = new Set(data.map((row) => row[column]))
          if (formats.size > 1) {
            report.inconsistentFormats[column] = Array.from(formats)
          }
        }
      })

      // Check for duplicates
      const stringifiedRows = data.map((row) => JSON.stringify(row))
      report.duplicates = stringifiedRows.length - new Set(stringifiedRows).size

      onReportGenerated(report)
    }

    analyzeData()
  }, [data, onReportGenerated])

  return <div className="mb-4">Analyzing data...</div>
}

