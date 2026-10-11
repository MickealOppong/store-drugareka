import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "../components";
import { useLazyGetUserQuery } from "../features/api/userApi";
import { updateUser } from "../features/slice/userSlice";

export const StripeReturnKYCHandler = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "refresh">("loading");
  const [triggerFetchUser] = useLazyGetUserQuery();

  useEffect(() => {
    const stripeAction = searchParams.get("stripe");

    if (stripeAction === "success") {
      // 🟢 Step A: Explicitly update local Redux state configurations proactively
      dispatch(updateUser({ hasAddress: true }));
      
      // 🟢 Step B: Re-fetch user profile from your Spring API to sync newly unlocked seller credentials
      triggerFetchUser()
        .unwrap()
        .then(() => {
          setStatus("success");
        })
        .catch((err) => {
          console.error("Failed to sync profile metrics after Stripe onboarding:", err);
          setStatus("success"); // Still set to success as the Stripe onboarding itself was completed
        });
    } else if (stripeAction === "refresh") {
      // ⚠️ User exited forms early or session parameters timed out
      setStatus("refresh");
    } else {
      // Fallback fallback route security guard
      navigate("/profile");
    }
  }, [searchParams, dispatch, triggerFetchUser, navigate]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <main className="usr-profile usr-profile--center">
      <section className="usr-profile__card usr-profile__card--narrow">
        <div className="usr-profile__status-wrapper">
          {status === "success" ? (
            <div className="usr-profile__status-icon usr-profile__status-icon--success">
              <FiCheckCircle />
            </div>
          ) : (
            <div className="usr-profile__status-icon usr-profile__status-icon--error">
              <FiAlertTriangle />
            </div>
          )}

          <h1 className="usr-profile__title">
            {status === "success"
              ? t("user_profile.stripe.success_title", { defaultValue: "Onboarding Completed!" })
              : t("user_profile.stripe.refresh_title", { defaultValue: "Setup Incomplete" })}
          </h1>

          <p className="usr-profile__description">
            {status === "success"
              ? t("user_profile.stripe.success_desc", { 
                  defaultValue: "Your Stripe Connect Express profile is verified. Your payout channels are active." 
                })
              : t("user_profile.stripe.refresh_desc", { 
                  defaultValue: "The connection window was closed before saving your details. Please re-verify your bank details." 
                })}
          </p>

          <button
            type="button"
            className="usr-profile__btn usr-profile__btn--save usr-profile__btn--full"
            onClick={() => navigate("/profile")}
          >
            <span>{t("user_profile.stripe.buttons.return", { defaultValue: "Go to Dashboard" })}</span>
            <FiArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default StripeReturnKYCHandler;
