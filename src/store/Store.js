import { configureStore } from '@reduxjs/toolkit'
import CartReducer from './CartSlice'
import authReducer from './authSlice' // 1. Import our new Slice!

export const store = configureStore({
    reducer: {
        cart: CartReducer,
        auth: authReducer, // 2. Tell the brain about the Auth Slice!
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

// This spies on the store. ANY time Redux changes, it runs this code!
store.subscribe(() => {
    const state = store.getState();
    const currentCart = state.cart;
    const authState = state.auth;
    
    // Determine where to save based on login status
    const storageKey = authState.status && authState.userData 
        ? `bookstore_cart_${authState.userData.$id}`
        : "bookstore_cart_guest";
        
    localStorage.setItem(storageKey, JSON.stringify(currentCart));
});
