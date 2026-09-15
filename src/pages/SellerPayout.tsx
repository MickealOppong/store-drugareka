import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import { useGetMyPayoutsQuery } from "../features/api/userApi";
import './../css/GenericViewLayout.css'; // Reuses your unified generic layout styles seamlessly

const SellerLayout = () => {
  const [search, setSearch] = useState("");

  // Read data stream array from user API query injection
  const { data: payouts = [] } = useGetMyPayoutsQuery();

  /*
   * Filter calculation stream based on search criteria
   */
  const filteredPayouts = payouts.filter((payout) =>
    payout.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">Listing payout</span>
          <h1 className="panel-view__title">Wypłaty</h1>
          <p className="panel-view__description">
            Zarządzaj swoimi wypłatami i rozliczeniami salda.
          </p>
        </div>
      </header>

      {/* =====================================================
                GENERIC TOOLBAR GRID
            ====================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="Szukaj po numerze zamówienia..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredPayouts.length}{" "}
          {filteredPayouts.length === 1 ? "wypłata" : "wypłaty"}
        </div>
      </div>

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {filteredPayouts.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">Brak wypłat</div>
            <p>
              {search
                ? "Nie znaleziono rozliczeń pasujących do wyszukiwania."
                : "Nie zarejestrowano jeszcze żadnych wypłat na Twoim koncie."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sprzedawca</th>
                  <th>ID Rozliczenia</th>
                  <th>Zamówienie</th>
                  <th>Status</th>
                  <th>Waluta</th>
                  <th>Suma</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayouts.map((payout) => {
                  // Standardizes status tokens (e.g., PENDING_PAYOUT -> pending-payout) to load correct style sheets
                  const normalizedStatusClass = payout.status?.toLowerCase().replace(/_/g, "-");
                  const humanReadableStatus = payout.status?.replace(/_/g, " ");

                  return (
                    <tr key={payout.id}>
                      <td>
                        <div className="data-table__user-profile">
                          <span className="data-table__avatar-badge">
                            {payout.seller?.charAt(0)?.toUpperCase()}
                          </span>
                          <span>{payout.seller}</span>
                        </div>
                      </td>
                      
                      <td>
                        <span className="data-table__text text-muted">
                          #{payout.id}
                        </span>
                      </td>

                      <td>
                        <span className="data-table__text font-semibold text-main">
                          {payout.orderNumber}
                        </span>
                      </td>
                      
                      <td>
                        <span className={`status-badge status-badge--${normalizedStatusClass}`}>
                          {humanReadableStatus}
                        </span>
                      </td>
                      
                      <td>
                        <span className="data-table__text text-muted">
                          {payout.currency}
                        </span>
                      </td>
                      
                      <td>
                        <span className="data-table__text font-bold text-primary">
                          {payout.amount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default SellerLayout;
