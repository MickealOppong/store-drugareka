import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector, useStore } from "react-redux";
import { authApi } from "./features/api/authApi";
import userSlice from "./features/slice/userSlice";
import utilSlice from "./features/slice/utilSlice";

import { cartApi } from "./features/api/cartApi";
import { checkoutApi } from "./features/api/checkoutApi";
import { itemApi } from "./features/api/itemApi";
import { storeApi } from "./features/api/storeApi";
import { transApi } from "./features/api/transApi";
import { userApi } from "./features/api/userApi";
import cartSlice from "./features/slice/cartSlice";
import sidebarSlice from "./features/slice/sidebarSlice";

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    sidebarSlice: sidebarSlice,
    cartSlice: cartSlice,
    utilSlice: utilSlice,
    [authApi.reducerPath]: authApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [transApi.reducerPath]: transApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([
      authApi.middleware,
      checkoutApi.middleware,
      transApi.middleware,
      userApi.middleware,
      storeApi.middleware,
      itemApi.middleware,
      cartApi.middleware,
    ]);
  },
  
});

setupListeners(store.dispatch);

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
