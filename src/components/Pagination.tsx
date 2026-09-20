import { useLocation, useNavigate } from "react-router-dom";
import "../css/Pagination.css";

interface PaginationProps {
  page: number;        // 1-indexed current page from URL
  totalPage: number;   // 1-indexed total pages from Spring Boot payload
  size: number;        // Elements in current view
}

export const Pagination = ({ page, totalPage, size }: PaginationProps) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  // If there's 1 page or less, hide the navigation layout completely to save vertical space
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
   * FIXED-SIZE PAGINATION RANGE GENERATOR (FIXED)
   * =====================================================
   * Aligns window boundaries to exactly 7 structural slots
   * across all conditional navigational view windows.
   */
  const generateConstantRange = (): (number | string)[] => {
    const maxVisibleSlots = 7; // 🚀 FIXED: Locked boundary to match array sizes perfectly

    // Case 1: If total pages fit completely within our max visible slots, show them all directly
    if (totalPage <= maxVisibleSlots) {
      return Array.from({ length: totalPage }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(page - 1, 1);
    const rightSiblingIndex = Math.min(page + 1, totalPage);

    // Dynamic checks determining if ellipsis nodes are required
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPage - 1;

    // Case 2: Ellipsis on the right side only (Near the start of catalog lines) -> Exactly 7 elements
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [1, 2, 3, 4, 5, "DOTS", totalPage];
    }

    // Case 3: Ellipsis on the left side only (Near the end of catalog lines) -> Exactly 7 elements
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [1, "DOTS", totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    }

    // Case 4: Ellipsis on both sides (Middle block window floating through records) -> Exactly 7 elements
    return [1, "DOTS", page - 1, page, page + 1, "DOTS", totalPage];
  };

  const pagesRange = generateConstantRange();

  return (
    <div className="ks-pagination">
      {/* Entries Metadata Section */}
      <div className="ks-pagination__info">
        <span>showing</span>
        <strong className="ks-pagination__badge">{size}</strong>
        <span>entries</span>
      </div>

      {/* Navigation Element Control Group */}
      <nav className="ks-pagination__nav" aria-label="Pagination Navigation">
        
        {/* Prev Button */}
        <button
          type="button"
          className="ks-pagination__btn ks-pagination__btn--arrow"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          prev
        </button>

        {/* Render the fixed-length layout range smoothly */}
        {pagesRange.map((item, index) => {
          if (item === "DOTS") {
            return (
              <span key={`dots-${index}`} className="ks-pagination__ellipsis">
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
              className={`ks-pagination__btn ks-pagination__btn--number ${isActive ? "is-active" : ""}`}
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
          className="ks-pagination__btn ks-pagination__btn--arrow"
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
