import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiSearch, FiXCircle } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

import "../css/GenericViewLayout.css";
import { useGetSellersQuery } from "../features/api/sellerApi";
import type {
    TListPageSellerProfile,
    TSellers
} from "../types/TListPageSellerProfile";
import { isFetchBaseQueryError } from "../util/util";
import Loading from "./Loading";
import Pagination from "./Pagination";
import SellerProfileStatusModal from "./SellerProfileStatusModal";

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value ?? 0);

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
  }).format(date);
};

const StatusBadge = ({
  active,
  activeLabel = "Yes",
  inactiveLabel = "No",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) => (
  <span
    className={`status-badge status-badge--${active ? "active" : "inactive"}`}
    style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
  >
    {active ? <FiCheckCircle /> : <FiXCircle />}
    {active ? activeLabel : inactiveLabel}
  </span>
);

const SellerProfileView = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const[openModal,setOpenModal]=useState<boolean>(false);
  const[selectedSeller,setSellectedSeller]=useState<{sellerId:number,
  sellerName: string,
  currentStatus: string;}| null>()


  // Pagination is kept 1-indexed in the URL.
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));



  const {
    data,
    isLoading: sellersLoading,
    error: sellersError,
  } = useGetSellersQuery(
    {
      query: search,
      page,
      size: 10,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const response = data as TListPageSellerProfile | undefined;
  const sellers = response?.sellers ?? [];


  const getStatusLabel = (status?: string) => {
    if (!status) return "Unknown";

    return t(`seller_profiles.statuses.${status.toLowerCase()}`, {
      defaultValue: status,
    });
  };


  if (sellersLoading && !response) {
    return <Loading />;
  }

  const onClose=()=>{
    setOpenModal(false);
    setSellectedSeller(null)
  }

  const handleChangeRequest =(seller:TSellers)=>{
    setOpenModal(true);
    setSellectedSeller({sellerId:seller.sellerId,sellerName:String(seller.fullLegalName),currentStatus:seller.status})
  }
  return (
    <main className="panel-view">
      {/* HEADER */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">Seller management</span>

          <h1 className="panel-view__title">Seller Profiles</h1>

          <p className="panel-view__description">
            Manage seller identities, financial activity, DAC7 reporting and
            Stripe payment accounts.
          </p>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />

          <input
            type="text"
            placeholder="Search sellers by legal name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {response?.accumulatedItems ?? sellers.length} Sellers
        </div>
      </div>

      {/* ERROR */}
      {sellersError && (
        <div className="panel-view__error-box">
          {isFetchBaseQueryError(sellersError)}
        </div>
      )}

      {/* SELLER TABLE */}
      <section className="panel-view__content-card">
        {sellersLoading ? (
          <div className="panel-view__loading-overlay">Loading sellers...</div>
        ) : sellers.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No sellers found</div>

            <p>
              {search
                ? "No sellers match your search."
                : "No seller profiles are available yet."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Account status</th>
                  <th>Identity</th>
                  <th>Date of birth</th>
                  <th>Lifetime sales</th>
                  <th>Total settlement</th>
                  <th>Current-year volume</th>
                  <th>Year sales count</th>
                  <th>DAC7</th>
                  <th>Stripe account</th>
                  <th>Charges</th>
                  <th>Payouts</th>
                  <th>Transfers</th>
                  <th>Stripe updated</th>
                  <th>Cancelled orders</th>
                         <th>action</th>
                </tr>
              </thead>

              <tbody>
                {sellers.map((seller, index) => (
                  <tr key={seller.userId ?? `${seller.fullLegalName}-${index}`}>
                    {/* SELLER */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {seller.fullLegalName?.charAt(0)?.toUpperCase() ??
                            "S"}
                        </span>

                        <div>
                          <div className="font-semibold text-main">
                            {seller.fullLegalName || "Unknown seller"}
                          </div>
                          <span className="data-table__text text-muted">
                            User #{seller.userId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ACCOUNT STATUS */}
                    <td>
                      <span
                        className={`status-badge status-badge--${seller.status
                          ?.toLowerCase()
                          .replace(/_/g, "-")}`}
                      >
                        {getStatusLabel(seller.status)}
                      </span>
                    </td>

                    {/* IDENTITY */}
                    <td>
                      <StatusBadge
                        active={seller.identityVerified}
                        activeLabel="Verified"
                        inactiveLabel="Pending"
                      />
                    </td>

                    {/* DATE OF BIRTH */}
                    <td>{formatDate(seller.dateOfBirth)}</td>

                    {/* LIFETIME SALES */}
                    <td>
                      <span className="data-table__text font-semibold">
                        {formatCurrency(seller.totalSales)}
                      </span>
                    </td>

                    {/* TOTAL SETTLEMENT */}
                    <td>
                      <span className="data-table__text font-semibold">
                        {formatCurrency(seller.totalSettlement)}
                      </span>
                    </td>

                    {/* CURRENT YEAR GROSS VOLUME */}
                    <td>
                      <span className="data-table__text font-semibold">
                        {formatCurrency(seller.currentYearGrossVolumePln)}
                      </span>
                    </td>

                    {/* CURRENT YEAR SALES COUNT */}
                    <td>{seller.currentYearSalesCount ?? 0}</td>

                    {/* DAC7 */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <StatusBadge
                          active={seller.isDac7Reportable}
                          activeLabel="Reportable"
                          inactiveLabel="Not reportable"
                        />

                        {seller.dac7FlaggedAt && (
                          <span className="data-table__text text-muted">
                            Flagged: {formatDate(seller.dac7FlaggedAt)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STRIPE ACCOUNT */}
                    <td>
                      {seller.stripeAccountId ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                          }}
                        >
                          <span className="data-table__text font-semibold">
                            Connected
                          </span>
                          <span className="data-table__text text-muted">
                            {seller.stripeAccountId}
                          </span>
                          <span className="data-table__text text-muted">
                            {seller.stripeOnboardingComplete
                              ? "Onboarding complete"
                              : "Onboarding incomplete"}
                          </span>
                        </div>
                      ) : (
                        <span className="data-table__text text-muted">
                          Not connected
                        </span>
                      )}
                    </td>

                    {/* STRIPE CHARGES */}
                    <td>
                      <StatusBadge
                        active={seller.stripeChargesEnabled}
                        activeLabel="Enabled"
                        inactiveLabel="Disabled"
                      />
                    </td>

                    {/* STRIPE PAYOUTS */}
                    <td>
                      <StatusBadge
                        active={seller.stripePayoutsEnabled}
                        activeLabel="Enabled"
                        inactiveLabel="Disabled"
                      />
                    </td>

                    {/* STRIPE TRANSFERS */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <StatusBadge
                          active={seller.stripeTransfersEnabled}
                          activeLabel="Enabled"
                          inactiveLabel="Disabled"
                        />
                        {seller.stripeTransfersStatus && (
                          <span className="data-table__text text-muted">
                            {seller.stripeTransfersStatus}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STRIPE ACCOUNT UPDATED */}
                    <td>{formatDate(seller.stripeAccountUpdatedAt)}</td>

                    {/* CANCELLED ORDERS */}
                    <td>
                      <span className="data-table__text">
                        {seller.numberOfCancelledOrders ?? 0}
                      </span>
                    </td>
                      <td>
                     <button className="data-table__btn" onClick={()=>handleChangeRequest(seller)}>
                        change status
                     </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {response && (
        <Pagination
          accumulated={response.accumulatedItems}
          page={page}
          totalPage={response.totalPages}
          size={response.pageSize}
          totalElements={response.totalElements}
        />
      )}
      {
        openModal &&
        <SellerProfileStatusModal isOpen={openModal} sellerId={Number(selectedSeller?.sellerId)}
         sellerName={String(selectedSeller?.sellerName)}
          currentStatus={String(selectedSeller?.currentStatus)} onClose={onClose}/>
      }
    </main>
  );
};

export default SellerProfileView;
