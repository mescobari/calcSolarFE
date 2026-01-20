import axios from 'axios';

export const solarService = {
  calculate: async (data: any) => {
    const response = await axios.post('http://localhost:3000/api/solar/calculate', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },
};
