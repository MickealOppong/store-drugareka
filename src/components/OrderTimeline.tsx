import { useTranslation } from "react-i18next";
import { FiBox, FiCheckCircle, FiCreditCard, FiTruck, FiXCircle } from "react-icons/fi";
import "./../css/OrderTimeline.scss";



export const OrderTimeline = ({ currentStatus, updatedAtString }:{currentStatus:string,updatedAtString:string}) => {
  const { t } = useTranslation();

  // Define chronological milestones for standard active fulfillment cycles
  const activeMilestones = [
    { key: "PAID", icon: <FiCreditCard />, label: "Opłacone" },
    { key: "AWAITING_SHIPMENT", icon: <FiBox />, label: "Przygotowane" },
    { key: "SHIPPED", icon: <FiTruck />, label: "Wysłane" },
    { key: "DELIVERED", icon: <FiCheckCircle />, label: "Dostarczone" }
  ];

  // Helper calculation parameters to determine visual node highlight thresholds
  const getStepIndex = (status: string) => {
    switch (status) {
      case "PAID": return 1;
      case "AWAITING_SHIPMENT": return 2;
      case "SHIPPED": return 3;
      case "DELIVERED": return 4;
      default: return 0;
    }
  };

  
  const currentIndex = getStepIndex(currentStatus);

  /* =====================================================
     🚀 ABRUPT TERMINATION STATE: CANCELLED RED LAYOUT
     ====================================================== */
  if (currentStatus === "CANCELLED") {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <div className="order-timeline__alert-wrapper">
          <FiXCircle className="order-timeline__alert-icon" />
          <div className="order-timeline__alert-text">
            <h3>Zamówienie zostało anulowane</h3>
            <p>Ta transakcja została wycofana z systemu. Przedmioty przywrócono na witrynę sklepu, a środki skierowano do zwrotu manualnego.</p>
            {updatedAtString && <span className="order-timeline__timestamp">Data modyfikacji: {updatedAtString}</span>}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
      ACTIVE TRACKING PROGRESS BAR FLOW
     ====================================================== */
  return (
    <div className="order-timeline">
      <div className="order-timeline__grid">
        
        {activeMilestones.map((step, index) => {
          // Compute status properties for layout node decoration parameters
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          let stepModifier = "upcoming";
          if (isCompleted) stepModifier = "completed";
          if (isActive) stepModifier = "active";

          return (
            <div key={step.key} className={`order-timeline__node order-timeline__node--${stepModifier}`}>
              
              {/* Connection segment tracking connector lines */}
              {index > 0 && (
                <div 
                  className={`order-timeline__line-segment order-timeline__line-segment--${
                    index <= currentIndex ? "filled" : "empty"
                  }`} 
                />
              )}

              {/* Graphical Circular Icon Anchor */}
              <div className="order-timeline__circle">
                {step.icon}
              </div>

              {/* Text Description Indicator Metadata */}
              <div className="order-timeline__label-box">
                <span className="order-timeline__title-text">{step.label}</span>
                <span className="order-timeline__status-subtext">
                  {isActive ? t("activity.statuses.processing", { defaultValue: "W trakcie" }) : ""}
                  {isCompleted ? t("activity.statuses.completed", { defaultValue: "Gotowe" }) : ""}
                </span>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default OrderTimeline;
