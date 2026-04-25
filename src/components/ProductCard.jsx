import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/CartSlice";
import { toast } from "react-hot-toast";

function ProductCard({ product }) {
  const dispatch = useDispatch(); // You need to actually call the hook to get the dispatch function!

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <img
          className="max-w-full max-h-full object-contain shadow-sm"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex flex-col justify-between min-h-55 sm:min-h-45">
        <div>
          <h5
            className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1"
            title={product.title}
          >
            {product.title}
          </h5>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {product.author}
          </p>
          <p
            className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2"
            title={product.description}
          >
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => {
              dispatch(addItem(product));
              toast.success(`${product.title} added to cart!`);
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
