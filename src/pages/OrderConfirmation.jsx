import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';
import { generateInvoice } from '../utils/invoiceGenerator';
import confetti from 'canvas-confetti';

function OrderConfirmation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            appwriteService.getOrder(id)
                .then(res => {
                    setOrder(res);
                    // CELEBRATION!
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#3b82f6', '#10b981', '#f59e0b']
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleDownload = () => {
        if (order && userData) {
            generateInvoice(order, userData);
        }
    };

    if (loading) return <div className="text-center py-20 dark:text-gray-300">Fastening the final bolts...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[70vh] flex flex-col justify-center items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full inline-flex mb-6 text-green-600 dark:text-green-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-6 w-full max-w-md mb-8 text-gray-900 dark:text-white">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-lg font-mono font-semibold">{id}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Invoice
                </button>
                <button 
                    onClick={() => navigate('/profile')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition"
                >
                    View History
                </button>
                <Link 
                    to="/"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg font-bold shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 outline outline-1 outline-gray-300 dark:outline-gray-600 transition text-center"
                >
                    Home
                </Link>
            </div>
        </div>
    );
}

export default OrderConfirmation;
