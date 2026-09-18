import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle } from "react-icons/fi";

interface CartTimerProps {
  expiryTimestamp: string;
}

const CartTimer: React.FC<CartTimerProps> = ({ expiryTimestamp }) => {
  const { t } = useTranslation();

  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    if (difference <= 0) return 0;
    return Math.floor(difference / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const currentDifference = calculateTimeLeft();
      setTimeLeft(currentDifference);
      
      if (currentDifference <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTimestamp, timeLeft]);

  if (timeLeft <= 0) {
    return <span role="status">{t("cart.timer.expired")}</span>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div role="status">
      <FiAlertCircle />
      <span>
        {t("cart.timer.holding", { time: `${minutes}:${formattedSeconds}` })}
      </span>
    </div>
  );
};

export default CartTimer;
