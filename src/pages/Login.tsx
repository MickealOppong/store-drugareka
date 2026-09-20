import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from "react-icons/fa";
import { FiLock, FiMail } from "react-icons/fi";
import { RiEyeOffFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import { useLoginMutation } from "../features/api/authApi";
import { useMergeCartMutation } from "../features/api/cartApi";
import { setGuestCartCount } from "../features/slice/cartSlice";
import { loginUser } from "../features/slice/userSlice";
import type { TUserDto } from "../types/TUserDto";
import logoKasoa from './../assets/logo-kasoa.png';
const Login = () => {
  const [showText, setShowText] = useState<String>("password");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // http request
  const [login] = useLoginMutation();

  // userslice update
  const dispatch = useDispatch();

  // create cart on login from guest Cart Items
  const [mergeCart] = useMergeCartMutation();

  const handleEyeClick = (type: String) => {
    if (type == "password") {
      setShowText(() => "password");
      return;
    }
    setShowText(() => "text");
  };

  const handleLoginRequest = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    const username = formValues.username as string;
    const password = formValues.password as string;

    try {
      const response = await login({ username, password }).unwrap();
      const { httpStatus, data } = response as { httpStatus: number, data: TUserDto, message: string };

      if (httpStatus === 200) {
        // Proceed with account dispatch and routing transitions cleanly
        dispatch(loginUser(response.data));

        // Wrap with a strict container guard to prevent JSON parsing crashes
        const rawGuestCart = localStorage.getItem('guest_cart');
        
        if (rawGuestCart) {
          try {
            const guestItemIds: number[] = JSON.parse(rawGuestCart);
            
            if (Array.isArray(guestItemIds) && guestItemIds.length > 0) {
              // Lock with await so path navigation waits for database completion
              await mergeCart(guestItemIds).unwrap();
            }
          } catch (cartError) {
            console.error("Failed to execute background cart merge operations:", cartError);
          } finally {
            // Flush guest storage cache clean to avoid redundant merge triggers
            localStorage.removeItem('guest_cart');
            dispatch(setGuestCartCount(0));
          }
        }
        
        // Dynamic Role Guard Redirection Layout Mapping
        const userRolesList = data?.roles || [];
        userRolesList.includes("ROLE_ADMIN") 
          ? navigate("/account/admin") 
          : navigate('/shop');
          
        return; 
      }

      if (httpStatus === 401) {
        if (response.message.toLowerCase().startsWith("username")) {
          setErrorEmail(response.message);
        } else {
          setErrorPassword(response.message);
        }
      }
        
    } catch (error: any) {
      console.error("Authentication lifecycle failure:", error);
      // Handle Redux Network Level Errors (FETCH_ERROR)
      if (error.status === "FETCH_ERROR") {
        setFetchError("NETWORK_ERROR");
      }
    }
  };

 return (
    <>
      {fetchError && (
        <div className="fetch_error">
          <h2>{t("DiscoverFeed.NETWORK_ERROR")}</h2>
        </div>
      )}

      <div className="login-page">
        <div className="login-card">
          <div className="brand">
            <img src={logoKasoa} alt="" style={{width:'30px',height:'30px'}}/>
            <h1>{t("STORE.BRAND_NAME")}</h1>
          </div>

          <h2>{t("LoginPage.title")}</h2>
          <p>
            {t("DiscoverFeed.real_moments")}{" "}
            {t("DiscoverFeed.real_connections")}
          </p>

          <form onSubmit={handleLoginRequest}>
            {/* EMAIL */}
            <div>
              <div className="register-input-group">
                <FiMail className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="email">
                    {t("LoginPage.email.placeholder")}
                  </label>
                  <input
                    type="email"
                    name="username"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              {errorEmail && (
                <span className="error-text">{t('LoginPage.email.email_error')}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="register-input-group">
                <FiLock className="input-icon" />
                <div className="input-group_div">
                  <label htmlFor="password">
                    {t("LoginPage.password.placeholder")}
                  </label>
                  <input
                    type={`${showText === 'password' ? 'password' : 'text'}`}
                    name="password"
                    autoComplete="current-password"
                    defaultValue={''}
                    required
                  />
                </div>
                <span onClick={() => handleEyeClick('password')} style={{ display: showText === 'text' ? 'flex' : 'none' }}>
                  <FaEye />
                </span>
                <span onClick={() => handleEyeClick('text')} style={{ display: showText === 'password' ? 'flex' : 'none' }}>
                  <RiEyeOffFill />
                </span>
              </div>
              {errorPassword && (
                <span className="error-text">{t('LoginPage.password.password_error')}</span>
              )}
            </div>

            <button type="submit" className="login-btn">
              {t("LoginPage.submit_btn")}
            </button>
          </form>

          <div className="divider">
            <span>{t("LoginPage.divider_text")}</span>
          </div>

          <Link to="/reset" className="reset-password-link">
            {t("LoginPage.forgot_password_link")}
          </Link>

          <div className="signup-link">
            {t("LoginPage.signup_prompt.text")}{" "}
            <Link to="/register">{t("LoginPage.signup_prompt.link")}</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
