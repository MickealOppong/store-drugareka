
import { useEffect, useState, type FormEvent } from "react";
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
import { useDispatch } from "react-redux";

import { Loading } from "../components";
import {
  useChangePasswordMutation,
  useEditUserMutation,
  useLazyGetStripeUpdateQuery,
  useLazyGetUserQuery,
  useStripeConnectMutation,
} from "../features/api/userApi";
import { updateUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import type { TResponseDto } from "../types/TResponseDto";
import type { TUserDto } from "../types/TUserDto";
import "./../css/UserProfile.scss";

type StripeStatus =
  | "loading"
  | "not_started"
  | "pending"
  | "ready"
  | "action_required"
  | "error";

type PaymentProvider = "STRIPE" | "PAYU";

const UserProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const [id, setId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pesel, setPesel] = useState("");

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

  const getUser = async () => {
    try {
      setProfileError(null);

      const response = await fetchUser().unwrap();
      const profile = response?.data as TUserDto | undefined;

      if (!profile) {
        setProfileError("Unable to load profile.");
        return;
      }

      setId(profile.userId);
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setAccountNumber(profile.accountNumber ?? "");
      setEmail(profile.email ?? "");
      setPesel(profile.pesel ?? "");

      setStreet(profile.address?.street ?? "");
      setCity(profile.address?.city ?? "");
      setPostalCode(profile.address?.postalCode ?? "");
      setCountry(profile.address?.country ?? "");
      setTelephone(profile.address?.contact ?? "");
    } catch (error: any) {
      console.error("Unable to load profile", error);
      setProfileError(
        error?.data?.message || "Failed to load profile."
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
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setProfileError(null);
    setProfileSuccess(null);
    void getUser();
    setIsEditing(false);
  };

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!firstName.trim()) {
      setProfileError(
        t("user_profile.errors.required_fields") ||
          "Please fill in all mandatory fields."
      );
      return;
    }

    if (!street.trim() || !city.trim()) {
      setProfileError("Street and city are required.");
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
      formData.append("pesel", pesel.trim());
      formData.append("email", email.trim());

      if (isSeller) {
        formData.append("accountNumber", accountNumber.trim());
      }

      const response = await updateProfile(formData).unwrap();
      const { httpStatus, data } = response as TResponseDto;

      if (httpStatus === 200 && data) {
        dispatch(updateUser({ hasAddress: true }));
        setProfileSuccess(
          t("user_profile.messages.success") ||
            "Profile updated successfully."
        );
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Unable to update profile", error);

      if (error?.status === 403 && error?.data?.error) {
        const errors = error.data.error;

        setProfileError(
          [
            errors.street,
            errors.city,
            errors.postalCode,
            errors.contact,
            errors.pesel,
          ]
            .filter(Boolean)
            .join("\n")
        );
      } else {
        setProfileError(
          error?.data?.message || "Failed to update profile."
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
        throw new Error("Stripe onboarding URL was not returned.");
      }

      window.location.assign(url);
    } catch (error: any) {
      console.error("Unable to start Stripe onboarding", error);
      setStripeError(
        error?.data?.message ??
          error?.message ??
          "Unable to start identity verification. Please try again."
      );
    }
  };

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
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
            "Password changed successfully."
        );
      } else if (httpStatus === 400) {
        setPasswordError(message);
      }
    } catch (error: any) {
      console.error("Unable to change password", error);
      setPasswordError(
        error?.data?.message || "Failed to change password."
      );
    }
  };

  const stripeStatusLabel: Record<StripeStatus, string> = {
    loading: "Checking status",
    not_started: "Not started",
    pending: "In progress",
    ready: "Ready to receive payouts",
    action_required: "Action required",
    error: "Status unavailable",
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
      
{isSeller && (
  <section className="usr-profile__card usr-profile__verification">
    {/* Header */}
    <header className="usr-profile__verification-header">
      <div className="usr-profile__card-heading">
        <FiShield />
        <div>
          <h2>Seller identity verification</h2>
          <p className="usr-profile__description">
            Verify your identity to enable seller payouts.
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
        Your Stripe identity information is managed separately from
        your profile details and shipping addresses.
      </p>

      {stripeStatus === "ready" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--success">
          <FiCheckCircle />
          <span>Your account is ready to receive payouts.</span>
        </div>
      )}

      {stripeStatus === "pending" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--notice">
          Your Stripe account exists, but payout readiness has not
          yet been confirmed. Continue verification if needed.
        </div>
      )}

      {stripeStatus === "action_required" && (
        <div className="usr-profile__verification-message usr-profile__verification-message--notice">
          Stripe requires additional information before your seller
          account can be activated.
        </div>
      )}

      {stripeStatus === "error" && (
        <div
          className="usr-profile__verification-message usr-profile__verification-message--error"
          role="alert"
        >
          We could not retrieve your current verification status.
          Please try refreshing it.
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
            ? "Connecting to Stripe..."
            : stripeStatus === "pending" ||
                stripeStatus === "action_required"
              ? "Continue verification"
              : "Verify identity to sell"}

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
        {isStripeChecking ? "Checking..." : "Refresh status"}
      </button>
    </footer>
  </section>
)}


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
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="given-name"
                    />
                  ) : (
                    <span className="usr-profile__value">
                      {firstName || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.last_name")}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="family-name"
                    />
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
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={street}
                      onChange={(event) =>
                        setStreet(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="street-address"
                    />
                  ) : (
                    <span className="usr-profile__value">
                      {street || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.postal_code")}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={postalCode}
                      onChange={(event) =>
                        setPostalCode(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="postal-code"
                    />
                  ) : (
                    <span className="usr-profile__value">
                      {postalCode || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.city")}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="address-level2"
                    />
                  ) : (
                    <span className="usr-profile__value">
                      {city || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.contact")}</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="usr-profile__input"
                      value={telephone}
                      onChange={(event) =>
                        setTelephone(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="tel"
                    />
                  ) : (
                    <span className="usr-profile__value">
                      {telephone || "—"}
                    </span>
                  )}
                </label>

                <label className="usr-profile__field">
                  <span>{t("user_profile.fields.country")}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="usr-profile__input"
                      value={country}
                      onChange={(event) =>
                        setCountry(event.target.value)
                      }
                      disabled={isProfileUpdating}
                      autoComplete="country-name"
                    />
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
                  {profileError}
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
              <h2>Payment provider</h2>
            </div>

            <p className="usr-profile__description">
              Choose your preferred provider where this choice is supported.
              Available methods depend on the checkout configuration.
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
                  <small>Card payments and supported methods</small>
                </span>
                {paymentProvider === "STRIPE" && <FiCheckCircle />}
              </button>

              <button
                type="button"
                className={`usr-profile__payment-option ${
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
                    Polish online payments and supported methods
                  </small>
                </span>
                {paymentProvider === "PAYU" && <FiCheckCircle />}
              </button>
            </div>

            <p className="usr-profile__notice">
              This selection is currently local to this page and is not
              saved or connected to checkout. Provider selection must be
              implemented in your backend before it changes how orders are
              paid.
            </p>
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
