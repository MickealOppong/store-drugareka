import { createSlice } from "@reduxjs/toolkit";

type init={
  showSidebar:boolean
}
const initialState:init = {
  showSidebar:false
}
const sidebarSlice = createSlice({
  name: 'sidebarSlice',
  initialState,
  reducers: {
    showSidebarMenu: (state) => {
        state.showSidebar = true;
    },
    hideSidebarMenu: (state) => {
         state.showSidebar = false
    }
  }
})
export const {showSidebarMenu,hideSidebarMenu} = sidebarSlice.actions
export default sidebarSlice.reducer
