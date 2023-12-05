import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchProductsByFilters } from "./ProductAPI";

const initialState = {
  products: [],
  status: "idle",
  totalItems: 0
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",                 // The action type for the pending and fulfilled actions...
  async () => {
    const response = await fetchAllProducts();         // Fetching products asynchronously
    // The value we return becomes the `fulfilled` action payload
    // console.log(response.data);
    return response.data;                  // Returning the data from the response as the payload
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",             // In the createAsyncThunk function, the first parameter is the type string, which is a unique identifier for the action. It helps the Redux Toolkit manage the asynchronous action creators and reducers. The type string is typically written in the format "sliceName/actionName.". "product" is the name of your slice and after the slash "fetchProductsByFilters" is the name of your asynchronous action. So, when you dispatch fetchProductsByFiltersAsync, it will internally dispatch actions like "product/fetchProductsByFilters/pending," "product/fetchProductsByFilters/fulfilled," or "product/fetchProductsByFilters/rejected," based on the status of the asynchronous operation. 
  async ({filter, sort, pagination}) => {
    const response = await fetchProductsByFilters(filter, sort, pagination);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;  // upper fetchAllProductsAsync method se returned kiya gaya data yaha action.payload ke dwara send kiya ja ra hai ...
      })
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle"; 
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      });
  },
});

export const { increment } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;    // redux store ki state me available products array ko send kar rahe hain direct access karne ke liye use useSelector hook.
export const selectTotalItems = (state) => state.product.totalItems;  // redux store ki state me available totalItems ko send kar rahe hain direct access karne ke liye use useSelector hook.

export default productSlice.reducer;
