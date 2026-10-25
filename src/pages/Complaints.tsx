import { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../components";
import { ComplaintImageModal } from "../components/ComplaintImageModal";

import "../css/GenericViewLayout.css"; // Reuses your unified generic layout styles
import { useGetComplaintsQuery } from "../features/api/itemApi";
import type { TComplaints } from "../types/TComplaints";


const Complaints = () => {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const[openImageModal,setOpenImageModal] =useState<boolean>(false)
  const[selectedData,setSelectedData] =useState<TComplaints>()
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const currentTab = searchParams.get("status") || "ALL";
  const size = 10;



  //complaints
  const {data} = useGetComplaintsQuery({page,size})
  const complaints = data?.complaintResponseList|| []

  

  const handleTabChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    params.set("page", "1"); // Reset window to page 1 on filter flip
    setSearchParams(params);
  };
 


  // Filter pipeline handling query checks and sub-tab selection matrixes
  const filteredReports = complaints.filter((report) => {
    const query = search.toLowerCase().trim();
    const matchesTab = currentTab === "ALL" || report.status === currentTab;
    
    if (!matchesTab) return false;
    if (!query) return true;

    return (
      report.ticketId.toLowerCase().includes(query) ||
      report.orderNumber.toLowerCase().includes(query) ||
      report.user.toLowerCase().includes(query)
    );
  });

  const handleImageView =(complaint:TComplaints)=>{
    setOpenImageModal(true);
 setSelectedData(complaint)
  }

  const onCloseModal=()=>{
    setOpenImageModal(false)
   
  }
  return (
    <main className="panel-view">
      {/* =====================================================
                HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">Administration</span>
          <h1 className="panel-view__title">Customer Reports</h1>
          <p className="panel-view__description">
            Review and resolve open user disputes, marketplace fraud alerts, and platform bugs.
          </p>
        </div>
      </header>

      {/* =====================================================
                STATUS CONTROLS TABS
            ====================================================== */}
      <div className="panel-view__tab-group">
        {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED","APPROVED","RETURN_UPHELD", "REJECTED","AWAITING_RETURN_PAYMENT"].map((status) => (
          <button
            key={status}
            type="button"
            className={`panel-view__tab-btn ${currentTab === status ? "is-active" : ""}`}
            onClick={() => handleTabChange(status)}
          >
            {status.replace(/_/g, " ").toLowerCase()}
          </button>
        ))}
      </div>

      {/* =====================================================
                TOOLBAR
            ====================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by ticket, target ID, or reporter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="panel-view__metrics-counter">
          {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
        </div>
      </div>

      {/* =====================================================
                REPORTS TABLE DATA CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {filteredReports.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No reports found</div>
            <p>Everything looks clean! No community issues match the selected view filters.</p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Reporter</th>
                  <th>Target ID</th>
                  <th>Category</th>
                   <th>seller comment</th>
                     <th>Buyer comment</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="data-table__actions-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const normalizedStatus = report.status.toLowerCase().replace(/_/g, "-");
                  const normalizedIssue = report.reason.toLowerCase().replace(/_/g, " ");

                  return (
                    <tr key={report.id}>
                      {/* TICKET NUMBER */}
                      <td>
                        <span className="data-table__text font-bold text-main">
                          {report.ticketId}
                        </span>
                      </td>

                      {/* USER WHO REPORTED */}
                      <td>
                        <div className="data-table__user-profile">
                          <span className="data-table__avatar-badge">
                            {report.user.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-muted">{report.user}</span>
                        </div>
                      </td>

                      {/* TARGET REFERENCE CODE */}
                      <td>
                        <span className="data-table__text font-semibold text-primary">
                          {report.orderNumber}
                        </span>
                      </td>

                      {/* ISSUE CATEGORY */}
                      <td>
                        <span className="data-table__text font-semibold capital-first">
                          {normalizedIssue}
                        </span>
                      </td>
 {/* seller comment*/}
                      <td>
                        <span className="data-table__text font-semibold capital-first" style={{textWrap:'wrap'}}>
                          {report.sellerComment}
                        </span>
                      </td>
                       {/* buyer comment*/}
                      <td>
                        <span className="data-table__text font-semibold capital-first" style={{textWrap:'wrap'}}>
                          {report.buyerComment}
                        </span>
                      </td>
                      {/* STATUS BADGE COPIES */}
                      <td>
                        <span className={`status-badge status-badge--${normalizedStatus}`}>
                          {report.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* CREATION STAMP */}
                      <td>
                        <span className="data-table__text text-muted">
                          {new Date(report.createdAt).toLocaleDateString("pl-PL")}
                        </span>
                      </td>

                      {/* ACTIONS DRAWER BUTTON */}
                      <td>
                         <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="data-table__action-link"
                            title="Inspect dispute details"
                            onClick={() =>handleImageView(report)}
                          >
                            <FiEye/>
                          </button>
                        </div>
                      
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {
        selectedData && <ComplaintImageModal isOpen={openImageModal} onClose={onCloseModal} 
        orderNumber={selectedData.orderNumber} originalImages={selectedData.listingImages} complaintImages={selectedData.images}/>
      }
   
      {/* LOCALIZED PACING HOOKS */}
      {data && (
        <Pagination
        accumulated={data.accumulatedItems}
          page={page}
          totalPage={data.totalPages}
          size={data.pageSize}
          totalElements={data?.totalElements}
        />
      )}
    </main>
  );
};

export default Complaints