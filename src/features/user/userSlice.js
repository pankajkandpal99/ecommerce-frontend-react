import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUser,
  fetchLoggedInUserOrders,
  updateUser,
} from "./userAPI";

const initialState = {
  userOrders: [],
  status: "idle",
  userInfo: null, // This info will be used in case of detailed user info, while auth will... only be used for loggedInUser id etc checks..
};

export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async (userId) => {
    console.log(userId);
    const response = await fetchLoggedInUserOrders(userId);
    return response.data; // ye tabhi return hoga jab promise fulfilled ho jayega.
  }
);

export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async (userId) => {
    console.log(userId);
    const response = await fetchLoggedInUser(userId);
    return response.data; // ye tabhi return hoga jab promise fulfilled ho jayega.
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (userId) => {
    console.log(userId);
    const response = await updateUser(userId);
    return response.data; // ye tabhi return hoga jab promise fulfilled ho jayega.
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserOrdersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userOrders = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userOrders = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // this info can be different or more from logged-in User info
        state.userInfo = action.payload;
      });
  },
});

export const { increment } = userSlice.actions;
export const selectUserOrders = (state) => state.user.userOrders;
export const selectUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer; // ye field userSlice ke reducer ka name field store ko deta hai jise store apne andar access karta hai.
