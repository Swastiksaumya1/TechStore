import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, clearCart, decreaseQuantity ,addItem} from '../store/CartSlice'
import { useNavigate } from 'react-router-dom';

function Cart() {
    const cart = useSelector(state => state.cart);
    const authStatus = useSelector(state => state.auth.status); // BIG FIX
    const userData = useSelector(state => state.auth.userData); // Fetch custom user data!
    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    // Bonus feature: Calculate the total price automatically!
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!userData || cart.items.length === 0) return;
        
        // 1. Create the new Order Object
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cart.items,
            total: total.toFixed(2)
        };

        // 2. Fetch existing history from LocalStorage mimicking a database
        const storageKey = `orders_${userData.$id}`;
        const existingOrders = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // 3. Save it back!
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));

        // 4. Clear the Redux Cart
        dispatch(clearCart());

        // 5. Send them magically to their new Profile to see the receipt!
        navigate('/profile');
    };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
        
        {cart.items.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-300 text-xl">Your cart is lonely! Go back to Home to add books!</p>
                  {/* Notice the () => added to the onClick! */}
                        <button 
                            onClick={() => navigate("/")}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Shop Now
                        </button>

            </div>
            
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-4">
                       
                       {/* image , title , price , quantity , + , - */}
                                <div className="flex items-center space-x-6">
                              <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-24 object-cover rounded shadow-sm"
                            
                />


                {/* The Quantity Controls */}
<div className="flex items-center space-x-4 mt-2">
    <span className="text-gray-500 dark:text-gray-400">Qty:</span>
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
        
        {/* The Minus Button */}
        <button 
            onClick={() => dispatch(decreaseQuantity(item.id))} 
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
        >
            -
        </button>

        {/* The Number */}
        <span className="px-4 py-1 font-semibold text-gray-800 dark:text-gray-200 border-l border-r border-gray-300 dark:border-gray-600">
            {item.quantity}
        </span>

        {/* The Plus Button */}
        <button 
            onClick={() => dispatch(addItem(item))} 
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
        >
            +
        </button>
        
    </div>
</div>

                
                {/* Wrap your text in this extra div! */}
                <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-gray-500 dark:text-gray-400"> ₹{item.price}</p>
                    <p className='text-gray-500 dark:text-gray-400'>Quantity: {item.quantity}</p>
                </div>
            </div>

                        {/* The Remove Button MUST be inside the map() loop, otherwise it doesn't know who "item" is! */}
                        <button 
                            onClick={() => dispatch(removeItem(item.id))}
                            className="text-red-500 hover:text-red-700 font-medium px-4 py-2"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                
                {/* The "Clear Cart" and Total Section */}
                <div className="mt-8 flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">Total:  ₹{total.toFixed(2)}</span>
                        <button 
                            onClick={() => dispatch(clearCart())}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium outline outline-red-200 outline-1"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* GATEKEEPER CHECKOUT BUTTON */}
                    {authStatus ? (
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold shadow-md transition-colors"
                        >
                            Proceed to Pay
                        </button>
                    ) : (
                        <button disabled className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-bold cursor-not-allowed">
                            Login to Checkout
                        </button>
                    )}
                </div>
            </div>
        )}
    </div>
  )
}

export default Cart;