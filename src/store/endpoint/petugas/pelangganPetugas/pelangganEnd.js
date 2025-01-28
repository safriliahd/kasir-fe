import API_URL from "../../../api/api";


export const fetchPelanggan = async () => {
  try {
    const response = await API_URL.get('/petugas/allPelanggan');
    return response.data.pelanggan;  
  } catch (error) {
    throw new Error('Error fetching pelanggan: ' + error.message);
  }
};


// Create pelanggan
export const createPelangganApi = async (NamaPelanggan, Alamat, NomorTelepon) => {
  try {
    const response = await API_URL.post('/petugas/createPelanggan', {
      NamaPelanggan,
      Alamat,
      NomorTelepon,
    });
    return response.data.pelanggan;
  } catch (error) {
    throw new Error('Error creating pelanggan: ' + error.message);
  }
};

// Delete pelanggan
export const deletePelanggan = async (pelangganId) => {
  try {
    const response = await API_URL.delete(`/petugas/deletePelanggan/${pelangganId}`);
    return response.data.message;
  } catch (error) {
    throw new Error('Error deleting pelanggan: ' + error.message);
  }
};

// Update pelanggan
export const editPelanggan = async (pelangganId, updatedData) => {
  try {
    const response = await API_URL.put(`/petugas/updatePelanggan/${pelangganId}`, updatedData);
    return response.data.pelanggan; 
  } catch (error) {
    throw new Error('Error updating pelanggan: ' + error.message);
  }
};
