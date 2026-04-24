import { useEffect, useState } from 'react';
import { productService } from '../api/product.service';
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader';
import { useSearchParams } from 'react-router-dom';


function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get('query') || ""; 

    const categories = ["All", "Programming", "Agile", "Development"];

    useEffect(() => {
        setLoading(true);
        productService.getAllProducts().then((response) => {
            if (response && response.data) {
                const rawData = response.data.data || response.data.products || [];
                
                // Data Normalization (Senior Insight)
                const normalizedProducts = rawData.map(item => ({
                    id: item.id || item._id || Math.random(),
                    title: item.volumeInfo?.title || item.title || "Unknown Book",
                    author: item.volumeInfo?.authors?.[0] || item.author || "Unknown Author",
                    price: item.saleInfo?.listPrice?.amount || item.price || 29.99,
                    image: item.volumeInfo?.imageLinks?.thumbnail || item.image || "https://via.placeholder.com/150",
                    description: item.volumeInfo?.description || item.description || "No description available."
                }));
                
                setProducts(normalizedProducts);
            } else {
                console.log("Response was empty or failed.");
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse mb-8 rounded"></div>
                <div className="flex space-x-4 mb-8">
                    <SkeletonLoader count={4} height="h-10" className="w-24 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <SkeletonLoader count={8} height="h-80" />
                </div>
            </div>
        );
    }

   


    return (
    <div className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Our Book Collection ({products.length})
            </h1>
            

{/* REUSABLE CATEGORY TABS */}
<div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
    {categories.map((cat) => (
        <button 
            key={cat}
            onClick={() => {
                if (cat === "All") {
                    setSearchParams({}); // Clear the URL search
                } else {
                    setSearchParams({ query: cat }); // Instantly update the search!
                }
            }}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                (cat === "All" && query === "") || query.toLowerCase() === cat.toLowerCase()
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
        >
            {cat}
        </button>
    ))}
</div>

{/* The Responsive Grid */}


            {/* The Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products
                    .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
                    .map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))
                }
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-xl">No books found. Check your connection.</p>
                </div>
            )}

        </div>
    </div>
    );
}

export default Home;