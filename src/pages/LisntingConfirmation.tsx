import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loading } from "../components";
import "../css/ListingConfirmation.css";
import { useConfirmAvailabilityMutation } from "../features/api/storeApi";

const ListingConfirmation = () => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const token = searchParams.get("token");

  const [updateListingStatus, { isLoading }] = useConfirmAvailabilityMutation();

  useEffect(() => {
    if (!token) return;

    const confirmAvailability = async () => {
      try {
        setLoading(true);
        const response = await updateListingStatus(String(token));

        if (response.data === true) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      } catch (err) {
        console.error("Failed to confirm listing availability:", err);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    confirmAvailability();
  }, [token, updateListingStatus]);

  if (isLoading || loading) {
    return <Loading />;
  }

  if (success) {
    return (
      <section className="listing-confirmation listing-confirmation--success">
        <div className="listing-confirmation__card">
          <h2 className="listing-confirmation__title">
            {t("listing_confirmation.availability.success_title", {
              defaultValue: "Listing confirmed, product is back to store",
            })}
          </h2>
          <p className="listing-confirmation__description">
            {t("listing_confirmation.availability.success_description", {
              defaultValue:
                "Your item is active again and visible to buyers.",
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

export default ListingConfirmation;
