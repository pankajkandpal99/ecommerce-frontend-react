import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  fetchProductsByFilters,
} from "./ProductAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: "idle",
  totalItems: 0,
  selectedProduct: null
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts", // The action type for the pending and fulfilled actions...
  async () => {
    const response = await fetchAllProducts(); // Fetching products asynchronously
    // The value we return becomes the `fulfilled` action payload
    // console.log(response.data);
    return response.data; // Returning the data from the response as the payload
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",                 // This is a action name
  async (id) => {
    const response = await fetchProductById(id); 
    // console.log(response.data);
    return response.data; 
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters", // In the createAsyncThunk function, the first parameter is the type string, which is a unique identifier for the action. It helps the Redux Toolkit manage the asynchronous action creators and reducers. The type string is typically written in the format "sliceName/actionName.". "product" is the name of your slice and after the slash "fetchProductsByFilters" is the name of your asynchronous action. So, when you dispatch fetchProductsByFiltersAsync, it will internally dispatch actions like "product/fetchProductsByFilters/pending," "product/fetchProductsByFilters/fulfilled," or "product/fetchProductsByFilters/rejected," based on the status of the asynchronous operation.
  async ({ filter, sort, pagination }) => {
    const response = await fetchProductsByFilters(filter, sort, pagination);
    return response.data;
  }
);

export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    return response.data;
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await fetchCategories();
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload; // upper fetchAllProductsAsync method se returned kiya gaya data yaha action.payload ke dwara send kiya ja ra hai ...
      })
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchBrandsAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
      })
      .addCase(fetchProductByIdAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
  },
});

// export const { increment } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;      // ye products state ko client side per available karata hai jise useSelector hook se import kiya jata hai. aur fir usme map lagaya jata hai taki products state ke andar ka data use kiya ja sake.
export const selectCategories = (state) => state.product.categories;     // ye category state ko client side per available karata hai jise useSelector hook se import kiya jata hai. aur fir usme map lagaya jata hai taki category state ke andar ka data use kiya ja sake.
export const selectBrands = (state) => state.product.brands;             // ye brands state ko client side per available karata hai jise useSelector hook se import kiya jata hai. aur fir usme map lagaya jata hai taki brands state ke andar ka data use kiya ja sake.
export const selectedProductById = (state) => state.product.selectedProduct;  // ye selectedProduct state ko client side per available karata hai jise useSelector hook se import kiya jata hai. aur fir usme map lagaya jata hai taki selectedProduct state ke andar ka data use kiya ja sake.
export const selectTotalItems = (state) => state.product.totalItems;     // ye totalItems state ko client side per available karata hai jise useSelector hook se import kiya jata hai. aur fir usme map lagaya jata hai taki totalItems state ke andar ka data use kiya ja sake.

export default productSlice.reducer;