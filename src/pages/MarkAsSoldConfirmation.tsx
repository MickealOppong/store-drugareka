import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loading } from "../components";
import "../css/ListingConfirmation.css";
import { useMarkAsSoldMutation } from "../features/api/storeApi";

const MarkAsSoldConfirmation = () => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const token = searchParams.get("token");

  const [updateListingStatus, { isLoading }] = useMarkAsSoldMutation();

  useEffect(() => {
    if (!token) return;

    const markListingAsSold = async () => {
      try {
        setLoading(true);

        const response = await updateListingStatus(token);

        if (response.data === true) {
          setSuccess(true);
        } else {
          setSuccess(false);
          setError(true);
        }
      } catch (err) {
        console.error("Failed to mark listing as sold:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    markListingAsSold();
  }, [token, updateListingStatus]);

  if (isLoading || loading) {
    return <Loading />;
  }

  if (success) {
    return (
      <section className="listing-confirmation listing-confirmation--success">
        <div className="listing-confirmation__card">
          <h2 className="listing-confirmation__title">
            {t("listing_confirmation.mark_as_sold.success_title", {
              defaultValue: "Produkt oznaczony jako sprzedany",
            })}
          </h2>
          <p className="listing-confirmation__description">
            {t("listing_confirmation.mark_as_sold.success_description", {
              defaultValue: "Listing removed from the store. Thank you!",
            })}
          </p>
        </div>
      </section>
    );
  }

  if (error || !token) {
    return (
      <section className="listing-confirmation listing-confirmation--error">
        <div className="listing-confirmation__card">
          <h2 className="listing-confirmation__title">
            {t("listing_confirmation.mark_as_sold.error_title", {
              defaultValue: "Nie udało się zaktualizować produktu",
            })}
          </h2>
          <p className="listing-confirmation__description">
            {t("listing_confirmation.mark_as_sold.error_description", {
              defaultValue:
                "Something went wrong. The link may have expired or already used.",
            })}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="listing-confirmation listing-confirmation--error">
      <div className="listing-confirmation__card">
        <h2 className="listing-confirmation__title">
          {t("listing_confirmation.availability.error_title", {
            defaultValue: "Something went wrong",
          })}
        </h2>
        <p className="listing-confirmation__description">
          {t("listing_confirmation.availability.error_description", {
            defaultValue:
              "Either the link has expired or the product has already been confirmed.",
          })}
        </p>
      </div>
    </section>
  );
};

export default MarkAsSoldConfirmation;
