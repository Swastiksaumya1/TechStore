import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.freeapi.app/api/v1', // The "Root" address
    timeout: 10000, // If the server takes > 10s, kill the request
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default axiosInstance;