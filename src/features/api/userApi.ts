import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TListPagePayout } from "../../types/TListPagePayouts";
import type { TResponseDto } from "../../types/TResponseDto";
import type { TListShipmentPage } from "../../types/TShipment";
import type { TUserDto } from "../../types/TUserDto";
import type { TUserUpdateRequest } from "../../types/TUserUpdatRequest";
import { baseUrl } from "./baseUrl";







export const userApi = createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({
    baseUrl,
                  prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
     const token = localStorage.getItem('tk')??'';

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    
    }),
    tagTypes:['users','user','roles'],
    endpoints:(build)=>({
        getUser:build.query<TResponseDto,void>({
            query:()=>({
                url:`/api/users/user`,
            }),
              providesTags:['user'],
          
        }),
  changePassword:build.mutation<TResponseDto,{currentPassword:string,newPassword:string}>({
            query:({currentPassword,newPassword})=>({
                url:`/api/users/change-password`,
              params:{
                currentPassword,newPassword
              },
              method:'PUT'
            }),
            invalidatesTags:['user']
          
        }),
         getAllUsers:build.query<TUserDto[],void>({
            query:()=>({
                url:`/api/users/all`,
            }),
              providesTags:['users'],
          
        }),
          newUser:build.mutation<TResponseDto,TUserUpdateRequest>({
            query:(body)=>({
                url:`/api/users/new`,
                method:"POST",
                body
            }),
              invalidatesTags:['user','users']
          
        }),
          editUser:build.mutation<TResponseDto,FormData>({
            query:(body)=>({
                url:`/api/users/edit`,
                method:"PUT",
                body
            }),
              invalidatesTags:['user','users']
          
        }),
           deleteUser:build.mutation<TResponseDto,number>({
            query:(userId)=>({
                url:`/api/users/delete`,
                method:"DELETE",
                params:{
                    userId
                }
            }),
              invalidatesTags:['user','users']
        }),
             allRoles:build.query<string[],void>({
            query:()=>({
                url:`/api/users/roles`,
            }),
        }),
           getMyPayouts: build.query<TListPagePayout,{page:number,size:number}>({
              query: ({page,size}) => ({
                url: "/api/users/payouts",
                params:{
                  page,size
                }
              }),

            }),
             updatePayoutStatus: build.mutation<TResponseDto,{payoutId:number,paidAt:string}>({
              query: ({paidAt,payoutId}) => ({
                url: "/api/users/settle-order",
                params:{
               paidAt,payoutId
                },
                method:"PUT"
              }),

            }),
             getShipments: build.query<TListShipmentPage,{page:number,size:number}>({
              query: ({page,size}) => ({
                url: "/api/shipment/shipments",
                params:{
                    page,size
                }
              }),

            }),
      
    }),
 
})
export const {useNewUserMutation,useEditUserMutation,useDeleteUserMutation,useLazyGetUserQuery,useLazyGetAllUsersQuery
    ,useLazyAllRolesQuery,useGetMyPayoutsQuery,useGetShipmentsQuery,useChangePasswordMutation,
    useUpdatePayoutStatusMutation
}=userApi
