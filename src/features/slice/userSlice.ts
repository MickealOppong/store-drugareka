import { createSlice } from "@reduxjs/toolkit";
import type { TUserDto } from "../../types/TUserDto";
import { removeFromLocalStorage, storeToLocalStorage } from "../../util/util";


let initialState:TUserDto = {
  firstName: localStorage.getItem('fname') || "",
  lastName: localStorage.getItem('lname') || "",
  userId: parseInt(localStorage.getItem('id') as string),
  email: localStorage.getItem('email') || '',
  roles: JSON.parse(localStorage.getItem('roles') as string) || [],
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "",
    contact: ""
  },
  accountNumber:''
}
const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    loginUser: (state,{payload}) => {
      
      const {email,userId,tokenDto,firstName,lastName,roles,
      } = payload;
      const{token,refreshToken} = tokenDto;
     state.email = email;
     state.roles=roles;
     state.userId = userId;
     state.firstName = firstName;
     state.lastName = lastName;
  

     //store to local storage
     storeToLocalStorage('email',email)
     storeToLocalStorage('id',userId)
     storeToLocalStorage('fname',firstName)
     storeToLocalStorage('lname',lastName)
     storeToLocalStorage('tk',token)
     storeToLocalStorage('rtk',refreshToken)
     storeToLocalStorage('roles',JSON.stringify(roles))


    },  
    logoutUser: (state) => {
        state.userId = 0,
     state.email =''
     state.roles=[]
     state.firstName = ''
     state.lastName = ''
     removeFromLocalStorage('email')
        removeFromLocalStorage('id')
     removeFromLocalStorage('fname')
     removeFromLocalStorage('lname')
     removeFromLocalStorage('tk')
     removeFromLocalStorage('rtk')
     removeFromLocalStorage('roles')
    },

     updateUser: (state,{payload}) => {
      const {email,roles,
      } = payload;

     state.email=email;
     state.roles=roles;
  

     //store to local storage
     storeToLocalStorage('email',email)
     storeToLocalStorage('roles',JSON.stringify(roles))


    },  

  }
})
export const { loginUser, logoutUser,updateUser} = userSlice.actions
export default userSlice.reducer