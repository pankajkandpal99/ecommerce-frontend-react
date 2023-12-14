import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkUser, createUser } from "./authAPI";

const initialState = {
  loggedInUser: null,
  status: "idle",
  error: null
};

export const createUserAsync = createAsyncThunk(
  "user/createUser", // <-- This is the slice name
  async (userData) => {
    const response = await createUser(userData);
    return response.data;
  }
);

export const checkUserAsync = createAsyncThunk(
  "user/checkUser", // <-- This is the slice name
  async (loginInfo) => {
    const response = await checkUser(loginInfo);
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: "user", // <-- This is the slice name
  initialState, // The `reducers` field lets us define reducers and generate associated actions...
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      });
  },
});

export const { increment } = counterSlice.actions;
export const selectLoggedInUser = (state) => state.auth.loggedInUser; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho.. isme state.auth.loggedInUser me auth isliye aaya hai kyuki ye selector store se send hota hai na ki slice se. kyuki authReducer ko client side per auth key ke naam se send kiya ja ra hai tabhi yaha auth aaya hai.
export const selectError = (state) => state.auth.error; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho.. 

export default counterSlice.reducer;

// 3:06:30
