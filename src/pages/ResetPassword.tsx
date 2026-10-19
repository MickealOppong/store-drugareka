import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheckCircle, FiLock, FiMail } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/ResetPassword.scss";
import { useChangePasswordMutation, useResetPasswordRequestMutation } from "../features/api/authApi";
import type { TChangePasswordDto } from "../types/TChangePasswordDto";
import type { TResponseDto } from "../types/TResponseDto";

export const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const navigate = useNavigate();

  const [resetPasswordRequest, { isLoading }] = useResetPasswordRequestMutation();
  const[changePassword,{isLoading:changingPassword}] =useChangePasswordMutation()
  

  // Controlled State Parameters
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  // Feedback Notifications States
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear errors when shifting views dynamically
  useEffect(() => {
    setValidationError(null);
    setSuccessMessage("");
  }, [token]);

  const handleRequestLinkSubmit = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage("");

    try {
      
      const response = await resetPasswordRequest(email.trim()).unwrap();
      console.log(response);
      
      setSuccessMessage(t("auth.reset.link_sent_success", { 
        defaultValue: "A secure recovery link has been dispatched to your email inbox." 
      }));
    } catch (error: any) {
      setValidationError(error?.data?.message || t("auth.reset.errors.request_failed", {
        defaultValue: "Unable to request a reset link. Please verify your email address."
      }));
    }
  };

  const handleSetNewPasswordSubmit = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage("");

    // Front-End Verification Shield Guard
    if (newPassword.length < 8) {
      setValidationError(t("auth.reset.errors.password_length", { defaultValue: "Password must be at least 8 characters long." }));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setValidationError(t("auth.reset.errors.password_mismatch", { defaultValue: "New passwords do not match." }));
      return;
    }

    const dto:TChangePasswordDto = {
      newPassword,
      confirmNewPassword,
      token:String(token)
    }
    
    try {
      //  Pass both the secure verification token and your verified password properties
     const response=  await changePassword(dto);
    
    
      const {httpStatus,message} = response.data as TResponseDto
      if(httpStatus===200){
          setSuccessMessage(message);
      
      setTimeout(() => navigate("/login"), 3000); // Route back to login panel after 3 seconds
      }else{
              setSuccessMessage(message);
      }
  
      
    } catch (error: any) {
       const { status } = error as {
          status: number | string;
          message: string;
        };

        // Handle Redux Network Level Errors (FETCH_ERROR)
        if (status === "FETCH_ERROR") {
          setValidationError("NETWORK_ERROR");
          return;
        }

        if (status === 500 || status === 401) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };

          setValidationError(errorResponse.error);
        }
      }

  };

  
  /* ==========================================================================
     PATH A: CHANGE / SET NEW PASSWORD VIEW (Token Present in URL Parameter)
     ========================================================================== */
  if (token) {
    return (
      <main className="auth-view">
        <section className="auth-card">
          <header className="auth-card__header">
            <div className="auth-card__icon-badge"><FiLock /></div>
            <h1 className="auth-card__title">{t("auth.reset.set_title", "Set New Password")}</h1>
            <p className="auth-card__description">{t("auth.reset.set_description", "Please configure your secure alternative credentials profile below.")}</p>
          </header>

          <form className="auth-card__form" onSubmit={handleSetNewPasswordSubmit}>
            <div className="auth-card__field">
              <label htmlFor="new-password-input" className="auth-card__label">{t("auth.reset.fields.new_password", "New Password")}</label>
              <div className="auth-card__input-wrapper">
                <FiLock className="auth-card__input-icon" />
                <input
                  id="new-password-input"
                  type="password"
                  className="auth-card__input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="auth-card__field">
              <label htmlFor="confirm-password-input" className="auth-card__label">{t("auth.reset.fields.confirm_password", "Confirm New Password")}</label>
              <div className="auth-card__input-wrapper">
                <FiLock className="auth-card__input-icon" />
                <input
                  id="confirm-password-input"
                  type="password"
                  className="auth-card__input"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
                  disabled={isLoading || changingPassword}
                  required
                />
              </div>
            </div>

            {(validationError || successMessage) && (
              <div className={`auth-card__alert ${validationError ? "auth-card__alert--error" : "auth-card__alert--success"}`}>
                {validationError ? <FiAlertCircle /> : <FiCheckCircle />}
                <span>{validationError || successMessage}</span>
              </div>
            )}

            <button type="submit" className="auth-card__btn-submit" disabled={isLoading || changingPassword}>
              {isLoading || changingPassword? t("auth.reset.buttons.processing", "Updating...") : t("auth.reset.buttons.submit_new", "Update Password")}
            </button>
          </form>
        </section>
      </main>
    );
  }

  /* ==========================================================================
     PATH B: FORGOT / REQUEST RESET LINK VIEW (Default Initial State)
     ========================================================================== */
  return (
    <main className="auth-view">
      <section className="auth-card">
        <header className="auth-card__header">
          <div className="auth-card__icon-badge"><FiMail /></div>
          <h1 className="auth-card__title">{t("auth.reset.req_title", "Reset Password")}</h1>
          <p className="auth-card__description">{t("auth.reset.req_description", "Provide your registered email account to receive an automated recovery link token.")}</p>
        </header>

        <form className="auth-card__form" onSubmit={handleRequestLinkSubmit}>
          <div className="auth-card__field">
            <label htmlFor="reset-email-input" className="auth-card__label">{t("auth.reset.fields.email", "Email Address")}</label>
            <div className="auth-card__input-wrapper">
              <FiMail className="auth-card__input-icon" />
              <input
                id="reset-email-input"
                type="email"
                className="auth-card__input"
                placeholder="name@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {(validationError || successMessage) && (
            <div className={`auth-card__alert ${validationError ? "auth-card__alert--error" : "auth-card__alert--success"}`}>
              {validationError ? <FiAlertCircle /> : <FiCheckCircle />}
              <span>{validationError || successMessage}</span>
            </div>
          )}

          <button type="submit" className="auth-card__btn-submit" disabled={isLoading}>
            {isLoading ? t("auth.reset.buttons.processing", "Sending...") : t("auth.reset.buttons.submit_req", "Send Reset Link")}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
