// feedback.js api
import mysql from 'mysql2/promise';

async function connectToDatabase() {
  return await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rating, comments, email } = req.body;

    try {
      const pool = await connectToDatabase();
      const connection = await pool.getConnection();

      const currentDatetime = new Date();

      const datetime_recorded = currentDatetime.toISOString().slice(0, 19).replace('T', ' ');

      await connection.query(
        'INSERT INTO Feedback (datetime_recorded, rating, comment, email) VALUES (?, ?, ?, ?)',
        [datetime_recorded, rating, comments, email]
      );

      connection.release();

      res.status(200).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ error: 'An error occurred while submitting feedback.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}