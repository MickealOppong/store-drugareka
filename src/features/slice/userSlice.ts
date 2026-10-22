import { createSlice } from "@reduxjs/toolkit";
import { CookieService, getRolesCookie } from "../../util/util";



//  All initial state hydration lookups map cleanly through browser cookies!
let initialState: any= {
  firstName: CookieService.get("fname") || "",
  lastName: CookieService.get("lname") || "",
  userId: parseInt(CookieService.get("id") as string, 10) || -1,
  email: CookieService.get("email") || "",
  roles:getRolesCookie(),
  hasAddress: CookieService.get("hasAddress") || "",
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "",
    contact: "",
  },

};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    loginUser: (state, { payload }) => {
      const {
        email,
        userId,
        tokenDto,
        firstName,
        lastName,
        roles,
        address,
      } = payload;
      const { token, refreshToken } = tokenDto;
     

      state.email = email;
      state.roles = roles;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
      state.hasAddress =address!==null ? "true" : "false";

      //  Persistent for 7 days
      CookieService.set("email", email, 7);
      CookieService.set("id", String(userId), 7);
      CookieService.set("fname", firstName, 7);
      CookieService.set("lname", lastName, 7);
      CookieService.set("tk", token, 7);
      CookieService.set("hasAddress", state.hasAddress, 7);
      CookieService.set("rtk", refreshToken, 7);
      CookieService.set("roles", JSON.stringify(roles), 7);
    },
      updateUser: (state, { payload }) => {
      const {
        email,
        userId,
        firstName,
        lastName,
        roles,
       address,
      } = payload;

     

      state.email = email;
      state.roles = roles;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
      state.hasAddress =address!==null? "true" : "false";

      //  Persistent for 7 days
      CookieService.set("email", email, 7);
      CookieService.set("id", String(userId), 7);
      CookieService.set("fname", firstName, 7);
      CookieService.set("lname", lastName, 7);
      CookieService.set("hasAddress", state.hasAddress, 7);
      CookieService.set("roles", JSON.stringify(roles), 7);
    },
    logoutUser: (state) => {
      state.userId = -1; // Aligns with initial default values configuration rules
      state.email = "";
      state.roles = [];
      state.firstName = "";
      state.lastName = "";


      //Clear the cookie references on user sign-out
      CookieService.remove("email");
      CookieService.remove("id");
      CookieService.remove("fname");
      CookieService.remove("lname");
      CookieService.remove("tk");
      CookieService.remove("rtk");
      CookieService.remove("roles");
      CookieService.remove("hasAddress");
      initialState=undefined
     sessionStorage.clear();
    },
    updateRoles:(state,{payload})=>{

        const { roles } = payload;
       state.roles = roles;
    },
  },
});

export const { loginUser, logoutUser,updateUser ,updateRoles} = userSlice.actions;
export default userSlice.reducer;
