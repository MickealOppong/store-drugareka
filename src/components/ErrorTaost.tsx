import { FiLock } from "react-icons/fi"; // Visual anchor for reserved items
import '../css/ErrorToast.css';
export const ErrorToast = ({ errorMessage }:{errorMessage:string}) => {
  if (!errorMessage) return null;

  return (
    <div className="cart-alert-summary" role="alert">
      <div className="cart-alert-row cart-alert-row--reserved">
        <FiLock className="cart-alert-icon" />
        <p className="cart-alert-message">{errorMessage}</p>
      </div>
    </div>
  );
};
