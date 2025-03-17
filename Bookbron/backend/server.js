const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL ulanish
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Login API
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, captchaResponse } = req.body;

        // Captcha tekshirish
        const captchaVerified = await verifyCaptcha(captchaResponse);
        if (!captchaVerified) {
            return res.status(400).json({ message: 'Captcha tekshiruvi amalga oshmadi' });
        }

        // Foydalanuvchini bazadan tekshirish
        const [users] = await pool.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Email yoki parol noto\'g\'ri' });
        }

        // Parolni tekshirish
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email yoki parol noto\'g\'ri' });
        }

        // JWT token yaratish
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
    }
});

// Captcha tekshirish funksiyasi
async function verifyCaptcha(captchaResponse) {
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`,
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Captcha verification error:', error);
        return false;
    }
}

// Server porti
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
}); 