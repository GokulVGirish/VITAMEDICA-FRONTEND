import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import instance from "../Axios/doctorInstance";
import { AxiosError } from "axios";
export const verifyOtpSigup=createAsyncThunk<any,{otp:string},{rejectValue: string}>("doctor/verifyOtp",async(otp,thunkAPI)=>{
    try{
        const response = await instance.post("/verifyOtpSignup",otp);
        console.log("hellosss")
        console.log("data response", response.data);
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1 / 24,
        });
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 1 });
        
        return response.data

    }
    catch(error){
        if(error instanceof AxiosError){
          return thunkAPI.rejectWithValue(
            error.response?.data?.message || "an error occured"
          );
        }else if(error instanceof Error){
            return thunkAPI.rejectWithValue(error.message);
        }else{
             return thunkAPI.rejectWithValue("an unknown error occured");
        }


    }

})
export const doctorLogin=createAsyncThunk<any,{email:string,password:string},{rejectValue: string}>("doctor/login",async(data,thunkAPI)=>{
    try{
        const response=await instance.post("/login",data)
         Cookies.set("accessToken", response.data.accessToken, {
           expires: 1 / 24,
         });
         Cookies.set("refreshToken", response.data.refreshToken, {
           expires: 1,
         });
         return response.data

    }
    catch(error){
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

export const doctorDocumentUpload=createAsyncThunk<any,any,{rejectValue: string}>("doctor/docUpload",async(data,thunkAPI)=>{
    try{
        const response = await instance.post("/docUpload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data

    }
    catch(error){
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
    message:"",
    error:"",
    loading:false,
    doctor:null,
    docStatus:"Pending"
}
const doctorSlice=createSlice({
    name:"doctor",
    initialState,
    reducers:{
        clearErrorMessage:(state)=>{

            state.error=""
            state.message=""

        },
        clearDoctor:(state,action)=>{
            state.doctor=null

        }

    },
    extraReducers:(builder)=>{
        builder.addCase(verifyOtpSigup.pending,(state)=>{
            state.loading=true
            state.message=""
            state.error=""

        }).addCase(verifyOtpSigup.fulfilled,(state,action)=>{
            state.loading=false
            state.message=action.payload.message
            state.error=""
            console.log("doctor", action.payload.doctor);
            console.log("efwe", action.payload.status);
                state.doctor = action.payload.doctor
                state.docStatus=action.payload.status

        }).addCase(verifyOtpSigup.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string
        

        }).addCase(doctorLogin.pending,(state)=>{
            state.loading=true
            state.error=""
            state.message=""
        }).addCase(doctorLogin.fulfilled,(state,action)=>{
            state.loading=false
            state.message=action.payload.message
            state.doctor=action.payload.doctor
            state.docStatus=action.payload.status
            state.error=""
            
        }).addCase(doctorLogin.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string

        }).addCase(doctorDocumentUpload.pending,(state)=>{

                 state.loading = true;
                 state.error = "";
                 state.message = "";

        }).addCase(doctorDocumentUpload.fulfilled,(state,action)=>{
               state.loading = false;
                state.error = "";
                state.docStatus = action.payload.status;

        }).addCase(doctorDocumentUpload.rejected,(state,action)=>{
               state.loading = false;
               state.error = action.payload as string;


        })

    }

})
const doctorReducer=doctorSlice.reducer
export default doctorReducer
export const {clearDoctor,clearErrorMessage}=doctorSlice.actions