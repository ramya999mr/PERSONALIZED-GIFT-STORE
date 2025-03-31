import { createSlice } from "@reduxjs/toolkit";
import { setStorageData } from "../utils/useLocalStorage";

const CART = "CART";

const initialState = {
  coupon: {
    code: "",
    discount: 0,
  },
  items: [],
  billingInfo: {
    fullName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  },
  shippingInfo: {
    fullName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  },
  deliveryInfo: {
    type: "",
    area: "",
    cost: 0,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.items.find(
        (item) => item._id === action.payload._id,
      );
      const itemExistsWithQty = itemExists && action.payload.qty > 1;
      if (itemExistsWithQty) {
        itemExists.qty = itemExists.qty + action.payload.qty;
      } else if (itemExists) {
        itemExists.qty++;
      } else {
        state.items.push({ ...action.payload });
      }
      setStorageData(CART, state);
    },
    addVariableProductToCart: (state, action) => {
      const itemExists = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.color.name == action.payload.color.name &&
          item.attribute.name == action.payload.attribute.name,
      );
      const itemExistsWithQty = itemExists && action.payload.qty > 1;
      if (itemExistsWithQty) {
        itemExists.qty = itemExists.qty + action.payload.qty;
      } else if (itemExists) {
        itemExists.qty++;
      } else {
        state.items.push({ ...action.payload });
      }
      setStorageData(CART, state);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.uid === action.payload);
      item.qty++;
      setStorageData(CART, state);
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.uid === action.payload);
      if (item.qty === 1) {
        const index = state.items.findIndex(
          (item) => item.uid === action.payload,
        );
        state.items.splice(index, 1);
      } else {
        item.qty--;
      }
      setStorageData(CART, state);
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.uid === action.payload,
      );
      state.items.splice(index, 1);
      setStorageData(CART, state);
    },
    updateCart: (state, action) => {
      const coupon = action.payload.coupon
        ? action.payload.coupon
        : { code: "", discount: 0 };
      const items = action.payload.items ? action.payload.items : [];
      const shippingData = action.payload.shippingInfo
        ? action.payload.shippingInfo
        : initialState.shippingInfo;
      const billingData = action.payload.billingInfo
        ? action.payload.billingInfo
        : initialState.billingInfo;
      const deliveryData = action.payload.deliveryInfo
        ? action.payload.deliveryInfo
        : initialState.deliveryInfo;
      state.coupon = coupon;
      state.items.push(...items);
      state.billingInfo = billingData;
      state.shippingInfo = shippingData;
      state.deliveryInfo = deliveryData;
    },
    resetCart: (state, action) => {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        initialState;
      state.coupon = coupon;
      state.items = items;
      state.billingInfo = billingInfo;
      state.shippingInfo = shippingInfo;
      state.deliveryInfo = deliveryInfo;
      setStorageData(CART, state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      setStorageData(CART, state);
    },
    updateBillingData: (state, action) => {
      state.billingInfo = action.payload.billingInfo;
      state.shippingInfo = action.payload.shippingInfo;
      state.deliveryInfo = action.payload.deliveryInfo;
      setStorageData(CART, state);
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const {
  addToCart,
  addVariableProductToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateCart,
  resetCart,
  applyCoupon,
  updateBillingData,
} = cartSlice.actions;
