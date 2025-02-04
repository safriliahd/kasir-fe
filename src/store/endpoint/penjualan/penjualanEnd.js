import API_URL from "../../api/api";

// Fetch all orders
export const fetchAllOrders = async () => {
    try {
        const response = await API_URL.get('/admin/allOrders');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

// Delete an order by PenjualanID
export const deleteOrderByPenjualanID = async (penjualanID) => {
    try {
        const response = await API_URL.delete(`/admin/deleteOrder/${penjualanID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error deleting order: ' + error.message);
    }
};

// Fetch all penjualan
export const fetchAllPenjualanAPI = async () => {
    try {
        const response = await API_URL.get('/admin/allPenjualan');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching penjualan: ' + error.message);
    }
};

// Fetch penjualan by ID
export const fetchPenjualanById = async (penjualanID) => {
    try {
        const response = await API_URL.get(`/admin/penjualan/${penjualanID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching penjualan by ID: ' + error.message);
    }
};

// Fetch detail penjualan by ID
export const fetchDetailPenjualanById = async (penjualanID) => {
    try {
        const response = await API_URL.get(`/admin/detailPenjualan/${penjualanID}`, {
            params: { include: { produk: true } }  
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching detail penjualan by ID: ' + error.message);
    }
};
