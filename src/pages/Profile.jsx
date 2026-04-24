import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { generateInvoice } from '../utils/invoiceGenerator';
import SkeletonLoader from '../components/SkeletonLoader';

function Profile() {
    const userData = useSelector(state => state.auth.userData);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            appwriteService.getUserOrders(userData.$id)
                .then(response => {
                    if (response && response.documents) {
                        setOrders(response.documents);
                    }
                })
                .catch(err => console.error("Could not fetch orders", err))
                .finally(() => setLoading(false));
        }
    }, [userData]);

    if (!userData) {
        return <div className="text-center py-20 text-gray-500">Loading profile data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-gray-900 dark:text-white">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Full Name</p>
                        <p className="text-lg font-medium">{userData.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Email Address</p>
                        <p className="text-lg font-medium">{userData.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Account ID</p>
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {"•".repeat(userData.$id.length - 5)}{userData.$id.slice(-5)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Joined On</p>
                        <p className="text-lg">{new Date(userData.registration).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order History</h2>
            
            {loading ? (
                <div className="space-y-6">
                    <SkeletonLoader count={3} height="h-32" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't placed any orders yet.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => {
                        // Safely parse the JSON string of items we saved during checkout!
                        let parsedItems = [];
                        let paymentMethod = "Credit / Debit Card"; // Default for old orders
                        try {
                            const parsed = JSON.parse(order.item || "[]");
                            if (Array.isArray(parsed)) {
                                parsedItems = parsed;
                            } else {
                                parsedItems = parsed.products || [];
                                paymentMethod = parsed.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card';
                            }
                        } catch(e) {
                            console.error("Failed to parse order items", e);
                        }
                        
                        return (
                            <div key={order.$id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden text-gray-900 dark:text-white mb-6">
                                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700 flex-wrap gap-4">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order Placed</p>
                                        <p className="font-medium">{new Date(order.date).toLocaleString()}</p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                                        <p className="font-medium text-green-600 dark:text-green-500">₹{order.total}</p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <p className="font-medium capitalize text-blue-600 dark:text-blue-400">{order.status}</p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">{paymentMethod}</p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">#{order.$id}</p>
                                    </div>
                                    <button 
                                        onClick={() => generateInvoice(order, userData)}
                                        className="mt-2 sm:mt-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1 transition"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        Invoice
                                    </button>
                                </div>
                                
                                <div className="px-6 py-4">
                                    <h3 className="font-semibold mb-3">Items ({parsedItems.length})</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {parsedItems.map(item => (
                                            <div key={item.id} className="flex items-center space-x-4 border border-gray-100 dark:border-gray-700 p-2 rounded">
                                                <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                                                <div>
                                                    <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price} &times; {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Profile;
