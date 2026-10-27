import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddToCartOfferMutation } from "../features/api/cartApi";

export const useAddToCartOffer = () => {
  const [addToCart] = useAddToCartOfferMutation()
  const { t } = useTranslation();
  
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addItemToCartOffer = async (listingId: number,offer:number): Promise<boolean> => {
    setError(""); 
    setIsLoading(true);
   
    try {
      const response = await addToCart({listingId,offer}).unwrap();
      
      // If the backend passes a custom ResponseDto payload indicating soft failures
      if (response && response.data=== false) {
      
        setError(response.message); 
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;

    } catch (apiError: any) {
      console.error("Cart transaction lifecycle failure intercept:", apiError);
      

      // Pulls out the translated Polish or English sentence directly
      const backendTranslatedMessage = apiError?.data?.message;
      
      if (backendTranslatedMessage) {
        setError(backendTranslatedMessage);
      } else {
        // Fallback only if the entire API context drops entirely offline (e.g. 500 or Network Loss)
        setError(t("cart.update.failed"));
      }

      setIsLoading(false);
      return false;
    }
  };

  return { addItemToCartOffer, error, isLoading } as const;
};
