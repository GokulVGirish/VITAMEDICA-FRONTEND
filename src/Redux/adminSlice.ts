import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminInstance from "../Axios/adminInstance";

import { AxiosError } from "axios";

export const adminLogin = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>("admin/login", async (data, thunkAPI) => {
  try {
    const response = await adminInstance.post("/auth/login", data);

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
  loading: false,
  error: "",
  message: "",
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearErrorMessageAdmin: (state) => {
      state.error = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "";
      });
  },
});

const adminReducer = adminSlice.reducer;
export default adminReducer;
export const { clearErrorMessageAdmin } = adminSlice.actions;
