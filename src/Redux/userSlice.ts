
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Cookie from "js-cookie"
import instance from "../Axios/userInstance";
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";


export const verifyOtpSigup=createAsyncThunk<any,{otp:string,socket:Socket|null},{rejectValue: string}>("user/verifyOtp",async(data,thunkAPI)=>{
    try{
        const {otp,socket}=data
        const response = await instance.post("/auth/signup/verify-otp", {otp});
        Cookie.set("accessToken",response.data.accessToken)
        Cookie.set("refreshToken",response.data.refreshToken)
        console.log("response of signup",response.data)
         if (socket) {
           socket.emit("loggedin", response.data.userId);
         }

    
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
export const loginUser=createAsyncThunk<any,{email:string,password:string,socket: Socket | null},{rejectValue: string}>("user/login",async(data,thunkAPI)=>{


    try{
          const response = await instance.post("/auth/login", {
            email: data.email,
            password: data.password,
          });


    const { accessToken, refreshToken, userId } = response.data;
 
     

 
       Cookie.set("accessToken", accessToken);
       Cookie.set("refreshToken", refreshToken);
       console.log("socket data",data.socket)

  
         if (data.socket) {
           data.socket.emit("loggedin",  userId );
         }


 
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
export const googleLogin=createAsyncThunk<any,{email:string;name:string,sub:string,socket:Socket|null},{rejectValue: string}>("user/googleLogin",async(data,thunkAPI)=>{
    const {email,name,sub,socket}=data
    try{
        const response = await instance.post("/auth/google/login", {email,name,sub});
         Cookie.set("accessToken", response.data.accessToken);

         Cookie.set("refreshToken", response.data.refreshToken);
          if (socket) {
            socket.emit("loggedin", response.data.userId);
          }
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
        clearUser:(state)=>{

            state.user=null
        },
        clearErrorMessage:(state)=>{
            state.error=""
            state.message=""
            state.loading=false

        },
        updateName:(state,action)=>{
            state.user=action.payload


        }
       
    },
    extraReducers:(builder)=>{
        builder.addCase(verifyOtpSigup.pending,(state)=>{
            state.loading=true
            state.error=""
            state.message=""

        }).addCase(verifyOtpSigup.fulfilled,(state,action)=>{
            state.message=action.payload.message
            state.loading=false
            state.user=action.payload.name

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
            state.user=action.payload.name

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
              state.user = action.payload.name;
        }).addCase(googleLogin.rejected,(state,action)=>{
              state.error = action.payload as string;
              state.loading = false;

        })

    }


})
const userReducer=userSlice.reducer
export default userReducer
export const {clearUser,clearErrorMessage,updateName}=userSlice.actions