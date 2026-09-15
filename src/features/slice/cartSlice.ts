import { createSlice } from "@reduxjs/toolkit";

const initialItems: number[] = JSON.parse(localStorage.getItem("guest_cart") || "[]") as number[];

type TInit={
     guestCartItems:number[]
  guestCartCount: number
}
    
const initialState:TInit = {
 guestCartItems: initialItems,
  guestCartCount: initialItems.length,
}
const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
   addGuestItem: (state,{payload}) => {

     if (!state.guestCartItems.includes(payload)) {
        
      
        state.guestCartItems.push(payload);
        
       
        state.guestCartCount = state.guestCartItems.length;

     
        localStorage.setItem("guest_cart", JSON.stringify(state.guestCartItems));
    }
    
    },
       clearGuestCart: (state) => {
            state.guestCartItems = [];
      state.guestCartCount = 0;
      localStorage.removeItem("guest_cart");
    },

  updateGuestCartItems: (state,{payload}) => {
    state.guestCartItems =payload;

    console.log(payload);
    
      // Synchronize with local storage backup cache
        localStorage.setItem("guest_cart", JSON.stringify(state.guestCartItems||[]));      
    },
    
  }
})
export const {addGuestItem,clearGuestCart,updateGuestCartItems} = cartSlice.actions
export default cartSlice.reducer