"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { DEFAULT_COUNTRY, type CountryCode } from "./pricing";
import { detectCountry } from "./api";

export interface CartItem {
  productId: number;
  quantity: number;
  isUpsell?: boolean;
}

interface CartState {
  items: CartItem[];
  country: CountryCode;
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; productId: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "INCREMENT"; productId: number }
  | { type: "DECREMENT"; productId: number }
  | { type: "ADD_BUNDLE"; productIds: number[] }
  | { type: "SET_COUNTRY"; country: CountryCode }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "OPEN_CHECKOUT" }
  | { type: "CLOSE_CHECKOUT" }
  | { type: "CLEAR_CART" }
  | { type: "RESET_FLOW" };

const GCC_CODES = new Set(["SA", "AE", "KW", "QA", "BH", "OM"]);

const initialState: CartState = {
  items: [],
  country: DEFAULT_COUNTRY,
  isDrawerOpen: false,
  isCheckoutOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.productId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          isDrawerOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { productId: action.productId, quantity: 1 }],
        isDrawerOpen: true,
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    case "DECREMENT": {
      const item = state.items.find((i) => i.productId === action.productId);
      if (item && item.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      };
    }
    case "ADD_BUNDLE": {
      let items = [...state.items];
      for (const productId of action.productIds) {
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          items = items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          items = [...items, { productId, quantity: 1 }];
        }
      }
      return { ...state, items, isDrawerOpen: true };
    }
    case "SET_COUNTRY":
      return { ...state, country: action.country };
    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };
    case "OPEN_CHECKOUT":
      return { ...state, isCheckoutOpen: true, isDrawerOpen: false };
    case "CLOSE_CHECKOUT":
      return { ...state, isCheckoutOpen: false };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        isDrawerOpen: false,
        isCheckoutOpen: false,
      };
    case "RESET_FLOW":
      return {
        ...state,
        items: [],
        isDrawerOpen: false,
        isCheckoutOpen: false,
      };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  addBundle: (productIds: number[]) => void;
  setCountry: (country: CountryCode) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  clearCart: () => void;
  resetFlow: () => void;
  totalItems: number;
  cartProductIds: number[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    detectCountry()
      .then((geo) => {
        if (GCC_CODES.has(geo.country)) {
          dispatch({ type: "SET_COUNTRY", country: geo.country as CountryCode });
        }
      })
      .catch(() => {});
  }, []);

  const addItem = useCallback(
    (productId: number) => dispatch({ type: "ADD_ITEM", productId }),
    []
  );
  const removeItem = useCallback(
    (productId: number) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );
  const increment = useCallback(
    (productId: number) => dispatch({ type: "INCREMENT", productId }),
    []
  );
  const decrement = useCallback(
    (productId: number) => dispatch({ type: "DECREMENT", productId }),
    []
  );
  const addBundle = useCallback(
    (productIds: number[]) => dispatch({ type: "ADD_BUNDLE", productIds }),
    []
  );
  const setCountry = useCallback(
    (country: CountryCode) => dispatch({ type: "SET_COUNTRY", country }),
    []
  );
  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DRAWER" }),
    []
  );
  const openCheckout = useCallback(
    () => dispatch({ type: "OPEN_CHECKOUT" }),
    []
  );
  const closeCheckout = useCallback(
    () => dispatch({ type: "CLOSE_CHECKOUT" }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const resetFlow = useCallback(() => dispatch({ type: "RESET_FLOW" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartProductIds = state.items.map((i) => i.productId);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        increment,
        decrement,
        addBundle,
        setCountry,
        openDrawer,
        closeDrawer,
        openCheckout,
        closeCheckout,
        clearCart,
        resetFlow,
        totalItems,
        cartProductIds,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
