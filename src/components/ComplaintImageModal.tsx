import React, { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiFileText, FiMaximize2, FiMessageSquare, FiX } from "react-icons/fi";
import defImage from "../assets/default.jpeg";
import "../css/ComplaintImageModal.scss";
import { useUpdateOrderDisputeAdminMutation } from "../features/api/itemApi";

interface ComplaintImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  originalImages: string[];
  complaintImages: string[];
}

export const ComplaintImageModal: React.FC<ComplaintImageModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  originalImages = [],
  complaintImages = []
}) => {
  const { t } = useTranslation();

  // Active Index States for carousel loops independently handled
  const [originalIdx, setOriginalIdx] = useState<number>(0);
  const [complaintIdx, setComplaintIdx] = useState<number>(0);

    // Form states tracking controls
      const [alertError, setAlertError] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsProcessing] = useState<boolean>(false);
  
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

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Locks main background scroll containers
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, fullscreenImage, onClose]);



  // Sizing anchors protection boundaries checks
  const originalPhotos = originalImages.length > 0 ? originalImages : [defImage];
  const complaintPhotos = complaintImages.length > 0 ? complaintImages : [defImage];

  const handlePrevOriginal = () => {
    setOriginalIdx((prev) => (prev === 0 ? originalPhotos.length - 1 : prev - 1));
  };

  const handleNextOriginal = () => {
    setOriginalIdx((prev) => (prev === originalPhotos.length - 1 ? 0 : prev + 1));
  };

  const handlePrevComplaint = () => {
    setComplaintIdx((prev) => (prev === 0 ? complaintPhotos.length - 1 : prev - 1));
  };

  const handleNextComplaint = () => {
    setComplaintIdx((prev) => (prev === complaintPhotos.length - 1 ? 0 : prev + 1));
  };

  //mutation hook
  const [updateDisputeStatus] = useUpdateOrderDisputeAdminMutation()
  

    const handleDecisionSubmit = async (
      e: ChangeEvent<HTMLFormElement>,
      actionType: "APPROVE" | "REJECT",
    ) => {
      e.preventDefault();
      setIsProcessing(true);
  
      try {
        // Perform your RTK Query or Fetch Mutation execution hook here
        const response = await updateDisputeStatus({
          orderNumber,
          decision: actionType,
          reason: comment,
        });
  
        if (response.error) {
          const { data } = response.error as { data: any; status: number };
          const { message } = data as { status: number; message: string };
          setAlertError(message);
        }
  
        onClose();
        setIsProcessing(false);
      } catch (err) {
        console.error("Failed to commit case decision: ", err);
      } finally {
        setIsProcessing(false);
      }
    };
      if (!isOpen) return null;

  return (
    <>
      <div className="cmp-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="cmp-modal" onClick={(e) => e.stopPropagation()}>
          
          {/* ====================================================
                    MODAL CONTROL LAYER HEADERS
             ==================================================== */}
          <header className="cmp-modal__header">
            <div className="cmp-modal__badge">
              <FiAlertCircle />
              <span>{t("complaint_modal.header.badge", { defaultValue: "Complaint Review" })}</span>
              <span className="cmp-modal__order-tag">#{orderNumber}</span>
            </div>
            <button type="button" className="cmp-modal__close-btn" onClick={onClose} aria-label="Close modal">
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
                <h3>{t("complaint_modal.panels.original_title", { defaultValue: "Original Reference Listing" })}</h3>
              </div>
              
              <div className="cmp-panel__display-frame">
                <img 
                  src={originalPhotos[originalIdx]} 
                  alt="Original listing reference" 
                  loading="lazy"
                />
                
                <button 
                  type="button" 
                  className="cmp-panel__zoom-trigger"
                  onClick={() => setFullscreenImage(originalPhotos[originalIdx])}
                  title="Zoom image"
                >
                  <FiMaximize2 />
                </button>

                {originalPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button type="button" onClick={handlePrevOriginal} className="cmp-panel__arrow"><FiChevronLeft /></button>
                    <span className="cmp-panel__indicator">{originalIdx + 1} / {originalPhotos.length}</span>
                    <button type="button" onClick={handleNextOriginal} className="cmp-panel__arrow"><FiChevronRight /></button>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT LEG CONTAINER: BUYER COMPLAINT EVIDENCE IMAGES */}
            <section className="cmp-panel cmp-panel--complaint">
              <div className="cmp-panel__title-bar">
                <FiAlertCircle />
                <h3>{t("complaint_modal.panels.complaint_title", { defaultValue: "Buyer Damage Complaint Evidence" })}</h3>
              </div>
              
              <div className="cmp-panel__display-frame">
                <img 
                  src={complaintPhotos[complaintIdx]} 
                  alt="Buyer complaint uploaded evidence" 
                  loading="lazy"
                />

                <button 
                  type="button" 
                  className="cmp-panel__zoom-trigger"
                  onClick={() => setFullscreenImage(complaintPhotos[complaintIdx])}
                  title="Zoom image"
                >
                  <FiMaximize2 />
                </button>

                {complaintPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button type="button" onClick={handlePrevComplaint} className="cmp-panel__arrow"><FiChevronLeft /></button>
                    <span className="cmp-panel__indicator">{complaintIdx + 1} / {complaintPhotos.length}</span>
                    <button type="button" onClick={handleNextComplaint} className="cmp-panel__arrow"><FiChevronRight /></button>
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
                    MODAL FOOTER REGION BLOCK
             ==================================================== */}
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
                             defaultValue: "Justification Comment",
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
                             "Provide an administrative rationale for this decision...",
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
                         onClick={(e) => handleDecisionSubmit(e as any, "REJECT")}
                         disabled={isSubmitting || !comment.trim()}
                       >
                         {t("complaint_modal.footer.buttons.reject", {
                           defaultValue: "Not jusitified",
                         })}
                       </button>
                       <button
                         type="button"
                         className="cmp-footer-form__btn cmp-footer-form__btn--approve"
                         onClick={(e) => handleDecisionSubmit(e as any, "APPROVE")}
                         disabled={isSubmitting || !comment.trim()}
                       >
                         {t("complaint_modal.footer.buttons.approve", {
                           defaultValue: "Justified",
                         })}
                       </button>
                     </div>
                   </form>
                 </footer>

        </div>
      </div>

      {/* ====================================================
                LIGHTBOX THE FULLSCREEN LIGHTBOX PORTAL OVERLAY
         ==================================================== */}
      {fullscreenImage && (
        <div className="cmp-lightbox-overlay" onClick={() => setFullscreenImage(null)} role="dialog">
          <button type="button" className="cmp-lightbox-close" onClick={() => setFullscreenImage(null)}>
            <FiX />
          </button>
          <img src={fullscreenImage} alt="Fullscreen evidence evaluation focus view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};
