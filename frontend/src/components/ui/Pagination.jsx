/**
 * Pagination Component
 * Responsive pagination with page numbers and navigation
 */
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisible = 5,
    showFirstLast = true,
    className = ''
}) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPageNumbers();

    const PageButton = ({ page, children, disabled = false, active = false }) => (
        <button
            onClick={() => !disabled && !active && onPageChange(page)}
            disabled={disabled}
            className={`
        px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${active
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {children}
        </button>
    );

    return (
        <nav
            className={`flex items-center justify-center gap-1 ${className}`}
            aria-label="Pagination"
        >
            {/* First Page */}
            {showFirstLast && currentPage > 1 && (
                <PageButton page={1} disabled={currentPage === 1}>
                    First
                </PageButton>
            )}

            {/* Previous */}
            <PageButton page={currentPage - 1} disabled={currentPage === 1}>
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </PageButton>

            {/* Page Numbers */}
            <div className="hidden sm:flex gap-1">
                {pages[0] > 1 && (
                    <>
                        <PageButton page={1}>1</PageButton>
                        {pages[0] > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <PageButton key={page} page={page} active={page === currentPage}>
                        {page}
                    </PageButton>
                ))}

                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && (
                            <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                        <PageButton page={totalPages}>{totalPages}</PageButton>
                    </>
                )}
            </div>

            {/* Mobile: Current Page Indicator */}
            <div className="sm:hidden px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </div>

            {/* Next */}
            <PageButton page={currentPage + 1} disabled={currentPage === totalPages}>
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </PageButton>

            {/* Last Page */}
            {showFirstLast && currentPage < totalPages && (
                <PageButton page={totalPages} disabled={currentPage === totalPages}>
                    Last
                </PageButton>
            )}
        </nav>
    );
}
