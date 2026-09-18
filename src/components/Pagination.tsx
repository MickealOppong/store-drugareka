import { useLocation, useNavigate } from "react-router";
import "../css/Pagination.css";

interface PaginationProps {
    page: number;        // 1-indexed current page from URL/API
    totalPage: number;   // 1-indexed total pages
    size: number;        // Elements in current view
}

const Pagination = ({ page, totalPage, size }: PaginationProps) => {
    const navigate = useNavigate();
    const { search, pathname } = useLocation();

    if (totalPage <= 1) {
        return null;
    }

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPage || pageNumber === page) {
            return;
        }

        const searchParams = new URLSearchParams(search);
        searchParams.set("page", String(pageNumber));
        navigate(`${pathname}?${searchParams.toString()}`);
    };

    /*
     * =====================================================
     * FIXED-SIZE PAGINATION RANGE GENERATOR
     * =====================================================
     * Generates a stable array count that never shifts layout size.
     */
    const generateConstantRange = (): (number | string)[] => {
        const totalItemsCount = 5 

        // Case 1: If total pages are 7 or less, show them all directly without any dots
        if (totalPage <= totalItemsCount) {
            return Array.from({ length: totalPage }, (_, idx) => idx + 1);
        }

        const leftSiblingIndex = Math.max(page - 1, 1);
        const rightSiblingIndex = Math.min(page + 1, totalPage);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPage - 1;

        // Case 2: Dots on the right side only (Near the start) -> Fits exactly 7 elements
        if (!shouldShowLeftDots && shouldShowRightDots) {
            return [1, 2, 3, 4, 5, "DOTS", totalPage];
        }

        // Case 3: Dots on the left side only (Near the end) -> Fits exactly 7 elements
        if (shouldShowLeftDots && !shouldShowRightDots) {
            return [1, "DOTS", totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
        }

        // Case 4: Dots on both sides (Middle block window) -> Fits exactly 7 elements
        return [1, "DOTS", page - 1, page, page + 1, "DOTS", totalPage];
    };

    const pagesRange = generateConstantRange();

    return (
        <div className="pagination-wrapper-row">
            {/* Entries Metadata Section */}
            <div className="pagination-entries-info">
                <p>showing</p>
                <p className="entries-count-badge">{size}</p>
                <p>entries</p>
            </div>

            {/* Navigation Element Control Group */}
            <nav className="pagination-nav-container" aria-label="Pagination Navigation">
                
                {/* Prev Button */}
                <button
                    type="button"
                    className="pagination-btn arrow-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    prev
                </button>

                {/* Render the fixed-length layout range smoothly */}
                {pagesRange.map((item, index) => {
                    if (item === "DOTS") {
                        return (
                            <span key={`dots-${index}`} className="pagination-ellipsis">
                                &#8230;
                            </span>
                        );
                    }

                    const pageNumber = item as number;
                    const isActive = pageNumber === page;

                    return (
                        <button
                            key={`page-${pageNumber}`}
                            type="button"
                            className={`pagination-btn number-btn ${isActive ? "is-active" : ""}`}
                            onClick={() => handlePageChange(pageNumber)}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    type="button"
                    className="pagination-btn arrow-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPage}
                >
                    next
                </button>

            </nav>
        </div>
    );
};

export default Pagination;
