import React from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface AccessibleDataTableProps<T> {
  caption: string;
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function AccessibleDataTable<T>({
  caption,
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No data available.',
  className = ''
}: AccessibleDataTableProps<T>) {
  return (
    <div className={`overflow-x-auto w-full rounded-lg border border-brand-border bg-brand-elevated/40 ${className}`}>
      <table className="min-w-full divide-y divide-brand-border text-left text-sm">
        {/* Caption is essential for table screen-reader identification */}
        <caption className="sr-only">{caption}</caption>
        
        <thead>
          <tr className="bg-brand-elevated/80 font-semibold text-slate-700 dark:text-slate-300">
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-4 py-3 text-xs uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-brand-border/60 bg-transparent text-slate-800 dark:text-slate-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-slate-500 text-xs italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors"
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 whitespace-nowrap align-middle ${col.className || ''}`}
                  >
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
