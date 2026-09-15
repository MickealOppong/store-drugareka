import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TLogin } from "../../types/TLogin";
import { type TRegisterDto } from "../../types/TRegisterDto";
import type { TResponseDto } from "../../types/TResponseDto";

import { baseUrl } from "./baseUrl";



export const authApi = createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl,
    }),
    tagTypes:['wishlists'],
    endpoints:(build)=>({
        addUser:build.mutation<TResponseDto,TRegisterDto>({
            query:(body)=>({
                url:'/auth/register',
                method:'post',
               body,
               headers:{
                'Content-Type': 'application/json'
               }
            })
        }),
        login:build.mutation<TResponseDto,TLogin>({
            query:(body)=>({
                   url:'/auth/login',
                method:'post',
               body,
               headers:{
                'Content-Type': 'application/json'
               }
            })
        }),
          logout:build.mutation<boolean,string>({
            query:(refreshToken)=>({
                   url:'/auth/logout',
                method:'Delete',
               params:{
                    refreshToken
               },
               headers:{
                'Content-Type': 'application/json'
               }
            }),
            invalidatesTags:['wishlists']
        })
        
    })
 
})
export const {useAddUserMutation,useLoginMutation,useLogoutMutation
}=authApi
