import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "../features/api/cartApi";
import { setGuestCartCount } from "../features/slice/cartSlice";
import { CookieService } from "../util/util";

export const useAddToCart = () => {
  const [addToCart] = useAddToCartMutation();
  const token = CookieService.get('tk') || "";
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addItemToCart = async (listingId: number,offer?:number): Promise<boolean> => {
    setError(""); 
    setIsLoading(true);

    // ==========================================================================
    // 1. GUEST STORAGE PROTOCOL (UNAUTHENTICATED EXECUTIONS)
    // ==========================================================================
    if (!token) {
      try {
        const currentCart: number[] = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        
        if (currentCart.includes(listingId)) {
          // Local client side check fallback layout parameters
          setError(t("cart.item.reserved")); 
          setIsLoading(false);
          return false;
        }

        const updatedCart = [...currentCart, listingId];
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
        dispatch(setGuestCartCount(updatedCart.length)); 
        
        setIsLoading(false);
        return true;
      } catch (e) {
        setError(t("cart.update.failed"));
        setIsLoading(false);
        return false;
      }
    }
   
    // ==========================================================================
    // 2. BACKEND DATABASE INTEGRATION (AUTHENTICATED EXECUTIONS)
    // ==========================================================================
    try {
      const response = await addToCart(listingId).unwrap();
      
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

  return { addItemToCart, error, isLoading } as const;
};
