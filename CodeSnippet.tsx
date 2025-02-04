"use client"

import { useState } from "react"

interface CodeSnippetProps {
  python: string
  sql: string
}

export default function CodeSnippet({ python, sql }: CodeSnippetProps) {
  const [activeTab, setActiveTab] = useState<"python" | "sql">("python")

  return (
    <div className="mt-2">
      <div className="flex space-x-2 mb-2">
        <button
          className={`px-2 py-1 rounded ${activeTab === "python" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("python")}
        >
          Python
        </button>
        <button
          className={`px-2 py-1 rounded ${activeTab === "sql" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("sql")}
        >
          SQL
        </button>
      </div>
      <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
        <code>{activeTab === "python" ? python : sql}</code>
      </pre>
    </div>
  )
}

