import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios'; // Import our API tool

function DailyQuote() {
    // 1. Create a state for our quote and our loading status
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 2. Fetch the quote!
        axiosInstance.get('/public/quotes/quote/random')
            .then((response) => {
                // 3. Normalize the data (clean it up!)
                // The API gives us response.data.data which holds the messy quote info.
                const messyQuoteData = response.data.data;
                const cleanQuote = {
                    text: messyQuoteData.content,
                    author: messyQuoteData.author
                };
                
                setQuote(cleanQuote); // Save our perfect object to state
                setLoading(false); // 4. Turn off loading!
            })
            .catch((error) => {
                console.error("Failed to fetch quote:", error);
                setLoading(false); // Make sure we turn off loading even if there's an error
            });
    }, []); // <-- Empty array means this runs ONCE when the component loads.

    // 5. If loading is true, show our loading message
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center mb-8">
                <p className="text-gray-500 italic">"Fetching wisdom..."</p>
            </div>
        );
    }

    // 6. Display the actual quote
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl italic font-medium text-gray-800">
                "{quote?.text}"
            </h2>
            <p className="mt-4 text-gray-500 font-semibold">
                — {quote?.author}
            </p>
        </div>
    );
}

export default DailyQuote;