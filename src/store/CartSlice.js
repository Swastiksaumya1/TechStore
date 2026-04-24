import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
};

const CartSlice = createSlice ({
    name: 'cart',
    initialState,
    reducers: {
       loadCart: (state, action) => {
           state.items = action.payload || [];
       },
       addItem: (state, action) => {
    const existingItem = state.items.find(item => item.id === action.payload.id);
    
    if (existingItem) {
        // If it exists, just bump the number
        existingItem.quantity += 1;
    } else {
        // If it's new, add it with a quantity of 1
        state.items.push({ ...action.payload, quantity: 1 });
    }
},
        removeItem: (state , action ) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

        decreaseQuantity: (state, action) => {
    const existingItem = state.items.find(item => item.id === action.payload);
    
    if (existingItem) {
        if (existingItem.quantity > 1) {
            // If there is more than one, just decrease it
            existingItem.quantity -= 1;
        } else {
            // If there is only one left, remove it completely
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    }
},
        clearCart: (state) => {
            state.items = [];
        }
        
    }
})



export const {addItem , removeItem , clearCart, decreaseQuantity, loadCart} = CartSlice.actions;
export default CartSlice.reducer;