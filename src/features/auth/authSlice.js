import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkUser, createUser, signOut } from "./authAPI";
import { updateUser } from "../user/userAPI";

const initialState = {
  loggedInUser: null,
  status: "idle",
  error: null,
};

export const createUserAsync = createAsyncThunk(
  "user/createUser", // <-- This is the slice name
  async (userData) => {
    const response = await createUser(userData);
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser", // <-- This is the slice name.. yahi slice ka name extraReducer me jake inki promise ke based per hamare queris ko handle karega.
  async (update) => {
    const response = await updateUser(update);
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

export const signOutAsync = createAsyncThunk("user/sigOut", async (userId) => {
  const response = await signOut(userId);
  console.log(response);
  return response.data;
});

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
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // const index = state.loggedInUser.findIndex((user) => user.id === action.payload.id);
        // state.loggedInUser[index] += action.payload
        state.loggedInUser = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.loggedInUser = null;
      })
  },
});

export const { increment } = counterSlice.actions;
export const selectLoggedInUser = (state) => state.auth.loggedInUser; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho.. isme state.auth.loggedInUser me auth isliye aaya hai kyuki ye reducer ka naam hai.
export const selectError = (state) => state.auth.error; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho..
// export const updateUser = (state) => state.auth.loggedInUser;

export default counterSlice.reducer;
