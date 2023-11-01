const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./config');

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const IP_ADDRESS='192.168.0.106'
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running at http://${IP_ADDRESS}:${PORT}`);
  });
app.get('/', (req, res) => {
  res.send('Hello from Express Server');
});
app.get('/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).send('Internal Server Error');
    }
  });
