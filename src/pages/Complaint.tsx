import { useState } from "react";
import { FiEdit, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import "../css/GenericViewLayout.css"; // Reuses your unified generic layout styles
import { useGetComplaintsQuery } from "../features/api/itemApi";
import "./../css/Complaint.css"; // Layout-specific styling updates



const Complaint = () => {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  
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
        {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"].map((status) => (
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
                  <th>Description Preview</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="data-table__actions-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const normalizedStatus = report.status.toLowerCase().replace(/_/g, "-");
                  const normalizedIssue = report.issue.toLowerCase().replace(/_/g, " ");

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

                      {/* DESCRIPTION SUMMARY */}
                      <td>
                        <span className="data-table__text text-muted" title={report.description} style={{ whiteSpace: "normal", minWidth: "220px", display: "inline-block" }}>
                          {report.description.substring(0, 45)}...
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
                            onClick={() => alert(`Reviewing details for ticket: ${report.orderNumber}`)}
                          >
                            <FiEdit/>
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
    </main>
  );
};

export default Complaint
