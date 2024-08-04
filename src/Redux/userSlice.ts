
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Cookie from "js-cookie"
import instance from "../Axios/axios";
import { AxiosError } from "axios";

export const verifyOtpSigup=createAsyncThunk<any,{otp:string},{rejectValue: string}>("user/verifyOtp",async(otp,thunkAPI)=>{
    try{
        const response=await instance.post("/verifyOtpSignup",otp)
        Cookie.set("accessToken",response.data.accessToken)
        Cookie.set("refreshToken",response.data.refreshToken)
        console.log("response of signup",response.data)
    
        return response.data


    }
    catch(error ){
        console.log("error",error)
        if(error instanceof AxiosError){
             return thunkAPI.rejectWithValue(error.response?.data?.message||"an error occured")
        }else if(error instanceof Error){
            return thunkAPI.rejectWithValue(error.message)
        }else{
            return thunkAPI.rejectWithValue("an unknown error occured")
        }
       
    }

})
export const loginUser=createAsyncThunk<any,{email:string,password:string},{rejectValue: string}>("user/login",async(data,thunkAPI)=>{

    try{
        const response=await instance.post("/login",data)
       Cookie.set("accessToken", response.data.accessToken); 


      Cookie.set("refreshToken", response.data.refreshToken); 
        return response.data

    }
    catch(error){
        console.log(error)
              if(error instanceof AxiosError){
             return thunkAPI.rejectWithValue(error.response?.data?.message||"an error occured")
        }else if(error instanceof Error){
            return thunkAPI.rejectWithValue(error.message)
        }else{
            return thunkAPI.rejectWithValue("an unknown error occured")
        }
       
    }

})
export const googleLogin=createAsyncThunk<any,{email:string;name:string,sub:string},{rejectValue: string}>("user/googleLogin",async(data,thunkAPI)=>{
    try{
        const response = await instance.post("/googleLogin", data);
         Cookie.set("accessToken", response.data.accessToken);

         Cookie.set("refreshToken", response.data.refreshToken);
         return response.data;

    }
    catch(error){
          console.log(error);
          if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(
              error.response?.data?.message || "an error occured"
            );
          } else if (error instanceof Error) {
            return thunkAPI.rejectWithValue(error.message);
          } else {
            return thunkAPI.rejectWithValue("an unknown error occured");
          }

    }
})



const initialState={
    user:null,
    error:"",
    loading:false,
    message:""

}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        clearUser:(state,action)=>{

            state.user=null
        },
        clearErrorMessage:(state)=>{
            state.error=""
            state.message=""

        },
       
    },
    extraReducers:(builder)=>{
        builder.addCase(verifyOtpSigup.pending,(state)=>{
            state.loading=true
            state.error=""
            state.message=""

        }).addCase(verifyOtpSigup.fulfilled,(state,action)=>{
            state.message=action.payload.message
            state.loading=false

        }).addCase(verifyOtpSigup.rejected,(state,action)=>{
            state.error=action.payload as string
            state.loading=false


        }).addCase(loginUser.pending,(state)=>{
            state.loading=true
            state.error=""
            state.message=""

        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.message=action.payload.message
            state.loading=false

        }).addCase(loginUser.rejected,(state,action)=>{
            state.error=action.payload as string
            state.loading=false
        }).addCase(googleLogin.pending,(state)=>{
             state.loading = true;
             state.error = "";
             state.message = "";

        }).addCase(googleLogin.fulfilled,(state,action)=>{
                state.message = action.payload.message;
                state.loading = false;
        }).addCase(googleLogin.rejected,(state,action)=>{
              state.error = action.payload as string;
              state.loading = false;

        })

    }


})
const userReducer=userSlice.reducer
export default userReducer
export const {clearUser,clearErrorMessage}=userSlice.actions