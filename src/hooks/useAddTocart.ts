import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "../features/api/cartApi";
import { setGuestCartCount } from "../features/slice/cartSlice";

export const useAddToCart = () => {
  const [addToCart] = useAddToCartMutation();
  const token = localStorage.getItem('tk')
 const dispatch = useDispatch()



  // Inside your Redux / React state logic:
  const addItemToCart = async (listingId: number) => {

    if (!token) {
    //  Read existing array, append new item, and save back to local storage
    const currentCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    const updatedCart = [...currentCart,listingId];
    
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    dispatch(setGuestCartCount(updatedCart.length)); // Instantly updates your MobileNav badge!
    return;
  }
   
   try {
  
     // dispatch(addGuestItem(listingId));
     await addToCart(listingId);
     
   } catch (error) {
    
   }
  };

  return { addItemToCart } as const;
};
