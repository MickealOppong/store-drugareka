import { createSlice } from "@reduxjs/toolkit";
import type { TUserDto } from "../../types/TUserDto";
import { CookieService } from "../../util/util";

// Helper safe parser wrapper for array nodes (e.g. roles) stored inside string-serialized fields
const safelyParseCookieJSON = (key: string): any => {
  const cookieValue = CookieService.get(key);
  if (!cookieValue) return null;
  try {
    return JSON.parse(cookieValue);
  } catch (e) {
    console.error(
      `Cookie Parsing Exception: Failed to decode serialized JSON layout for key: ${key}`,
      e,
    );
    return null;
  }
};

//  All initial state hydration lookups map cleanly through browser cookies!
const initialState: TUserDto = {
  firstName: CookieService.get("fname") || "",
  lastName: CookieService.get("lname") || "",
  userId: parseInt(CookieService.get("id") as string, 10) || -1,
  email: CookieService.get("email") || "",
  roles: safelyParseCookieJSON("roles") || [],
  hasAddress: CookieService.get("hasAddress") || "",
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "",
    contact: "",
  },
  accountNumber: "",
  pesel: "",
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
        hasAddress,
      } = payload;
      const { token, refreshToken } = tokenDto;

      state.email = email;
      state.roles = roles;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
      state.hasAddress = hasAddress ? "true" : "false";

      //  Persistent for 7 days
      CookieService.set("email", email, 7);
      CookieService.set("id", String(userId), 7);
      CookieService.set("fname", firstName, 7);
      CookieService.set("lname", lastName, 7);
      CookieService.set("tk", token, 7);
      CookieService.set("hasAddress", hasAddress, 7);
      CookieService.set("rtk", refreshToken, 7);
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
    },
    updateUser: (state, { payload }) => {
      const { email, roles, hasAddress } = payload;

      if (email) {
        state.email = email;
      }
      if (roles) {
        state.roles = roles;
      }
      if (hasAddress) {
       state.hasAddress = hasAddress ? "true" : "false";
      }

      // Update values dynamically inside cookie tracking chains
      CookieService.set("email", state.email, 7);
         CookieService.set("hasAddress", state.hasAddress, 7);
      CookieService.set("roles", JSON.stringify(state.roles), 7);
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
