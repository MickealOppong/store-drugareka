import { useState, type ChangeEvent } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiLock,
  FiMail,
  FiUser
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import "../css/Register.css";
import logoKasoa from './../assets/logo-kasoa.png';

import { useTranslation } from "react-i18next";
import { useAddUserMutation } from "../features/api/authApi";
import type { TErrorResponse } from "../types/TErrorResponse";
import type { TValidationErrors } from "../types/TVallidationErrors";

const Register = () => {
  const [register] = useAddUserMutation();
  const navigate = useNavigate();

  //translation hook
  const { t } = useTranslation();

  //specific error messages
  const [emailError, setEmailError] = useState<string>("");
  const [emailExistError, setEmailExistError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);

  const handleFirstNameInputFocus = () => {
    setFirstNameError("");
  };

  const handleLastNameInputFocus = () => {
    setLastNameError("");
  };

  const handleDateOfBirthInputFocus = () => {
    setDobError("");
  };

  const handleEmailInputFocus = () => {
    setEmailError("");
    setEmailExistError("");
  };

  const handlePasswordInputFocus = () => {
    setPasswordError("");
  };

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const firstName = formValues.firstName as string;
    const lastName = formValues.lastName as string;
    const dob = new Date(formValues.dob as string);
    const password = formValues.password as string;
    const email = formValues.email as string;

    console.log({firstName,lastName,dob,password,email});
    
    if (isTermsAccepted) {
      try {
        // 1. .unwrap() forces RTK-Query to throw an error if the HTTP status is not 2xx

       const response= await register({
          firstName,
          lastName,
          dob,
          email,
          password,
          isTermsAccepted,
        }).unwrap();
        
        // 2. SUCCESS FLOW: Since we unwrapped, we know the backend returned a 2xx success code
        //console.log('Registration Successful:', payload);

        if(response.data===true){
          // Redirect the user right away
            navigate("/login");
        }
      } catch (error: any) {
        const { status } = error as {
          status: number | string;
          message: string;
        };

        // Handle Redux Network Level Errors (FETCH_ERROR)
        if (status === "FETCH_ERROR") {
          setFetchError("NETWORK_ERROR");
          return;
        }

        if (status === 500 || status === 401) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };

          setFetchError(errorResponse.error);
        }

        if (status === 409) {
          const errorResponse = error.data as {
            error: string;
            status: number;
            message: string;
          };

          setEmailExistError(() => errorResponse.error);
        }

        // Handle Client-Side Field Validation Errors (403 Forbidden)
        if (status === 403) {
          // const errorResponse = error  as FetchBaseQueryError;
          const errorData = error as { status: number; data: TErrorResponse };
          const errors = errorData.data.error as TValidationErrors;
          const { firstName, lastName, password, dob, email } = errors;
          setEmailError(() => email);
          setPasswordError(() => password);
          setFirstNameError(() => firstName);
          setLastNameError(() => lastName);
          setDobError(() => dob);
        }
      }
    } else {
      setMessage("Please accept terms and condition to proceed");
    }
  };

  /*
    {error && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_taken")}
                </span>
              )}
  */

  return (
    <>
      {fetchError && (
        <div className="fetch_error">
          <h2>{t("DiscoverFeed.NETWORK_ERROR")}</h2>
        </div>
      )}

      <div className="register-page">
        <div className="register-card">
          {/* BRAND */}
          <div className="brand">
               <img src={logoKasoa} alt="" style={{width:'30px',height:'30px'}}/>
            <h1>{t("STORE.BRAND_NAME")}</h1>
          </div>

          {/* HEADER */}
          <div className="register-heading">
            <h2>{t("REGISTER_PAGE.TITLE")}</h2>
            <p>{t("REGISTER_PAGE.SUBTITLE")}</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="register-form-row">
              {/* FIRST NAME */}
              <div>
                <div className="register-input-group">
                  <FiUser className="input-icon" />
                  <div className="input-group_div">
                    <label htmlFor="firstName">
                      {t("RegisterPage.fields.firstName.placeholder")}
                    </label>
                    <input
                      className="register-input"
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      onFocus={handleFirstNameInputFocus}
                      required
                    />
                  </div>
                </div>
                {firstNameError && (
                  <span className="error">
                    {t("RegisterPage.fields.firstName.firstname_error")}
                  </span>
                )}
              </div>

              {/* LAST NAME */}
              <div>
                <div className="register-input-group">
                  <FiUser className="input-icon" />
                  <div className="input-group_div">
                    <label htmlFor="lastName">
                      {t("RegisterPage.fields.lastName.placeholder")}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      onFocus={handleLastNameInputFocus}
                      required
                    />
                  </div>
                </div>
                {lastNameError && (
                  <span className="error">
                    {t("RegisterPage.fields.lastName.lastname_error")}
                  </span>
                )}
              </div>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <div className="register-input-group">
                <FiCalendar className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="dob">
                    {t("RegisterPage.fields.Other.date_of_birth")}
                  </label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    onFocus={handleDateOfBirthInputFocus}
                    required
                  />
                </div>
              </div>
              {dobError && (
                <span className="error">
                  {t("RegisterPage.fields.dob_error")}
                </span>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <div className="register-input-group">
                <FiMail className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="email">
                    {t("RegisterPage.fields.email.placeholder")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    onFocus={handleEmailInputFocus}
                    required
                  />
                </div>
              </div>

              {emailError && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_error")}
                </span>
              )}
              {emailExistError && (
                <span className="error">
                  {t("RegisterPage.fields.email.email_taken")}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="register-input-group">
                <FiLock className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="password">
                    {t("RegisterPage.fields.password.placeholder")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    onFocus={handlePasswordInputFocus}
                    required
                    defaultValue={'Singing@1'}
                  />
                </div>
              </div>
              {passwordError && (
                <span className="error">
                  {t("RegisterPage.fields.password.password_error")}
                </span>
              )}
            </div>

            {/* TERMS & PRIVACY */}
            <label className="terms">
              <input
                type="checkbox"
                required
                name="agreeToTerms"
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <span>
                {t("RegisterPage.fields.terms_and_privacy.link")}{" "}
                <Link to="/terms" className="legal-link" target="_blank">
                  {t("RegisterPage.fields.terms_and_privacy.terms")}{" "}
                </Link>{" "}
                {t("RegisterPage.fields.terms_and_privacy.and")}{" "}
                <Link to="/terms" className="legal-link" target="_blank">
                  {t("RegisterPage.fields.terms_and_privacy.privacy_policy")}{" "}
                </Link>
                {t("RegisterPage.fields.terms_and_privacy.brand_name")}
              </span>
            </label>
            {message && <span className="error">{message}</span>}

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-btn"
            >
        {t("RegisterPage.fields.submit_btn")}
              <FiArrowRight />
            </button>
          </form>

          {/* LOGIN */}
          <div className="login-link">
            <span>{t("RegisterPage.fields.login_prompt.text")}</span>
            <Link to={"/login"}> {t("RegisterPage.fields.login_prompt.link")}</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
