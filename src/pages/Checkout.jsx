import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { clearCart } from '../store/CartSlice';
import { toast } from 'react-hot-toast';

function Checkout() {
    const cart = useSelector(state => state.cart);
    const userData = useSelector(state => state.auth.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        address: '',
        city: '',
        zipcode: '',
        paymentMethod: 'credit_card'
    });

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.items.length === 0 && !loading) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty!</h2>
                <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Go Shopping</button>
            </div>
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // ENHANCED VALIDATION
        if (formData.address.length < 10) {
            setError("Please provide a more detailed street address.");
            setLoading(false);
            return;
        }

        if (!/^\d{5,6}$/.test(formData.zipcode)) {
            setError("Invalid ZIP code. Please enter 5 or 6 digits.");
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                userId: userData.$id,
                item: { products: cart.items, paymentMethod: formData.paymentMethod }, // Wrapped to include payment method
                total: total.toFixed(2),
                date: new Date().toISOString(),
                status: 'paid' // Mock status
            };

            const response = await appwriteService.createOrder(orderData);
            
            if (response) {
                // Clear the explicit Redux Cart
                dispatch(clearCart());
                toast.success("Order Placed Successfully!");
                // Navigate to successful order page!
                navigate(`/order-confirmation/${response.$id}`);
            }
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Form */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Shipping Information</h2>
                        
                        {error && <p className="text-red-500 mb-4 bg-red-50 dark:bg-red-900/30 p-3 rounded">{error}</p>}

                        <form onSubmit={handlePlaceOrder} className="space-y-4 text-gray-900 dark:text-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.zipcode}
                                        onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
                                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="credit_card"
                                        checked={formData.paymentMethod === 'credit_card'}
                                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                        className="text-blue-600 focus:ring-blue-500 dark:bg-gray-800 h-4 w-4"
                                    />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Credit / Debit Card (Mock)</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                        className="text-blue-600 focus:ring-blue-500 dark:bg-gray-800 h-4 w-4"
                                    />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full mt-8 text-white px-8 py-4 rounded-lg font-bold shadow-md transition-colors text-lg ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? 'Processing Order...' : `Pay ₹${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right side: Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 sticky top-24 text-gray-900 dark:text-white">
                        <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold px-2 py-1 rounded-md text-xs">
                                            {item.quantity}x
                                        </div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 flex-1">{item.title}</p>
                                    </div>
                                    <p className="font-semibold text-gray-600 dark:text-gray-300 ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{(total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="text-green-600 dark:text-green-400">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>₹{(total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
