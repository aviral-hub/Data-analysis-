"use client"

import { useState } from "react"
import Papa from "papaparse"

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      Papa.parse(file, {
        complete: (result) => {
          onDataLoaded(result.data)
          setIsLoading(false)
        },
        header: true,
      })
    }
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      {isLoading && <p className="mt-2">Loading...</p>}
    </div>
  )
}

