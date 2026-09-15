import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  showForm:false,
  showFilter:false,
  lastMessage:'',
  matchId:0,
}
const utilSlice = createSlice({
  name: 'utilSlice',
  initialState,
  reducers: {
    showForm: (state) => {
        state.showForm = !state.showForm
    },
    hideForm: (state) => {
         state.showForm = !state.showForm
    },
       showFitler: (state) => {
        state.showFilter = !state.showFilter
    },
    hideFilter: (state) => {
         state.showFilter =!state.showFilter
    },

    
  }
})
export const {showForm,hideForm,showFitler,hideFilter} = utilSlice.actions
export default utilSlice.reducer