
import { useTranslation } from "react-i18next";
import "../css/ProductBnpl.scss";

interface ProductBnplProps {
    className?: string;
}

const ProductBnpl = ({ className = "" }: ProductBnplProps) => {
    const {t}=useTranslation();
    return (
        <aside
            className={`product-bnpl ${className}`}
            aria-label="Elastyczne płatności Klarna"
        >
            <div className="product-bnpl__brand">
                <span className="product-bnpl__brand-name">Klarna.</span>
            </div>

            <div className="product-bnpl__content">
                <p className="product-bnpl__title">
                   {t('product_details.bnpl.title')}
                </p>

                <p className="product-bnpl__description">
              {t('product_details.bnpl.description')}
                </p>
            </div>
        </aside>
    );
};

export default ProductBnpl;
