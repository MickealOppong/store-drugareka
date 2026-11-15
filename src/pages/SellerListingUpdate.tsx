import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { Loading } from "../components";
import "../css/SellerListingUpdate.css";
import { useValidateTokenMutation } from "../features/api/sellerApi";

const SellerListingUpdate = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { t } = useTranslation();

  const [isValidated, setIsValidated] = useState(false);
  const [listingId, setListingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [validateSellerToken] = useValidateTokenMutation();

  useEffect(() => {
    let active = true;

    const validateToken = async () => {
      if (!token) {
        setIsValidated(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await validateSellerToken(token).unwrap();

        if (!active) return;

        if (response.validated && response.listingId) {
          localStorage.setItem("update-token", token);
          setIsValidated(true);
          setListingId(response.listingId);
        } else {
          setIsValidated(false);
        }
      } catch (error) {
        if (active) {
          setIsValidated(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    validateToken();

    return () => {
      active = false;
    };
  }, [token, validateSellerToken]);

  useEffect(() => {
    if (isValidated && listingId !== null) {
      navigate(`/update-listing/${listingId}/edit`, {
        replace: true,
      });
    }
  }, [isValidated, listingId, navigate]);

  if (loading || isValidated) {
    return <Loading />;
  }

  return (
    <section className="seller-token-status">
      <div className="seller-token-status__card" role="alert">
        <h2 className="seller-token-status__title">
          {t("enquiry_modal.invalid_token_or_link", {
            defaultValue: "Nieprawidłowy lub wygasły link",
          })}
        </h2>
        <p className="seller-token-status__description">
          {t("enquiry_modal.invalid_token_or_link")}
        </p>
      </div>
    </section>
  );
};

export default SellerListingUpdate;
