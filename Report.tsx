"use client"

import CodeSnippet from "./CodeSnippet"

interface ReportProps {
  report: {
    missingValues: Record<string, number>
    outliers: Record<string, number>
    inconsistentFormats: Record<string, string[]>
    duplicates: number
  }
}

export default function Report({ report }: ReportProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Quality Report</h2>

      <section>
        <h3 className="text-xl font-semibold">Missing Values</h3>
        {Object.keys(report.missingValues).length > 0 ? (
          <ul className="list-disc pl-5">
            {Object.entries(report.missingValues).map(([column, count]) => (
              <li key={column}>
                {column}: {count} missing values
                <CodeSnippet
                  python={`# Remove rows with missing values in ${column}
df = df.dropna(subset=['${column}'])

# Or fill missing values with a specific value
df['${column}'].fillna(value, inplace=True)`}
                  sql={`-- Remove rows with missing values in ${column}
DELETE FROM table_name WHERE ${column} IS NULL;

-- Or update missing values with a specific value
UPDATE table_name SET ${column} = 'value' WHERE ${column} IS NULL;`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No missing values found.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold">Outliers</h3>
        {Object.keys(report.outliers).length > 0 ? (
          <ul className="list-disc pl-5">
            {Object.entries(report.outliers).map(([column, count]) => (
              <li key={column}>
                {column}: {count} outliers detected
                <CodeSnippet
                  python={`# Remove outliers using IQR method
Q1 = df['${column}'].quantile(0.25)
Q3 = df['${column}'].quantile(0.75)
IQR = Q3 - Q1
df = df[~((df['${column}'] < (Q1 - 1.5 * IQR)) | (df['${column}'] > (Q3 + 1.5 * IQR)))]`}
                  sql={`-- Identify outliers using IQR method (requires a more complex query)
WITH stats AS (
  SELECT
    AVG(${column}) AS mean,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY ${column}) AS Q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ${column}) AS Q3
  FROM table_name
)
SELECT *
FROM table_name, stats
WHERE ${column} < (Q1 - 1.5 * (Q3 - Q1)) OR ${column} > (Q3 + 1.5 * (Q3 - Q1));`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No outliers detected.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold">Inconsistent Formats</h3>
        {Object.keys(report.inconsistentFormats).length > 0 ? (
          <ul className="list-disc pl-5">
            {Object.entries(report.inconsistentFormats).map(([column, formats]) => (
              <li key={column}>
                {column}: Inconsistent formats detected - {formats.join(", ")}
                <CodeSnippet
                  python={`# Convert ${column} to a consistent datetime format
df['${column}'] = pd.to_datetime(df['${column}'], infer_datetime_format=True)

# Or specify a format if known
df['${column}'] = pd.to_datetime(df['${column}'], format='%Y-%m-%d')`}
                  sql={`-- Convert ${column} to a consistent date format (adjust the format string as needed)
UPDATE table_name
SET ${column} = TO_DATE(${column}, 'YYYY-MM-DD');`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No inconsistent formats detected.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold">Duplicates</h3>
        <p>{report.duplicates} duplicate rows found.</p>
        {report.duplicates > 0 && (
          <CodeSnippet
            python={`# Remove duplicate rows
df = df.drop_duplicates()

# Or keep only the first occurrence
df = df.drop_duplicates(keep='first')`}
            sql={`-- Remove duplicate rows (adjust the columns as needed)
WITH duplicates AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY column1, column2, ... ORDER BY column1) AS row_num
  FROM table_name
)
DELETE FROM duplicates WHERE row_num > 1;`}
          />
        )}
      </section>
    </div>
  )
}

