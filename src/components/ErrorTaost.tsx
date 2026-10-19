import { FiLock } from "react-icons/fi";
import "../css/ErrorToast.css";

interface ErrorToastProps {
  errorMessage: string;
}

export const ErrorToast = ({ errorMessage }: ErrorToastProps) => {
  if (typeof errorMessage !== "string" || !errorMessage.trim()) {
    return null;
  }

  return (
    <div className="cart-alert-summary" role="alert">
      <div className="cart-alert-row cart-alert-row--reserved">
        <FiLock className="cart-alert-icon" />
        <p className="cart-alert-message">{errorMessage}</p>
      </div>
    </div>
  );
};