import axiosInstance from "./axios";

export const productService = {
    getAllProducts: async (page = 1, limit = 150) => {
        try {
            // We are using the BOOKS endpoint because it's more stable
            const response = await axiosInstance.get(`/public/books?page=${page}&limit=${limit}`);
            
            // LOG THE RAW RESPONSE HERE TO SEE THE STRUCTURE
            console.log("RAW AXIOS RESPONSE:", response.data); 
            
            // Return the whole object so we can inspect it in Home.jsx
            return response.data; 
        } catch (error) {
            console.error("API Error:", error.message);
            return null;
        }
    }
};