import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import "./../css/ErrorPage.css";

export const ErrorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const error = useRouteError();
  
  console.error("Kasoa routing system exception trapped:", error);

  // 🚀 HIGH-PERFORMANCE ERROR PARSING LOGIC
  let errorMessage = t("error_page.fallbacks.generic_message");
  let errorHeading = t("error_page.fallbacks.generic_title");
  let statusCode = "500";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status.toString();
    if (error.status === 404) {
      errorHeading = t("error_page.errors.404.title");
      errorMessage = t("error_page.errors.404.message");
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <main className="error-viewport">
      <section className="error-viewport__card">
        
        {/* Animated Accent Vector Frame */}
        <div className="error-viewport__icon-container">
          <FiAlertTriangle />
        </div>

        <div className="error-viewport__status-badge">
          Status Code: <code>{statusCode}</code>
        </div>

        <h1 className="error-viewport__title">
          {errorHeading}
        </h1>

        <p className="error-viewport__message">
          {errorMessage}
        </p>

        {/* RECOVER TRIGGER SYSTEM NAVIGATION ACTIONS BUTTONS */}
        <div className="error-viewport__actions-grid">
          <button
            type="button"
            className="sl-btn sl-btn--primary error-viewport__btn"
            onClick={() => navigate("/")}
          >
            <FiHome />
            <span>{t("error_page.buttons.go_home")}</span>
          </button>

          <button
            type="button"
            className="sl-btn sl-btn--secondary error-viewport__btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            <span>{t("error_page.buttons.go_back")}</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
