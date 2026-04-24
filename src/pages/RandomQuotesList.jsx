import React, { useState, useEffect } from 'react'
import axiosInstance from '../api/axios';

function RandomQuotesList() {

    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all(
            Array.from({length : 5 }).map(() =>
                axiosInstance.get('/public/quotes/quote/random')
            )
        )
        .then(response => {
            const normalized = response.map((res, index) => ({
                id: index,
                text: res.data.data.content,
                author: res.data.data.author || "Unknown"
                
            }));
            
            setQuotes(normalized);
            setLoading(false);
            
        })
        
        .catch(err => {
            console.error("Failed to fetch quotes", err);
            setLoading(false);
        })
       
    }, []);
    

    if(loading) return<p>Loading quotes...</p>
    if(quotes.length === 0) return <p>No quotes found.</p>

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>

        {quotes.map(q => (
            <div key={q.id} className='bg-white p-4 rounded-lg shadow-sm'>
                <p className='text-gray-800 italic'>"{q.text}"</p>
                <p className='text-gray-500 font-semibold mt-2'>— {q.author}</p>
            </div>
        ))}
       
        
       
    </div>
  )
}

export default RandomQuotesList