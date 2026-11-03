
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiLock } from 'react-icons/fi';
import Apay from '../assets/Apple-pay.svg';
import blik from '../assets/Blik.svg';
import Gpay from '../assets/G-pay.svg';
import klarna from '../assets/klarna.svg';
import mc from '../assets/Mastercard.svg';
import prze24 from '../assets/przelewy24.svg';
import revolut from '../assets/Revolut.svg';
import visa from '../assets/visa.svg';

import '../css/PaymentMethods.scss';

interface PaymentMethodItem {
  name: string;
  className: string;
}

export const PaymentMethods: React.FC = () => {
  const { t } = useTranslation();

  const paymentMethods: PaymentMethodItem[] = [
    { name: blik, className: 'blik' },
    { name: visa, className: 'visa' },
    { name: prze24, className: 'przelew24' },
    { name: Apay, className: 'apple-pay' },
    { name: Gpay, className: 'google-pay' },
    { name: klarna, className: 'klarna' },
    { name: mc, className: 'master-card' },
    { name: revolut, className: 'revolut' },
  ];

  return (
    <div
      className="payment-trust-bar"
      aria-label={t(
        'checkout.payment_methods.badge_row_label',
        { defaultValue: 'Available payment methods' }
      )}
    >
      <div className="payment-trust-bar__secure-tag">
        <FiLock aria-hidden="true" />
        <span>{t('landing.footer.secure_payment')}</span>
      </div>

      <div className="payment-trust-bar__grid">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className={`payment-trust-badge payment-trust-badge--${method.className}`}
            title={method.name}
          >
            <img src={method.name} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
