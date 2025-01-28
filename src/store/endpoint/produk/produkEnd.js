import API_URL from "../../api/api";

// Fetch all produk
export const fetchProduk = async () => {
  try {
    const response = await API_URL.get('/admin/allProduk');
    return response.data; // Returns the fetched produk data
  } catch (error) {
    throw new Error('Error fetching produk: ' + error.message);
  }
};

// Fetch produk by ID
export const fetchProdukById = async (produkId) => {
  try {
    const response = await API_URL.get(`/admin/produk/${produkId}`);
    return response.data; // Returns the fetched produk data
  } catch (error) {
    throw new Error('Error fetching produk by ID: ' + error.message);
  }
};


// Create produk
export const createProdukApi = async (formData) => {
  try {
    const response = await API_URL.post('/admin/createProduk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // Returns the created produk data
  } catch (error) {
    console.error('Error creating produk:', error.response ? error.response.data : error.message);
    throw new Error('Error creating produk: ' + (error.response?.data?.message || error.message));
  }
};

  

// Update produk
export const editProduk = async (produkId, updatedData, FotoProduk) => {
  try {
    const formData = new FormData();
    formData.append('NamaProduk', updatedData.NamaProduk);
    formData.append('Harga', updatedData.Harga);
    formData.append('Stok', updatedData.Stok);

    if (FotoProduk) {
      formData.append('FotoProduk', FotoProduk);
    }

    const response = await API_URL.put(`/admin/updateProduk/${produkId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Returns the updated produk data
  } catch (error) {
    console.error('Error creating produk:', error.response || error.message);
    throw new Error('Error creating produk: ' + (error.response?.data?.message || error.message));
  }
  
};

// Delete produk
export const deleteProduk = async (produkId) => {
  try {
    const response = await API_URL.delete(`/admin/deleteProduk/${produkId}`);
    return response.data.message; // Returns success message
  } catch (error) {
    throw new Error('Error deleting produk: ' + error.message);
  }
};
