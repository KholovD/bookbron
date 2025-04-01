const axios = require('axios');

class EskizSMSService {
    constructor() {
        this.baseURL = 'https://notify.eskiz.uz/api';
        this.token = null;
    }

    async login() {
        try {
            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: process.env.ESKIZ_EMAIL,
                password: process.env.ESKIZ_PASSWORD
            });

            this.token = response.data.data.token;
            return this.token;
        } catch (error) {
            console.error('Eskiz login error:', error);
            throw new Error('SMS servisga ulanishda xatolik');
        }
    }

    async sendSMS(phone, message) {
        try {
            if (!this.token) {
                await this.login();
            }

            const response = await axios.post(`${this.baseURL}/message/sms/send`, {
                mobile_phone: phone.replace('+', ''),
                message: message,
                from: '4546'  // Eskiz bergan sender ID
            }, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('SMS sending error:', error);
            throw new Error('SMS yuborishda xatolik');
        }
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

module.exports = new EskizSMSService();
