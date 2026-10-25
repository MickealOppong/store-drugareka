import React, { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiMaximize2,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";
import defImage from "../assets/default.jpeg";
import { useStripeShippingCostCheckoutMutation } from "../features/api/checkoutApi";
import {
  useLazyGetBuyerComplaintQuery,
  useUpdateOrderDisputeMutation
} from "../features/api/itemApi";
import type { TComplaints } from "../types/TComplaints";
import type { TResponseDto } from "../types/TResponseDto";
import Loading from "./Loading";

interface ComplaintImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export const SellerReviewModal: React.FC<ComplaintImageModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
}) => {
  const { t ,i18n} = useTranslation();
  const [alertError, setAlertError] = useState<string>("");
  const [getComplaint,{ isFetching } ]= useLazyGetBuyerComplaintQuery()
  const[data,setData]=useState<TComplaints>()

  const disputeId = data?.id;
  const returnUpheld = (data?.status === "AWAITING_RETURN_PAYMENT") || (data?.status==="RETURN_UPHELD") ||(data?.status==="APPROVED");

  async function fetchComplaint(){
    const response = await getComplaint(orderNumber);
    setData(response.data)
  }


  
  useEffect(()=>{
fetchComplaint()
  },[orderNumber,isOpen])
  //mutation hook
  const [updateDisputeStatus] = useUpdateOrderDisputeMutation();

  const originalImages = data?.listingImages || [];
  const complaintImages = data?.images || [];

  // Form states tracking controls
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsProcessing] = useState<boolean>(false);

  // Active Index States for carousel loops independently handled
  const [originalIdx, setOriginalIdx] = useState<number>(0);
  const [complaintIdx, setComplaintIdx] = useState<number>(0);

  //stripe checkout
  const [checkoutShippingCost] = useStripeShippingCostCheckoutMutation();

  // Full-screen image zoom focus tracking keys
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  
  // Keyboard binding escape event listener loop hooks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, fullscreenImage, onClose]);

  // Reset form parameter entries cleanly when modal closes
  useEffect(() => {
    if (!isOpen) {
      setComment("");
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const originalPhotos =
    originalImages.length > 0 ? originalImages : [defImage];
  const complaintPhotos =
    complaintImages.length > 0 ? complaintImages : [defImage];

  const handlePrevOriginal = () => {
    setOriginalIdx((prev) =>
      prev === 0 ? originalPhotos.length - 1 : prev - 1,
    );
  };

  const handleNextOriginal = () => {
    setOriginalIdx((prev) =>
      prev === originalPhotos.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevComplaint = () => {
    setComplaintIdx((prev) =>
      prev === 0 ? complaintPhotos.length - 1 : prev - 1,
    );
  };

  const handleNextComplaint = () => {
    setComplaintIdx((prev) =>
      prev === complaintPhotos.length - 1 ? 0 : prev + 1,
    );
  };

  const getErrorMessage = (error: unknown): string => {
    const apiError = error as {
      data?: { message?: string };
      message?: string;
    };
    return apiError?.data?.message ?? apiError?.message ?? t("complaint_modal.errors.generic", { defaultValue: "Coś poszło nie tak. Spróbuj ponownie." });
  };

  const handleDecisionSubmit = async (actionType: "APPROVE" | "REJECT") => {
    if (isSubmitting || !comment.trim()) return;

    setIsProcessing(true);
    setAlertError("");

    try {
      const response = await updateDisputeStatus({
        orderNumber,
        decision: actionType,
        reason: comment.trim(),
      });

      if ("error" in response) {
        setAlertError(getErrorMessage(response.error));
        return;
      }

      if (response.data?.httpStatus === 200) {
        onClose();
        return;
      }

      if (response.data?.httpStatus === 202) {
        const checkoutResponse = (await checkoutShippingCost(
          response.data.data,
        ).unwrap()) as TResponseDto;

        if (checkoutResponse.httpStatus !== 200 || !checkoutResponse.data) {
          setAlertError(checkoutResponse.message || t("complaint_modal.errors.checkout_create", { defaultValue: "Nie udało się utworzyć sesji płatności." }));
          return;
        }

        window.location.assign(checkoutResponse.data);
        return;
      }

      setAlertError(response.data?.message || t("complaint_modal.errors.decision_failed", { defaultValue: "Nie udało się zakończyć rozpatrywania reklamacji." }));
    } catch (error: unknown) {
      setAlertError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!disputeId || isSubmitting) {
      setAlertError(t("complaint_modal.errors.checkout_unavailable", { defaultValue: "Reklamacja lub płatność za przesyłkę zwrotną jest niedostępna." }));
      return;
    }

    setIsProcessing(true);
    setAlertError("");

    try {
      const checkoutResponse = (await checkoutShippingCost(Number(disputeId)).unwrap()) as TResponseDto;

      if (checkoutResponse.httpStatus !== 200 || !checkoutResponse.data) {
        setAlertError(checkoutResponse.message || t("complaint_modal.errors.checkout_create", { defaultValue: "Nie udało się utworzyć sesji płatności." }));
        return;
      }

      window.location.assign(checkoutResponse.data);
    } catch (error: unknown) {
      setAlertError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  if(isFetching){
    return <Loading/>
  }

  return (
    <>
      <div
        className="cmp-modal-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="cmp-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ====================================================
                    MODAL CONTROL LAYER HEADERS
             ==================================================== */}
          <header className="cmp-modal__header">
            <div className="cmp-modal__badge">
              <FiAlertCircle />
              <span>
                {t("complaint_modal.header.badge", {
                  defaultValue: "Rozpatrzenie reklamacji",
                })}
              </span>
              <span className="cmp-modal__order-tag">#{orderNumber}</span>
            </div>
            <button
              type="button"
              className="cmp-modal__close-btn"
              onClick={onClose}
              aria-label={t("complaint_modal.accessibility.close", { defaultValue: "Zamknij okno" })}
            >
              <FiX />
            </button>
          </header>

          {/* ====================================================
                    SPLIT PANELS COMPARISON SECTION
             ==================================================== */}
          <div className="cmp-modal__body">
            {/* LEFT LEG CONTAINER: ORIGINAL ITEM CATALOG LOOK */}
            <section className="cmp-panel">
              <div className="cmp-panel__title-bar">
                <FiFileText />
                <h3>
                  {t("complaint_modal.panels.original_title", {
                    defaultValue: "Oryginalne ogłoszenie",
                  })}
                </h3>
              </div>

              <div className="cmp-panel__display-frame">
                <img
                  src={originalPhotos[originalIdx]}
                  alt={t("complaint_modal.images.original_alt", { defaultValue: "Zdjęcie referencyjne z oryginalnego ogłoszenia" })}
                  loading="lazy"
                />

                <button
                  type="button"
                  className="cmp-panel__zoom-trigger"
                  onClick={() =>
                    setFullscreenImage(originalPhotos[originalIdx])
                  }
                  title={t("complaint_modal.accessibility.zoom", { defaultValue: "Powiększ zdjęcie" })}
                >
                  <FiMaximize2 />
                </button>

                {originalPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button
                      type="button"
                      onClick={handlePrevOriginal}
                      className="cmp-panel__arrow"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="cmp-panel__indicator">
                      {originalIdx + 1} / {originalPhotos.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextOriginal}
                      className="cmp-panel__arrow"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT LEG CONTAINER: BUYER COMPLAINT EVIDENCE IMAGES */}
            <section className="cmp-panel cmp-panel--complaint">
              <div className="cmp-panel__title-bar">
                <FiAlertCircle />
                <h3>
                  {t("complaint_modal.panels.complaint_title", {
                    defaultValue: "Dowody uszkodzenia zgłoszone przez kupującego",
                  })}
                </h3>
              </div>

              <div className="cmp-panel__display-frame">
                <img
                  src={complaintPhotos[complaintIdx]}
                  alt={t("complaint_modal.images.complaint_alt", { defaultValue: "Dowód przesłany przez kupującego w ramach reklamacji" })}
                  loading="lazy"
                />

                <button
                  type="button"
                  className="cmp-panel__zoom-trigger"
                  onClick={() =>
                    setFullscreenImage(complaintPhotos[complaintIdx])
                  }
                  title={t("complaint_modal.accessibility.zoom", { defaultValue: "Powiększ zdjęcie" })}
                >
                  <FiMaximize2 />
                </button>

                {complaintPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button
                      type="button"
                      onClick={handlePrevComplaint}
                      className="cmp-panel__arrow"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="cmp-panel__indicator">
                      {complaintIdx + 1} / {complaintPhotos.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextComplaint}
                      className="cmp-panel__arrow"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
          {/**ERROR */}
          {alertError && (
            <div className="cmp-modal__alert">
              <FiAlertCircle />
              <span>{alertError}</span>
            </div>
          )}
         
        
          {/* ====================================================
                    REFACTORED: MODAL FOOTER FORM REGION
             ==================================================== */}

        {
          returnUpheld ? (
          <div className="cmp-modal__footer cmp-modal__footer--courier">
            <p>{t("complaint_modal.return_upheld_message", {
              defaultValue: "Administrator uznał reklamację. Opłać koszt przesyłki zwrotnej, aby zamówić kuriera.",
            })}</p>
            <button
              type="button"
              className="cmp-footer-form__btn cmp-footer-form__btn--approve"
              onClick={handleCheckout}
              disabled={isSubmitting || !disputeId}
            >
              {isSubmitting ? t("complaint_modal.buttons.processing", { defaultValue: "Przetwarzanie..." }) : t("complaint_modal.buttons.order_courier", { defaultValue: "Zamów kuriera" })}
            </button>
          </div>
        ) :
            <footer className="cmp-modal__footer">
            <form
              className="cmp-footer-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="cmp-footer-form__field">
                <label
                  htmlFor="complaint-comment"
                  className="cmp-footer-form__label"
                >
                  <FiMessageSquare />
                  <span>
                    {t("complaint_modal.footer.comment_label", {
                      defaultValue: "Uzasadnienie decyzji",
                    })}
                  </span>
                </label>
                <textarea
                  id="complaint-comment"
                  className="cmp-footer-form__textarea"
                  value={comment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setComment(e.target.value)
                  }
                  placeholder={t("complaint_modal.footer.placeholder", {
                    defaultValue:
                      "Podaj uzasadnienie administracyjne tej decyzji...",
                  })}
                  disabled={isSubmitting}
                  maxLength={1000}
                  required
                />
              </div>

              <div className="cmp-footer-form__actions">
                <button
                  type="button"
                  className="cmp-footer-form__btn cmp-footer-form__btn--reject"
                  onClick={() => handleDecisionSubmit("REJECT")}
                  disabled={isSubmitting || !comment.trim()}
                >
                  {t("complaint_modal.footer.buttons.reject", {
                    defaultValue: "Odrzuć reklamację",
                  })}
                </button>
                <button
                  type="button"
                  className="cmp-footer-form__btn cmp-footer-form__btn--approve"
                  onClick={() => handleDecisionSubmit("APPROVE")}
                  disabled={isSubmitting || !comment.trim()}
                >
                  {t("complaint_modal.footer.buttons.approve", {
                    defaultValue: "Zamów kuriera",
                  })}
                </button>
              </div>
            </form>
          </footer>
        }
        </div>
      </div>

      {/* ====================================================
                LIGHTBOX THE FULLSCREEN LIGHTBOX PORTAL OVERLAY
         ==================================================== */}
      {fullscreenImage && (
        <div
          className="cmp-lightbox-overlay"
          onClick={() => setFullscreenImage(null)}
          role="dialog"
        >
          <button
            type="button"
            className="cmp-lightbox-close"
            onClick={() => setFullscreenImage(null)}
          >
            <img
              src={fullscreenImage}
              alt={t("complaint_modal.images.fullscreen_alt", { defaultValue: "Powiększony widok dowodu w reklamacji" })}
              onClick={(e) => e.stopPropagation()}
            />
          </button>
        </div>
      )}
    </>
  );
};
