
import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiEdit2,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

import { Loading } from "../components";
import {
  useChangePasswordMutation,
  useEditUserMutation,
  useLazyGetStripeUpdateQuery,
  useLazyGetUserQuery,
  useLazyStripeConnectDashboardQuery,
  useStripeConnectMutation,
} from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TResponseDto } from "../types/TResponseDto";
import type { TUserDto } from "../types/TUserDto";
import { CookieService } from "../util/util";
import "./../css/UserProfile.scss";

type StripeStatus =
  | "loading"
  | "not_started"
  | "pending"
  | "ready"
  | "action_required"
  | "error";

type PaymentProvider = "STRIPE" | "PAYU";


const getReadableError = (error: any, fallback: string): string => {
  const message = error?.data?.message ?? error?.data?.error ?? error?.message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    const messages = Object.values(message).filter(
      (value): value is string => typeof value === "string"
    );
    if (messages.length) return messages.join("\n");
  }
  return fallback;
};

const UserProfile = () => {
  const { t } = useTranslation();

  const roles = useAppSelector((state) => state.userSlice.roles);
  const isSeller = roles.includes("ROLE_SELLER");

  const [fetchUser, { isLoading: isProfileLoading }] =
    useLazyGetUserQuery();
  const [updateProfile, { isLoading: isProfileUpdating }] =
    useEditUserMutation();
  const [changePassword, { isLoading: isPasswordChanging }] =
    useChangePasswordMutation();

  const [createMerchant, { isLoading: isStripeStarting }] =
    useStripeConnectMutation();
  const [checkStripeStatus, { isFetching: isStripeChecking }] =
    useLazyGetStripeUpdateQuery();

  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<Record<string, string>>({});

  const [id, setId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [telephone, setTelephone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [stripeStatus, setStripeStatus] =
    useState<StripeStatus>("loading");
  const [stripeError, setStripeError] = useState<string | null>(null);

  // UI selection only. Persist this through your backend before using it
  // to control the actual checkout payment provider.
  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>("STRIPE");

  const [getStripeDashboard, { isFetching: isDashboardLoading }] =
    useLazyStripeConnectDashboardQuery();

  const openStripeDashboard = async () => {
    setStripeError(null);
    try {
      const response = await getStripeDashboard().unwrap();
      const outer = response as TResponseDto;
      const payload = outer?.data
      const url = payload;


      if (!url || typeof url !== "string") {
        throw new Error(t("user_profile.stripe.errors.dashboard_url_missing"));
      }

      window.location.assign(url);
    } catch (error: any) {
      console.error("Unable to open Stripe dashboard", error);
      setStripeError(
        getReadableError(error, t("user_profile.stripe.errors.dashboard_open_failed"))
      );
    }
  };


  const getUser = async () => {
    try {
      setProfileError(null);

      const response = await fetchUser().unwrap();
      const profile = response?.data as TUserDto | undefined;

      if (!profile) {
        setProfileError(t("user_profile.errors.load_failed"));
        return;
      }

      setId(profile.userId);
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
  
      setEmail(profile.email ?? "");


      setStreet(profile.address?.street ?? "");
      setCity(profile.address?.city ?? "");
      setPostalCode(profile.address?.postalCode ?? "");
      setCountry(profile.address?.country ?? "");
      setTelephone(profile.address?.contact ?? "");
    } catch (error: any) {
      console.error("Unable to load profile", error);
      setProfileError(
        getReadableError(error, t("user_profile.errors.load_failed"))
      );
    }
  };

  const refreshStripeStatus = async () => {
    setStripeError(null);

    try {
      const response: any = await checkStripeStatus().unwrap();
      const data = response?.data ?? response;

      const hasAccount = Boolean(data?.stripeAccountId);
      const payoutsEnabled = Boolean(
        data?.canReceivePayouts ??
          data?.stripePayoutsEnabled ??
          data?.payoutsEnabled ??
          false
      );

      const requirements = data?.requirementsCurrentlyDue;
      const actionRequired =
        data?.actionRequired === true ||
        (Array.isArray(requirements) && requirements.length > 0);

      if (payoutsEnabled) {
        setStripeStatus("ready");
      } else if (actionRequired) {
        setStripeStatus("action_required");
      } else if (hasAccount) {
        setStripeStatus("pending");
      } else {
        setStripeStatus("not_started");
      }
    } catch (error) {
      console.error("Unable to retrieve Stripe status", error);
      setStripeStatus("error");
    }
  };

  useEffect(() => {
    void getUser();
    if (isSeller) {
      void refreshStripeStatus();
    }
  }, []);

  const handleStartEditing = () => {
    setProfileError(null);
    setProfileSuccess(null);
    setProfileFieldErrors({});
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setProfileError(null);
    setProfileSuccess(null);
    void getUser();
    setIsEditing(false);
  };

  const handleProfileSubmit = async (
    event: ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileFieldErrors({});

    if (!firstName.trim()) {
      setProfileFieldErrors({ firstName: t("user_profile.errors.first_name_required") });
      setProfileError(t("user_profile.errors.required_fields"));
      return;
    }

    if (!street.trim() || !city.trim()) {
      setProfileFieldErrors({
        ...(!street.trim() ? { street: t("user_profile.errors.street_required") } : {}),
        ...(!city.trim() ? { city: t("user_profile.errors.city_required") } : {}),
      });
      setProfileError(t("user_profile.errors.correct_highlighted"));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("id", String(id));
      formData.append("street", street.trim());
      formData.append("city", city.trim());
      formData.append("postalCode", postalCode.trim());
      formData.append("country", country.trim());
      formData.append("contact", telephone.trim());
      formData.append("email", email.trim())

      const response = await updateProfile(formData).unwrap();
      const { httpStatus, data } = response as TResponseDto;
      
      if (httpStatus === 200 && data) {
         CookieService.set('hasAddress',"true");
        setProfileSuccess(t("user_profile.messages.success"));
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Unable to update profile", error);

  const responseData = error?.data;
  const validationErrors =
    responseData?.message &&
    typeof responseData.message === "object"
      ? responseData.message
      : responseData?.error &&
          typeof responseData.error === "object"
        ? responseData.error
        : null;

  if (validationErrors) {
    const messages = Object.values(validationErrors).filter(
      (value): value is string => typeof value === "string"
    );

    setProfileError(
      messages.length > 0
        ? messages.join("\n")
        : t("user_profile.errors.check_details")
    );
  } else {
    const message = responseData?.message;

    setProfileError(
      typeof message === "string"
        ? message
        : t("user_profile.errors.update_failed")
    );
  }
    }
  };

  const handleStartStripeVerification = async () => {
    setStripeError(null);

    try {
      const response: any = await createMerchant().unwrap();
      
      const url = response?.data?.url ?? response?.url;

      if (!url) {
        throw new Error(t("user_profile.stripe.errors.onboarding_url_missing"));
      }

      window.location.assign(url);
    } catch (error: any) {
      console.error("Unable to start Stripe onboarding", error);
      setStripeError(
        getReadableError(error, t("user_profile.stripe.errors.onboarding_failed"))
      );
    }
  };

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordSubmit = async (
    event: ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError(
        t("user_profile.password.errors.current_required")
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        t("user_profile.password.errors.new_required")
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        t("user_profile.password.errors.too_short")
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError(
        t("user_profile.password.errors.confirm_required")
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        t("user_profile.password.errors.mismatch")
      );
      return;
    }

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      const { httpStatus, message } = response as TResponseDto;

      if (httpStatus === 200) {
        clearPasswordFields();
        setPasswordSuccess(
          t("user_profile.password.messages") ||
            t("user_profile.password.messages")
        );
      } else if (httpStatus === 400) {
        setPasswordError(message);
      }
    } catch (error: any) {
      console.error("Unable to change password", error);
      setPasswordError(
        getReadableError(error, t("user_profile.password.errors.change_failed"))
      );
    }
  };

  const stripeStatusLabel: Record<StripeStatus, string> = {
    loading: t("user_profile.stripe.status.loading"),
    not_started: t("user_profile.stripe.status.not_started"),
    pending: t("user_profile.stripe.status.pending"),
    ready: t("user_profile.stripe.status.ready"),
    action_required: t("user_profile.stripe.status.action_required"),
    error: t("user_profile.stripe.status.error"),
  };


  

  if (isProfileLoading) {
    return <Loading />;
  }

  return (
    <main className="usr-profile">
      <header className="usr-profile__header">
        <div className="usr-profile__badge">
          <FiUser />
          <span>{t("user_profile.header.badge")}</span>
        </div>

        <h1 className="usr-profile__title">
          {t("user_profile.header.title")}
        </h1>

        <p className="usr-profile__description">
          {t("user_profile.header.desc")}
        </p>
      </header>

      <div className="usr-profile__layout-container">
        {/* LEFT COLUMN */}
        <div className="usr-profile__column">
      

  <section className="usr-profile__card usr-profile__verification">
    {/* Header */}
    <header className="usr-profile__verification-header">
      <div className="usr-profile__card-heading">
        <FiShield />
        <div>
          <h2>{t("user_profile.stripe.title")}</h2>
          <p className="usr-profile__description">
            {t("user_profile.stripe.subtitle")}
          </p>
        </div>
      </div>

      <div
        className={`usr-profile__verification-status usr-profile__verification-status--${stripeStatus}`}
      >
        {stripeStatus === "ready" ? (
          <FiCheckCircle />
        ) : stripeStatus === "error" ? (
          <FiAlertCircle />
        ) : (
          <FiShield />
        )}

        <span>{stripeStatusLabel[stripeStatus]}</span>
      </div>
    </header>

    {/* Information */}
    <div className="usr-profile__verification-content">
      <p className="usr-profile__verification-description">
        {t("user_profile.stripe.description")}
      </p>

      {stripeStatus === "ready" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--success">
          <FiCheckCircle />
          <span>{t("user_profile.stripe.messages.ready")}</span>
        </div>
      )}

      {stripeStatus === "pending" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--notice">
          {t("user_profile.stripe.messages.pending")}

        </div>
      )}

      {stripeStatus === "action_required" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--notice">
          {t("user_profile.stripe.messages.action_required")}

        </div>
      )}

      {stripeStatus === "error" && (
        <div
          className="usr-profile__verification-message usr-profile__verification-message--error"
          role="alert"
        >
          {t("user_profile.stripe.messages.status_error")}

        </div>
      )}

      {stripeError && (
        <div
          className="usr-profile__verification-message usr-profile__verification-message--error"
          role="alert"
        >
          {stripeError}
        </div>
      )}
    </div>

    {/* Actions */}
    <footer className="usr-profile__verification-actions">
      {stripeStatus !== "ready" && (
        <button
          type="button"
          className="usr-profile__btn usr-profile__btn--verify"
          onClick={handleStartStripeVerification}
          disabled={
            isStripeStarting ||
            isStripeChecking ||
            stripeStatus === "loading"
          }
        >
          {isStripeStarting
            ? t("user_profile.stripe.buttons.connecting")
            : stripeStatus === "pending" ||
                stripeStatus === "action_required"
              ? t("user_profile.stripe.buttons.continue")
              : t("user_profile.stripe.buttons.verify")}

          <FiArrowRight />
        </button>
      )}

      <button
        type="button"
        className="usr-profile__verification-refresh"
        onClick={() => void refreshStripeStatus()}
        disabled={isStripeChecking}
      >
        <FiRefreshCw />
        {isStripeChecking ? t("user_profile.stripe.buttons.checking") : t("user_profile.stripe.buttons.refresh")}
      </button>

      {stripeStatus !== "not_started" && stripeStatus !== "loading" && (
        <button
          type="button"
          className="usr-profile__verification-refresh"
          onClick={() => void openStripeDashboard()}
          disabled={isDashboardLoading}
        >
          <FiArrowRight />
          {isDashboardLoading ? t("user_profile.stripe.buttons.opening_dashboard") : t("user_profile.stripe.buttons.open_dashboard")}
        </button>
      )}
    </footer>
  </section>

          {/* PROFILE FORM */}
          <section className="usr-profile__card">
            <div className="usr-profile__card-heading">
              <FiUser />
              <h2>{t("user_profile.sections.personal")}</h2>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="usr-profile__form-grid">
                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.first_name")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.firstName ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.firstName)}
                      aria-describedby={profileFieldErrors.firstName ? "profile-error-firstName" : undefined}
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="given-name"
                    />
                    {profileFieldErrors.firstName && <small id="profile-error-firstName" className="usr-profile__field-error" role="alert">{profileFieldErrors.firstName}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {firstName || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.last_name")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.lastName ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.lastName)}
                      aria-describedby={profileFieldErrors.lastName ? "profile-error-lastName" : undefined}
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="family-name"
                    />
                    {profileFieldErrors.lastName && <small id="profile-error-lastName" className="usr-profile__field-error" role="alert">{profileFieldErrors.lastName}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {lastName || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.email")}</span>
                  <span className="usr-profile__value">
                    {email || "—"}
                  </span>
                </label>

                          
              </div>

              <div className="usr-profile__section-divider" />

              <h3>{t("user_profile.sections.address")}</h3>

              <div className="usr-profile__form-grid">
                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.street")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.street ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.street)}
                      aria-describedby={profileFieldErrors.street ? "profile-error-street" : undefined}
                      value={street}
                      onChange={(event) =>
                        setStreet(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="street-address"
                    />
                    {profileFieldErrors.street && <small id="profile-error-street" className="usr-profile__field-error" role="alert">{profileFieldErrors.street}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {street || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.postal_code")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.postalCode ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.postalCode)}
                      aria-describedby={profileFieldErrors.postalCode ? "profile-error-postalCode" : undefined}
                      value={postalCode}
                      onChange={(event) =>
                        setPostalCode(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="postal-code"
                    />
                    {profileFieldErrors.postalCode && <small id="profile-error-postalCode" className="usr-profile__field-error" role="alert">{profileFieldErrors.postalCode}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {postalCode || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.city")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.city ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.city)}
                      aria-describedby={profileFieldErrors.city ? "profile-error-city" : undefined}
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="address-level2"
                    />
                    {profileFieldErrors.city && <small id="profile-error-city" className="usr-profile__field-error" role="alert">{profileFieldErrors.city}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {city || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.contact")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="tel"
                      className={`usr-profile__input ${profileFieldErrors.telephone ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.telephone)}
                      aria-describedby={profileFieldErrors.telephone ? "profile-error-telephone" : undefined}
                      value={telephone}
                      onChange={(event) =>
                        setTelephone(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="tel"
                    />
                    {profileFieldErrors.telephone && <small id="profile-error-telephone" className="usr-profile__field-error" role="alert">{profileFieldErrors.telephone}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {telephone || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.country")}</span>
                  {isEditing ? (
                    <>
                    <input
                      type="text"
                      className={`usr-profile__input ${profileFieldErrors.country ? "usr-profile__input--error" : ""}`}
                      aria-invalid={Boolean(profileFieldErrors.country)}
                      aria-describedby={profileFieldErrors.country ? "profile-error-country" : undefined}
                      value={country}
                      onChange={(event) =>
                        setCountry(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="country-name"
                    />
                    {profileFieldErrors.country && <small id="profile-error-country" className="usr-profile__field-error" role="alert">{profileFieldErrors.country}</small>}
                                      </>
                  ) : (
                    <span className="usr-profile__value">
                      {country || "—"}
                    </span>
                  )}
                </label>
              </div>

              {!isEditing && (
                <p className="usr-profile__privacy">
                  <FiLock />
                  <span>
                    {t("user_profile.privacy.title")}:{" "}
                    {t("user_profile.privacy.desc")}
                  </span>
                </p>
              )}

              {profileError && (
                <p className="usr-profile__error" role="alert">
                  <FiAlertCircle />
                  <span>{profileError.split("\n").map((message, index) => (
                    <span key={`${index}-${message}`}>
                      {index > 0 && <br />}
                      {message}
                    </span>
                  ))}</span>
                </p>
              )}

              {profileSuccess && (
                <p className="usr-profile__success" role="status">
                  <FiCheckCircle />
                  {profileSuccess}
                </p>
              )}

              <div className="usr-profile__actions">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="usr-profile__btn usr-profile__btn--secondary"
                      onClick={handleCancelEditing}
                      disabled={isProfileUpdating}
                    >
                      <FiX />
                      {t("user_profile.buttons.cancel")}
                    </button>

                    <button
                      type="submit"
                      className="usr-profile__btn usr-profile__btn--primary"
                      disabled={isProfileUpdating}
                    >
                      {isProfileUpdating
                        ? t("user_profile.buttons.saving")
                        : t("user_profile.buttons.save")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="usr-profile__btn usr-profile__btn--primary"
                    onClick={handleStartEditing}
                  >
                    <FiEdit2 />
                    {t("user_profile.buttons.edit")}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="usr-profile__column">
          {/* PAYMENT PROVIDER OPTIONS */}
          <section className="usr-profile__card">
            <div className="usr-profile__card-heading">
              <FiCreditCard />
              <h2>{t("user_profile.payment_provider.title")}</h2>
            </div>

            <p className="usr-profile__description">
              {t("user_profile.payment_provider.description")}<br />
              {t("user_profile.payment_provider.availability")}
            </p>

            <div className="usr-profile__payment-options">
              <button
                type="button"
                className={`usr-profile__payment-option ${
                  paymentProvider === "STRIPE"
                    ? "usr-profile__payment-option--selected"
                    : ""
                }`}
                onClick={() => setPaymentProvider("STRIPE")}
                aria-pressed={paymentProvider === "STRIPE"}
              >
                <span className="usr-profile__payment-option-icon">
                  <FiCreditCard />
                </span>
                <span className="usr-profile__payment-option-content">
                  <strong>Stripe</strong>
                  <small>{t("user_profile.payment_provider.stripe_description")}</small>
                </span>
                {paymentProvider === "STRIPE" && <FiCheckCircle />}
              </button>

              <button
        
                type="button"
                className={`usr-profile__payment-option payu${
                  paymentProvider === "PAYU"
                    ? "usr-profile__payment-option--selected"
                    : ""
                }`}
                onClick={() => setPaymentProvider("PAYU")}
                aria-pressed={paymentProvider === "PAYU"}
              >
                <span className="usr-profile__payment-option-icon">
                  <FiCreditCard />
                </span>
                <span className="usr-profile__payment-option-content">
                  <strong>PayU</strong>
                  <small>
                    {t("user_profile.payment_provider.payu_description")}
                  </small>
                </span>
                {paymentProvider === "PAYU" && <FiCheckCircle />}
              </button>
            </div>
          </section>

          {/* PASSWORD FORM */}
          <section className="usr-profile__card">
            <div className="usr-profile__card-heading">
              <FiLock />
              <h2>{t("user_profile.password.title")}</h2>
            </div>

            <p className="usr-profile__description">
              {t("user_profile.password.description")}
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <label className="usr-profile__field">
                <span>{t("user_profile.password.fields.current")}</span>
                <input
                  id="current-password"
                  type="password"
                  className="usr-profile__input"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  disabled={isPasswordChanging}
                  autoComplete="current-password"
                />
              </label>

              <label className="usr-profile__field">
                <span>{t("user_profile.password.fields.new")}</span>
                <input
                  id="new-password"
                  type="password"
                  className="usr-profile__input"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  disabled={isPasswordChanging}
                  autoComplete="new-password"
                />
                <small>
                  {t("user_profile.password.errors.too_short")}
                </small>
              </label>

              <label className="usr-profile__field">
                <span>{t("user_profile.password.fields.confirm")}</span>
                <input
                  id="confirm-password"
                  type="password"
                  className="usr-profile__input"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  disabled={isPasswordChanging}
                  autoComplete="new-password"
                />
              </label>

              {passwordError && (
                <p className="usr-profile__error" role="alert">
                  <FiAlertCircle />
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="usr-profile__success" role="status">
                  <FiCheckCircle />
                  {passwordSuccess}
                </p>
              )}

              <div className="usr-profile__actions">
                <button
                  type="submit"
                  className="usr-profile__btn usr-profile__btn--primary"
                  disabled={isPasswordChanging}
                >
                  {isPasswordChanging
                    ? t("user_profile.password.buttons.changing")
                    : t("user_profile.password.buttons.change")}
                  {!isPasswordChanging && <FiArrowRight />}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
