import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "../features/api/cartApi";

export const useAddToCart = () => {
  const [addToCart] = useAddToCartMutation();
 const dispatch = useDispatch()



  // Inside your Redux / React state logic:
  const addItemToCart = async (listingId: number) => {

   
   try {
  
     // dispatch(addGuestItem(listingId));
     const res = await addToCart(listingId);
     console.log(res);
     
   } catch (error) {
    
   }
  };

  return { addItemToCart } as const;
};
