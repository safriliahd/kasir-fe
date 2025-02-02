import API_URL from "../../../api/api";

// Fetch all produk
export const fetchProduk = async () => {
    try {
        const response = await API_URL.get('/petugas/allProduk');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching produk: ' + error.message);
    }
};

// Fetch produk by ID
export const fetchProdukById = async (produkId) => {
    try {
        const response = await API_URL.get(`/petugas/produk/${produkId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching produk by ID: ' + error.message);
    }
};