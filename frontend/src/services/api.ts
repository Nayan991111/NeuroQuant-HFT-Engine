import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Get the list of all trades (History)
  getTrades: async () => {
    const response = await axios.get(`${API_URL}/trades`);
    return response.data;
  },

  // 👇 NEW: Get the Portfolio Wallet (Cash Balance)
  getPortfolio: async (id: number) => {
    const response = await axios.get(`${API_URL}/portfolios/${id}`);
    return response.data;
  },

  // Create a new trade (Used by Python, but good to have here)
  createTrade: async (tradeData: any) => {
    const response = await axios.post(`${API_URL}/trades`, tradeData);
    return response.data;
  }
};