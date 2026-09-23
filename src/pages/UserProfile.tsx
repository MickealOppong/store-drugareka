import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiEdit2,
  FiLock,
  FiMapPin,
  FiUser,
  FiX,
} from "react-icons/fi";

import { Loading } from "../components";
import {
  useChangePasswordMutation,
  useEditUserMutation,
  useLazyGetUserQuery,
} from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TResponseDto } from "../types/TResponseDto";
import type { TUserDto } from "../types/TUserDto";
import "./../css/UserProfile.scss";

export const UserProfile = () => {
  const { t } = useTranslation();

  const roles = useAppSelector((state) => state.userSlice.roles);

  /*
   * =========================================================
   * PROFILE API
   * =========================================================
   */

  const [fetchUser, { isLoading: isProfileLoading }] = useLazyGetUserQuery();

  const [updateProfile, { isLoading: isProfileUpdating }] =
    useEditUserMutation();

  /*
   * =========================================================
   * PASSWORD API
   * =========================================================
   */

  const [changePassword, { isLoading: isPasswordChanging }] =
    useChangePasswordMutation();


  /*
   * =========================================================
   * PROFILE STATE
   * =========================================================
   */

  const [isEditing, setIsEditing] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const[id,setId] = useState<number>(0)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");

  /*
   * =========================================================
   * ADDRESS STATE
   * =========================================================
   */

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [telephone, setTelephone] = useState("");

  /*
   * =========================================================
   * PASSWORD STATE
   * =========================================================
   */

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  /*
   * =========================================================
   * LOAD USER
   * =========================================================
   */

  const getUser = async () => {
    try {
      setProfileError(null);

      const response = await fetchUser().unwrap();

      const profile = response?.data as TUserDto | undefined;

      if (!profile) {
        setProfileError("Unable to load profile.");
        return;
      }
      setId(profile.userId)
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setAccountNumber(profile.accountNumber ?? "");
      setEmail(profile.email ?? "");

      setStreet(profile.address?.street ?? "");
      setCity(profile.address?.city ?? "");
      setPostalCode(profile.address?.postalCode ?? "");
      setCountry(profile.address?.country ?? "");
      setTelephone(profile.address?.contact ?? "");
    } catch (err: any) {
      console.error(err);

      setProfileError(err?.data?.message || "Failed to load profile.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  /*
   * =========================================================
   * PROFILE EDITING
   * =========================================================
   */

  const handleStartEditing = () => {
    setProfileError(null);
    setProfileSuccess(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setProfileError(null);
    setProfileSuccess(null);

    /*
     * Reload original data so Cancel discards
     * all unsaved changes.
     */
    getUser();

    setIsEditing(false);
  };

  /*
   * =========================================================
   * SAVE PROFILE / BIO DATA
   * =========================================================
   */

  const handleProfileSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProfileError(null);
    setProfileSuccess(null);

    if (!firstName.trim()) {
      setProfileError(
        t("user_profile.errors.required_fields") ||
          "Please fill in all mandatory fields.",
      );
      return;
    }

    if (!street.trim()) {
      setProfileError("Street is required.");
      return;
    }

    if (!city.trim()) {
      setProfileError("City is required.");
      return;
    }

    try {
      const formData = new FormData();

      /*
       * Personal information
       */
      formData.append("firstName", firstName.trim());

      formData.append("lastName", lastName.trim());
      formData.append('id',String(id))

      /*
       * Address
       */
      formData.append("street", street.trim());

      formData.append("city", city.trim());

      formData.append("postalCode", postalCode.trim());

      formData.append("country", country.trim());

      formData.append("contact", telephone.trim());

      /*
       * Seller information
       */
      if (roles.includes("ROLE_SELLER")) {
        formData.append("accountNumber", accountNumber.trim());
      }

      /*
       * IMPORTANT:
       *
       * No password fields are sent here.
       *
       * No:
       * currentPassword
       * newPassword
       * confirmPassword
       */

      await updateProfile(formData).unwrap();

      setProfileSuccess(
        t("user_profile.messages.success") || "Profile updated successfully.",
      );

      setIsEditing(false);

      await getUser();
    } catch (err: any) {
      console.error(err);

      setProfileError(
        err?.data?.message ||
          t("user_profile.errors.save_failed") ||
          "Failed to save profile changes.",
      );
    }
  };

  /*
   * =========================================================
   * PASSWORD
   * =========================================================
   */

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordSubmit = async (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError(t('user_profile.password.errors.current_required'));
      return;
    }

    if (!newPassword) {
      setPasswordError(t('user_profile.password.errors.new_required'));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t('user_profile.password.errors.too_short'));
      return;
    }

    if (!confirmPassword) {
      setPasswordError(t('user_profile.password.errors.confirm_required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('user_profile.password.errors.mismatch'));
      return;
    }

    try {
      /*
       * ONLY password data goes to the password endpoint.
       */
      const changePasswordDto = {
          currentPassword,
          newPassword
      }
      const response =await changePassword(changePasswordDto).unwrap();
      
      const {httpStatus,message} = response as TResponseDto

      if(httpStatus===200){
        clearPasswordFields();

      setPasswordSuccess(t('user_profile.password.messages'));
      }
      if(httpStatus==400){
          setPasswordError(message)
      }
    } catch (err: any) {
      console.error(err);

      setPasswordError(err?.data?.message || "Failed to change password.");
    }
  };


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isProfileLoading) {
    return <Loading />;
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="usr-profile">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="usr-profile__header">
        <div className="usr-profile__badge">
          <FiUser />
          <span>{t("user_profile.header.badge")}</span>
        </div>

        <h1 className="usr-profile__title">{t("user_profile.header.title")}</h1>

        <p className="usr-profile__description">
          {t("user_profile.header.desc")}
        </p>
      </header>

      {/* =====================================================
          PROFILE / BIO DATA
          ===================================================== */}

      <section className="usr-profile__card">
        <form
          className="usr-profile__form"
          onSubmit={handleProfileSubmit}
        >
          {/* PERSONAL INFORMATION */}

          <div className="usr-profile__section">
            <h2 className="usr-profile__section-title">
              <FiUser />

              <span>{t("user_profile.sections.personal")}</span>
            </h2>

            <div className="usr-profile__grid">
              {/* FIRST NAME */}

              <div className="usr-profile__field">
                <label className="usr-profile__label">
                  {t("user_profile.fields.first_name")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    className="usr-profile__input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isProfileUpdating}
                    autoComplete="given-name"
                  />
                ) : (
                  <p className="usr-profile__value">{firstName || "—"}</p>
                )}
              </div>

              {/* LAST NAME */}

              <div className="usr-profile__field">
                <label className="usr-profile__label">
                  {t("user_profile.fields.last_name")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    className="usr-profile__input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isProfileUpdating}
                    autoComplete="family-name"
                  />
                ) : (
                  <p className="usr-profile__value">{lastName || "—"}</p>
                )}
              </div>
            </div>

            {/* EMAIL */}

            <div className="usr-profile__field usr-profile__field--full">
              <label className="usr-profile__label">
                {t("user_profile.fields.email")}
              </label>

              <div className="usr-profile__input-lock">
                <p className="usr-profile__value usr-profile__value--disabled">
                  {email || "—"}
                </p>

                <span
                  className="usr-profile__lock-icon"
                  title="Email cannot be changed"
                >
                  <FiLock />
                </span>
              </div>
            </div>

            {/* SELLER ACCOUNT */}

            {roles.includes("ROLE_SELLER") && (
              <div className="usr-profile__field usr-profile__field--full">
                <label className="usr-profile__label">
                  {t("user_profile.fields.account")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    className="usr-profile__input"
                    placeholder="account#..."
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={isProfileUpdating}
                    autoComplete="off"
                  />
                ) : (
                  <p className="usr-profile__value">{accountNumber || "—"}</p>
                )}
              </div>
            )}
          </div>

          {/* =================================================
              SHIPPING ADDRESS
              ================================================= */}

          <div className="usr-profile__section usr-profile__section--divider">
            <h2 className="usr-profile__section-title">
              <FiMapPin />

              <span>{t("user_profile.sections.address")}</span>
            </h2>

            {/* STREET */}

            <div className="usr-profile__field usr-profile__field--full">
              <label className="usr-profile__label">
                {t("user_profile.fields.street")}
              </label>

              {isEditing ? (
                <input
                  type="text"
                  className="usr-profile__input"
                  placeholder="e.g. Kostromska 120"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isProfileUpdating}
                  autoComplete="street-address"
                />
              ) : (
                <p className="usr-profile__value">{street || "—"}</p>
              )}
            </div>

            {/* POSTAL CODE + CITY */}

            <div className="usr-profile__grid">
              <div className="usr-profile__field">
                <label className="usr-profile__label">
                  {t("user_profile.fields.postal_code")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    className="usr-profile__input"
                    placeholder="e.g. 97-300"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={isProfileUpdating}
                    autoComplete="postal-code"
                  />
                ) : (
                  <p className="usr-profile__value">{postalCode || "—"}</p>
                )}
              </div>

              <div className="usr-profile__field">
                <label className="usr-profile__label">
                  {t("user_profile.fields.city")}
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    className="usr-profile__input"
                    placeholder="e.g. Piotrków Trybunalski"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isProfileUpdating}
                    autoComplete="address-level2"
                  />
                ) : (
                  <p className="usr-profile__value">{city || "—"}</p>
                )}
              </div>
            </div>

         <div className="usr-profile__grid">
             {/* PHONE */}

            <div className="usr-profile__field usr-profile__field--full">
              <label className="usr-profile__label">
                {t("user_profile.fields.contact")}
              </label>

              {isEditing ? (
                <input
                  type="tel"
                  className="usr-profile__input"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  disabled={isProfileUpdating}
                  autoComplete="tel"
                />
              ) : (
                <p className="usr-profile__value">{telephone || "—"}</p>
              )}
            </div>

            {/* COUNTRY */}

            <div className="usr-profile__field usr-profile__field--full">
              <label className="usr-profile__label">
                {t("user_profile.fields.country")}
              </label>

              {isEditing ? (
                <input
                  type="text"
                  className="usr-profile__input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={isProfileUpdating}
                  autoComplete="country-name"
                />
              ) : (
                <p className="usr-profile__value">{country || "—"}</p>
              )}
            </div>
         </div>

            {/* PRIVACY */}

            {!isEditing && (
              <div className="usr-profile__privacy-badge">
                <strong>{t("user_profile.privacy.title")}:</strong>{" "}
                {t("user_profile.privacy.desc")}
              </div>
            )}
          </div>

          {/* PROFILE ERROR */}

          {profileError && (
            <div className="usr-profile__alert usr-profile__alert--error">
              {profileError}
            </div>
          )}

          {/* PROFILE SUCCESS */}

          {profileSuccess && (
            <div className="usr-profile__alert usr-profile__alert--success">
              {profileSuccess}
            </div>
          )}

          {/* PROFILE ACTIONS */}

          <div className="usr-profile__actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="usr-profile__btn usr-profile__btn--cancel"
                  disabled={isProfileUpdating}
                  onClick={handleCancelEditing}
                >
                  <FiX />

                  <span>{t("user_profile.buttons.cancel")}</span>
                </button>

                <button
                  type="submit"
                  className="usr-profile__btn usr-profile__btn--save"
                  disabled={isProfileUpdating}
                >
                  <FiCheck />

                  <span>
                    {isProfileUpdating
                      ? t("user_profile.buttons.saving")
                      : t("user_profile.buttons.save")}
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="usr-profile__btn usr-profile__btn--edit"
                onClick={handleStartEditing}
              >
                <FiEdit2 />

                <span>{t("user_profile.buttons.edit")}</span>
              </button>
            )}
          </div>
        </form>
      </section>

      {/* =====================================================
          CHANGE PASSWORD
          ===================================================== */}

      <section className="usr-profile__card usr-profile__password-card">
        <form
          className="usr-profile__form"
          onSubmit={handlePasswordSubmit}
        >
          <div className="usr-profile__section">
            <h2 className="usr-profile__section-title">
              <FiLock />

              <span>{t('user_profile.password.title')}</span>
            </h2>

            <p className="usr-profile__description">
             {t('user_profile.password.description')}
            </p>

            {/* CURRENT PASSWORD */}

            <div className="usr-profile__field usr-profile__field--full">
              <label
                htmlFor="current-password"
                className="usr-profile__label"
              >
               {t('user_profile.password.fields.current')}
              </label>

              <input
                id="current-password"
                type="password"
                className="usr-profile__input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isPasswordChanging}
                autoComplete="current-password"
              />
            </div>

            {/* NEW PASSWORD */}

            <div className="usr-profile__grid">
              <div className="usr-profile__field">
                <label
                  htmlFor="new-password"
                  className="usr-profile__label"
                >
                      {t('user_profile.password.fields.new')}
                </label>

                <input
                  id="new-password"
                  type="password"
                  className="usr-profile__input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPasswordChanging}
                  autoComplete="new-password"
                />

                <small className="usr-profile__hint">
                      {t('user_profile.password.errors.too_short')}
                </small>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="usr-profile__field">
                <label
                  htmlFor="confirm-password"
                  className="usr-profile__label"
                >
                      {t('user_profile.password.fields.confirm')}
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  className="usr-profile__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPasswordChanging}
                  autoComplete="new-password"
                />
    
              </div>
            </div>
          </div>

          {/* PASSWORD ERROR */}

          {passwordError && (
            <div className="usr-profile__alert usr-profile__alert--error">
              {passwordError}
            </div>
          )}

          {/* PASSWORD SUCCESS */}

          {passwordSuccess && (
            <div className="usr-profile__alert usr-profile__alert--success">
              {passwordSuccess}
            </div>
          )}

          {/* PASSWORD ACTION */}

          <div className="usr-profile__actions">
            <button
              type="submit"
              className="usr-profile__btn usr-profile__btn--save"
              disabled={isPasswordChanging}
            >
              <FiLock />

              <span>
                {isPasswordChanging
                  ? t('user_profile.password.buttons.changing')
                  :t('user_profile.password.buttons.change')
                }
              </span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UserProfile;
