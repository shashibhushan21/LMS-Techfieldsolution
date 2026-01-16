/**
 * ResponsiveTable Component
 * Mobile-friendly table that switches to card view on small screens
 */
export default function ResponsiveTable({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    className = ''
}) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        onClick={() => onRowClick && onRowClick(row)}
                        className={`
              bg-white border border-gray-200 rounded-lg p-4 space-y-3
              ${onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
            `}
                    >
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="flex justify-between items-start">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {column.header}
                                </span>
                                <span className="text-sm text-gray-900 text-right ml-4">
                                    {column.render ? column.render(row) : row[column.accessor]}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
