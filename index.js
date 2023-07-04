const express = require('express');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./db/connection');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000 || process.env.PORT;
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
	console.log('Server running');
});
