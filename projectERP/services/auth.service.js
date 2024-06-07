import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTP } from './otp.service.js';
import pool from '../config/db.js';

const signup = async ({ login, password }) => {
    const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'INSERT INTO users (login, password, otp, otp_expires) VALUES ($1, $2, $3, $4)',
      [login, hashedPassword, otp, otpExpires]
    );

    await sendOTP(login, otp);
    return { message: 'User created, OTP send to email' };
};

const verifyOtp = async (req) => {
  const { login, otp } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    const user = userResult.rows[0];

    if (!user || user.otp !== otp || user.otp_expires < new Date()) {
      return { message: 'Invalid or expired OTP' };
    }

    await pool.query('UPDATE users SET otp = NULL, otp_expires = NULL WHERE id = $1', [user.id]);

    const payload = { user: { id: user.id } };
    const accessToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, 'your_jwt_refresh_secret', { expiresIn: '7d' });
    return {accessToken, refreshToken}
}

const signin = async ({ login, password }) => {
  const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
  const user = userResult.rows[0];

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query('UPDATE users SET otp = $1, otp_expires = $2 WHERE id = $3', [otp, otpExpires, user.id]);

  await sendOTP(user.login, otp);
  return {message: "OTP sent to email"}
};

export default {
    signup,
    signin,
    verifyOtp
}