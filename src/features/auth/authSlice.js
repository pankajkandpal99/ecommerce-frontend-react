import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, createUser, signOut, checkAuth } from "./authAPI";

const initialState = {
  loggedInUserToken: null, // this should only contain user identity => 'id', 'email', 'role'... user se related loggedInUser me nahi rahengi...
  status: "idle",
  error: null,
  userChecked: false,
};

// Thunk middleware ko use karke, aap async actions ko dispatch kar sakte hain, jaise ki API calls, aur phir jab tak response nahi milta, tab tak reducers ko update nahi karta hai.
export const createUserAsync = createAsyncThunk(
  "user/createUser", // <-- This is the slice name
  async (userData) => {
    const response = await createUser(userData);
    return response.data;
  }
);

export const loginUserAsync = createAsyncThunk(
  "user/checkUser", // <-- This is the slice name
  async (loginInfo, { rejectWithValue }) => {
    // rejectWithValue asyncThunk ka hi ek prop hai jo ki iske andar error ko action ke state me set kar deta hai.
    try {
      const response = await loginUser(loginInfo);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const checkAuthAsync = createAsyncThunk("user/checkAuth", async () => {
  try {
    const response = await checkAuth();
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
});

export const signOutAsync = createAsyncThunk("user/sigOut", async () => {
  const response = await signOut();
  console.log("sign out -> ", response.data);
  return response.data;
});

export const authSlice = createSlice({
  name: "user", // <-- This is the slice name
  initialState: initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
  },

  extraReducers: (builder) => {
    // extraReducers ek mechanism hai jo Redux Toolkit ke sath aata hai aur ye asyncThunk actions ko monitor karta hai. extraReducers object mein aap specify kar sakte hain ki jab bhi koi particular action (asyncThunk ya koi aur) dispatch hoti hai, to uske baad kya karna hai. Iske through, aap success (fulfilled), pending (pending), aur failure (rejected) states ke liye reducers ko define kar sakte hain. Ye states asyncThunk actions ke lifecycle ke hisab se hote hain. extraReducers ka istemal in states ke liye reducers ko define karne mein hota hai, aur ye asyncThunk actions ke sath achhe se kaam karta hai, unke lifecycle events pe focus karke.
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userChecked = true;
      });
  },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho.. isme state.auth.loggedInUser me auth isliye aaya hai kyuki ye reducer ka naam hai.
export const selectError = (state) => state.auth.error; // ye selector hai jo hum waha use karte hain jaha hume iski state ko access karna ho..
export const selectUserChecked = (state) => state.auth.userChecked;

export default authSlice.reducer;
