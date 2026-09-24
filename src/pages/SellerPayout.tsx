import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router";
import { Pagination, PayoutStatusModal } from "../components";
import '../css/GenericViewLayout.css';
import { useGetMyPayoutsQuery } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TPayout } from "../types/TPayout";

const SellerPayout = () => {
  const roles = useAppSelector((state)=>state.userSlice.roles)
  const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const[payout,setPayout] =useState<TPayout|null>(null)

  const page = parseInt(searchParams.get("page") || "1");

  // Read data stream array from user API query injection
  const { data} = useGetMyPayoutsQuery({page,size:5});

  const payouts = data?.payouts || []
  /*
   * Filter calculation stream based on search criteria
   */
  const filteredPayouts = payouts.filter((payout) =>
    payout.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  

  const openStatusModal = (payout:TPayout)=>{
    setModalOpen(true)
      setPayout(payout)
  } 

  const closeModal = ()=>{
    setModalOpen(false)
  }
  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">{t("payouts.header.eyebrow")}</span>
          <h1 className="panel-view__title">{t("payouts.header.title")}</h1>
          <p className="panel-view__description">
            {t("payouts.header.description")}
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
            placeholder={t("payouts.toolbar.search_placeholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredPayouts.length}{" "}
          {filteredPayouts.length === 1 
            ? t("payouts.toolbar.count_singular") 
            : t("payouts.toolbar.count_plural")}
        </div>
      </div>

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {filteredPayouts.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">{t("payouts.empty.title")}</div>
            <p>
              {search
                ? t("payouts.empty.search_desc")
                : t("payouts.empty.default_desc")}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("payouts.table.headers.seller")}</th>
                  <th>{t("payouts.table.headers.payout_id")}</th>
                  <th>{t("payouts.table.headers.order")}</th>
                  <th>{t("payouts.table.headers.status")}</th>
                  <th>{t("payouts.table.headers.currency")}</th>
                  <th>{t("payouts.table.headers.total")}</th>
                  {
                    roles.includes('ROLE_ADMIN') &&
                    <th>{t("payouts.table.headers.actions")}</th>
                  }
                </tr>
              </thead>

              <tbody>
                {filteredPayouts.map((payout) => {
                  // Standardizes status tokens (e.g., PENDING_PAYOUT -> pending-payout) to load correct style sheets
                  const normalizedStatusClass = payout.status?.toLowerCase().replace(/_/g, "-");
                     {/* =================================================
                      ISOLATED DECOUPLED INLINE DIALOG SUB-PANEL
                  ================================================== */}
          
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
                         {t(`payouts.table.statuses.${payout.status.toLowerCase()}`)}
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
                      {
                        roles.includes('ROLE_ADMIN')&&
                          <td>
                       <div className="data-table__actions">
                          <button
                            type="button"
                            className="data-table__action-link"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            title={t("shipments.actions.edit_hint")}
                            onClick={() => openStatusModal(payout)}
                          >
                            <FiEdit />
                          </button>
                        </div>
                      </td>
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    {data && (
        <Pagination
          page={page}
          totalPage={data.totalPages}
          size={data.pageSize} totalElements={data.totalElements}          
        />
      )}
      {
        modalOpen && <PayoutStatusModal data={payout as TPayout} isOpen={modalOpen} onButtonClick={closeModal}/>
      }
    
    </main>
    
  );
};

export default SellerPayout;
