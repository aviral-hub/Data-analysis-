"use client"

import { useState } from "react"
import FileUpload from "./components/FileUpload"
import DataAnalysis from "./components/DataAnalysis"
import Report from "./components/Report"

export default function Home() {
  const [data, setData] = useState<any[] | null>(null)
  const [report, setReport] = useState<any | null>(null)

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Data Quality Analyzer</h1>
      {!data && <FileUpload onDataLoaded={setData} />}
      {data && !report && <DataAnalysis data={data} onReportGenerated={setReport} />}
      {report && <Report report={report} />}
    </main>
  )
}

