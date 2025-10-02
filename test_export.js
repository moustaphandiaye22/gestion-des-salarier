const axios = require('axios');

const API_BASE_URL = 'http://localhost:3015';

// Test export functionality
async function testExport() {
  try {
    console.log('Testing export functionality...');

    // First, login to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'admin@agrisolutions.com',
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('Login successful, got token');

    // Set authorization header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'arraybuffer' // For binary data
    };

    // Test payments export
    console.log('Testing payments export...');
    const paymentsResponse = await axios.get(`${API_BASE_URL}/api/paiements/export/excel`, config);
    console.log(`Payments export successful! Response size: ${paymentsResponse.data.length} bytes`);
    console.log(`Content-Type: ${paymentsResponse.headers['content-type']}`);

    // Test bulletins export
    console.log('Testing bulletins export...');
    const bulletinsResponse = await axios.get(`${API_BASE_URL}/api/bulletins/export/excel`, config);
    console.log(`Bulletins export successful! Response size: ${bulletinsResponse.data.length} bytes`);
    console.log(`Content-Type: ${bulletinsResponse.headers['content-type']}`);

    console.log('All export tests passed!');

  } catch (error) {
    console.error('Export test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testExport();
