
import { useTranslation } from "react-i18next";
import {
    FiHome,
    FiMapPin,
    FiPackage,
    FiTruck,
} from "react-icons/fi";
import "../css//DeliveryMethod.css";

interface DeliveryMethodsProps {
  className?: string;
}

const DeliveryMethods = ({ className = "" }: DeliveryMethodsProps) => {
  const methods = [
    {
      label: "Pickup point",
      icon: <FiMapPin />,
    },
    {
      label: "Home delivery",
      icon: <FiTruck />,
    },
    {
      label: "Parcel locker",
      icon: <FiPackage />,
    },
    {
      label: "Personal collection",
      icon: <FiHome />,
    },
  ];
  const {t} = useTranslation()

  return (
    <div className={`delivery-methods ${className}`}>
      <h4 className="delivery-methods__title">
     {t('delivery_methods.title')}
      </h4>

      <div className="delivery-methods__list">
        {methods.map((method) => (
          <div
            key={method.label}
            className="delivery-methods__item"
          >
            <span className="delivery-methods__icon">
              {method.icon}
            </span>

            <span>{t(`delivery_methods.${method.label.replace(" ","_").toLowerCase()}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethods;
