import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaEye } from "react-icons/fa";
import { FiHeart, FiLock, FiMail } from "react-icons/fi";
import { RiEyeOffFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/api/authApi";
import { useMergeCartMutation } from "../features/api/cartApi";
import { setGuestCartCount } from "../features/slice/cartSlice";
import { loginUser } from "../features/slice/userSlice";
import type { TUserDto } from "../types/TUserDto";
import "./../css/LoginPage.css";

const Login = () => {
  const [showText, setShowText] = useState<String>("password");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const navigate = useNavigate();
  //http request
  const [login] = useLoginMutation();

  //userslice update
  const dispatch = useDispatch();

  //create cart on login from guest Cart Items
  
const [mergeCart] = useMergeCartMutation()

  //translation hook
  const { t } = useTranslation();

  const handleEyeClick = (type: String) => {
    if (type == "password") {
      setShowText(() => "password");
      return;
    }
    setShowText(() => "text");
  };

  const handleLoginRequest = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

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
              const cartResponse = await mergeCart(guestItemIds).unwrap();
              console.log("Kasoa.pl Cart Merge Response:", cartResponse);
            }
          } catch (cartError) {
            console.error("Failed to execute background cart merge operations:", cartError);
          } finally {
            //Flush guest storage cache clean to avoid redundant merge triggers
            localStorage.removeItem('guest_cart');
            dispatch(setGuestCartCount(0))
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
          setErrorEmail(() => response.message);
          setErrorPassword("");
        } else {
          setErrorPassword(() => response.message);
          setErrorEmail("");
        }
      }
        
    } catch (error: any) {
      console.error("Authentication lifecycle failure:", error);
      // Handle Redux Network Level Errors (FETCH_ERROR)
      if (error.status === "FETCH_ERROR") {
        setFetchError("NETWORK_ERROR");
        setErrorPassword("");
        setErrorEmail("");
      }
    }
  };

  return (
    <>
  {fetchError && (
  <div className="fetch_error">
    {/* Optional: Add a clean react warning icon directly into the template wrapper if wanted */}
    <h2>{t(`DiscoverFeed.${fetchError}`)}</h2>
  </div>
)}

      <div className="login-page">
        <div className="login-card">
          <div className="brand">
            <FiHeart
              size={16}
              className="heart"
            />
            <h1>{t("LoginPage.brand_name")}</h1>
          </div>

          <h2>{t("LoginPage.title")}</h2>
          <p>{t("DiscoverFeed.real_moments")}{" "}{t("DiscoverFeed.real_connections")}</p>

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
                    placeholder=""
                    autoComplete="email"
               
                  />
                </div>
              </div>
            {
              errorEmail && <span className="error-text">{t('LoginPage.email.email_error')}</span>
            }
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
                     type={`${showText==='password'?'password':'text'}`}
                    placeholder=""
                    name="password"
                    autoComplete="new-password"
                    defaultValue={'Singing@1'}
                    
                  />
                  
                </div>
                 <span onClick={()=>handleEyeClick('password')}  style={{display:showText==='text'?'flex':'none'}}><FaEye/></span>
                 <span onClick={()=>handleEyeClick('text')} style={{display:showText==='password'?'flex':'none'}}><RiEyeOffFill/></span>
              </div>
                      {
              errorPassword && <span className="error-text">{t('LoginPage.password.password_error')}</span>
            }
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              {t("LoginPage.submit_btn")}
            </button>
          </form>

          <div className="divider">
            <span> {t("LoginPage.divider_text")}</span>
          </div>
          <Link
            to={"/reset"}
            className="reset-password-link"
          >
            {t("LoginPage.forgot_password_link")}
          </Link>
          <button
            className="social-btn"
            style={{ display: "none" }}
          >
            Continue with Google
          </button>

          <button
            className="social-btn"
            style={{ display: "none" }}
          >
            Continue with Apple
          </button>

          <div className="signup-link">
            {t("LoginPage.signup_prompt.text")}
            <a href="/register"> {t("LoginPage.signup_prompt.link")}</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
