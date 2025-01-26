import API_URL from "../../api/api";

export const fetchPelanggan = async () => {
  try {
    const response = await API_URL.get('/admin/allPelanggan');
    return response.data.pelanggan;  // Return the fetched pelanggan data
  } catch (error) {
    throw new Error('Error fetching pelanggan: ' + error.message);
  }
};


// Create pelanggan
export const createPelangganApi = async (NamaPelanggan, Alamat, NomorTelepon) => {
  try {
    const response = await API_URL.post('/admin/createPelanggan', {
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
    const response = await API_URL.delete(`/admin/deletePelanggan/${pelangganId}`);
    return response.data.message; // Returns success message
  } catch (error) {
    throw new Error('Error deleting pelanggan: ' + error.message);
  }
};

// Update pelanggan
export const editPelanggan = async (pelangganId, updatedData) => {
  try {
    const response = await API_URL.put(`/admin/updatePelanggan/${pelangganId}`, updatedData);
    return response.data.pelanggan; // Returns the updated pelanggan
  } catch (error) {
    throw new Error('Error updating pelanggan: ' + error.message);
  }
};
