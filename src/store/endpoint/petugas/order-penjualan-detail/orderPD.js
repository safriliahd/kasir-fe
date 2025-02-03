import API_URL from "../../../api/api";

// Create a new order
export const createOrder = async (orderData) => {
    try {
        const response = await API_URL.post('/petugas/createOrder', orderData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};


// Fetch all orders
export const fetchAllOrders = async () => {
    try {
        const response = await API_URL.get('/petugas/allOrders');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

// Delete an order by PenjualanID
export const deleteOrderByPenjualanID = async (penjualanID) => {
    try {
        const response = await API_URL.delete(`/petugas/deleteOrder/${penjualanID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting order: ' + error.message);
    }
};

// Fetch all penjualan
export const fetchAllPenjualan = async () => {
    try {
        const response = await API_URL.get('/petugas/allPenjualan');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching penjualan: ' + error.message);
    }
};

// Fetch penjualan by ID
export const fetchPenjualanById = async (penjualanID) => {
    try {
        const response = await API_URL.get(`/petugas/penjualan/${penjualanID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching penjualan by ID: ' + error.message);
    }
};

// Fetch detail penjualan by ID
export const fetchDetailPenjualanById = async (penjualanID) => {
    try {
        const response = await API_URL.get(`/petugas/detailPenjualan/${penjualanID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching detail penjualan by ID: ' + error.message);
    }
};
