import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FiArrowRight, FiClock, FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import './../css/Search.css';


const Search = ({
  isOpen,
  onClose,
  recentSearches = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  recentSearches: string[];
}) => {
  const [query, setQuery] = useState("");
  const [recentSearchItems,setRecentSearchItems]=useState(recentSearches)

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const POPULAR_SEARCHES = [
    "Dresses",
    "Jackets",
    "Shoes",
    "Bicycles",
    "Accessories",
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) return;

    navigate(`/shop?search=${encodeURIComponent(value)}`);

    onClose();
  };

  const handleRecentSearch = (value: string) => {
    setQuery(value);

    navigate(`/shop?search=${encodeURIComponent(value)}`);

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mobile-search">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="mobile-search__header">
        <button
          type="button"
          className="mobile-search__close"
          aria-label="Close search"
          onClick={onClose}
        >
          <FiX />
        </button>

        <span className="mobile-search__title">Search</span>

        <span className="mobile-search__spacer" />
      </header>

      {/* =====================================================
          SEARCH FORM
      ====================================================== */}

      <div className="mobile-search__content">
        <form
          className="mobile-search__form"
          onSubmit={handleSubmit}
        >
          <FiSearch className="mobile-search__icon" />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
            aria-label="Search products"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              className="mobile-search__clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <FiX />
            </button>
          )}

          <button
            type="submit"
            className="mobile-search__submit"
            aria-label="Search"
          >
            <FiArrowRight />
          </button>
        </form>

        {/* =================================================
            QUICK SEARCHES
        ================================================== */}

        {!query && (
          <section className="mobile-search__section">
            <span className="mobile-search__eyebrow">POPULAR SEARCHES</span>

            <div className="mobile-search__suggestions">
              {POPULAR_SEARCHES.map((SearchItem) => {
                return (
                  <button
                    type="button"
                    key={SearchItem}
                    onClick={() => handleRecentSearch("dresses")}
                  >
                    {SearchItem}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* =================================================
            RECENT SEARCHES
        ================================================== */}

        {!query && recentSearches.length > 0 && (
          <section className="mobile-search__section">
            <div className="mobile-search__section-heading">
              <span className="mobile-search__eyebrow">RECENT SEARCHES</span>

              <button
                type="button"
                className="mobile-search__clear-history"
                onClick={()=>setRecentSearchItems(()=>[])}
              >
                Clear
              </button>
            </div>

            <div className="mobile-search__recent">
              {recentSearchItems.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => handleRecentSearch(search)}
                >
                  <FiClock />

                  <span>{search}</span>

                  <FiArrowRight />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            EMPTY QUERY DISCOVERY
        ================================================== */}

        {!query && (
          <section className="mobile-search__discover">
            <div>
              <span className="mobile-search__eyebrow">
                NOT SURE WHERE TO START?
              </span>

              <h2>
                Find something
                <br />
                worth keeping.
              </h2>

              <Link
                to="/shop/categories"
                onClick={onClose}
              >
                Browse categories
                <FiArrowRight />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Search;
