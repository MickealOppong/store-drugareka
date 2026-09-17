import { createSlice } from "@reduxjs/toolkit";

const initialItems: number[] = JSON.parse(localStorage.getItem("guest_cart") || "[]") as number[];

type TInit={
  guestCartCount: number
}
    
const initialState:TInit = {
  guestCartCount: initialItems.length,
}
const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
      setGuestCartCount: (state,{payload}) => {
      state.guestCartCount = payload
    }
    
  }
})
export const {setGuestCartCount} = cartSlice.actions
export default cartSlice.reducer