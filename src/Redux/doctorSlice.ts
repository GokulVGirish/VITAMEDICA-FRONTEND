import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import instance from "../Axios/doctorInstance";
import { AxiosError } from "axios";
import { Socket } from "socket.io-client";
export const verifyOtpSigup = createAsyncThunk<
  any,
  { otp: string; socket: Socket | null },
  { rejectValue: string }
>("doctor/verifyOtp", async (data, thunkAPI) => {
  try {
    const { otp, socket } = data;
    const response = await instance.post("/auth/signup/verify-otp", { otp });
    Cookies.set("accessToken", response.data.accessToken);
    Cookies.set("refreshToken", response.data.refreshToken);
    if (socket) {
      socket.emit("loggedin", response.data.docId);
      socket.emit("send_notification", {
        receiverId: response.data.docId,
        content: `Thankyou for being a part of vitamedica.Hurry up complete your profile`,
        type: "welcome",
      });
    }

    return response.data;
  } catch (error) {
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
});
export const doctorLogin = createAsyncThunk<
  any,
  { email: string; password: string; socket: Socket | null },
  { rejectValue: string }
>("doctor/login", async (data, thunkAPI) => {
  try {
    const response = await instance.post("/auth/login", {
      email: data.email,
      password: data.password,
    });

    Cookies.set("accessToken", response.data.accessToken);
    Cookies.set("refreshToken", response.data.refreshToken);
    if (data.socket) {
      data.socket.emit("loggedin", response.data.docId);
    }

    return response.data;
  } catch (error) {
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
});

export const doctorDocumentUpload = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("doctor/docUpload", async (data, thunkAPI) => {
  try {
    const response = await instance.post("/utility/upload-documents", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
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
});

const initialState = {
  message: "",
  error: "",
  loading: false,
  doctor: null,
  docStatus: "Pending",
};
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.error = "";
      state.message = "";
      state.loading = false;
    },
    clearDoctor: (state) => {
      state.doctor = null;
    },
    verifyDoctor: (state, action) => {
      state.docStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpSigup.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = "";
      })
      .addCase(verifyOtpSigup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = "";

        state.doctor = action.payload.doctor;
        state.docStatus = action.payload.status;
      })
      .addCase(verifyOtpSigup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(doctorLogin.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(doctorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.doctor = action.payload.doctor;
        state.docStatus = action.payload.status;
        state.error = "";
      })
      .addCase(doctorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(doctorDocumentUpload.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(doctorDocumentUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.docStatus = action.payload.status;
      })
      .addCase(doctorDocumentUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
const doctorReducer = doctorSlice.reducer;
export default doctorReducer;
export const { clearDoctor, clearErrorMessage, verifyDoctor } =
  doctorSlice.actions;
