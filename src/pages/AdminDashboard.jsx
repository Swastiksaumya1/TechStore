import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { toast } from 'react-hot-toast';

function AdminDashboard() {
    const userData = useSelector(state => state.auth.userData);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // SECURITY: Hardcoded check to prevent non-admins from rendering
    const ADMIN_EMAIL = "swastik@techstore.com"; // User can change this to their real email

    useEffect(() => {
        // Kick them out if not admin
        if (!userData || userData.email !== ADMIN_EMAIL) {
            toast.error("Unauthorized access!");
            navigate("/");
            return;
        }

        fetchOrders();
    }, [userData, navigate]);

    const fetchOrders = () => {
        setLoading(true);
        appwriteService.getAllOrders()
            .then(response => {
                if (response && response.documents) {
                    setOrders(response.documents);
                }
            })
            .catch(err => {
                console.error("Could not fetch orders", err);
                toast.error("Failed to load global orders.");
            })
            .finally(() => setLoading(false));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const result = await appwriteService.updateOrder(orderId, { status: newStatus });
            if (result) {
                toast.success(`Order #${orderId} marked as ${newStatus}!`);
                fetchOrders(); // Refresh table
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error(error);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading Administrative Datacore...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Central Admin Dashboard</h1>
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {orders.length} Total Orders
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-4">Order ID</th>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4">Customer ID</th>
                                <th scope="col" className="px-6 py-4">Total</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">No orders placed yet.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.$id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900 dark:text-white">
                                            {order.$id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {order.userId}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                                            ₹{order.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider
                                                ${order.status === 'paid' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.$id, e.target.value)}
                                            >
                                                <option value="paid">Paid</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
