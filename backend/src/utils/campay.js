
const axios = require('axios');

class CampayService {
  constructor() {
    this.baseURL = process.env.CAMPAY_BASE_URL || 'https://api.campay.net/api';
    this.apiKey = process.env.CAMPAY_API_KEY;
    this.username = process.env.CAMPAY_USERNAME;
    this.password = process.env.CAMPAY_PASSWORD;
  }

  async getAccessToken() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        username: this.username,
        password: this.password
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Campay access token:', error);
      throw error;
    }
  }

  async initiatePayment(paymentData) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseURL}/collect`,
        {
          amount: paymentData.amount,
          currency: paymentData.currency || 'XAF',
          from: paymentData.phoneNumber,
          description: paymentData.description,
          external_reference: paymentData.orderId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating Campay payment:', error);
      throw error;
    }
  }

  async checkPaymentStatus(reference) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  async disbursePayout(payoutData) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseURL}/disburse`,
        {
          amount: payoutData.amount,
          currency: payoutData.currency || 'XAF',
          to: payoutData.phoneNumber,
          description: payoutData.description,
          external_reference: payoutData.payoutId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error disbursing payout:', error);
      throw error;
    }
  }
}

module.exports = new CampayService();
