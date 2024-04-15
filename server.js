const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();

app.use(express.json());

// Set up CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3001', 'https://joseph-x-geraldine.we-devsgh.online/'],
    credentials: true,
}));


// MongoDB connection
mongoose.connect(process.env.DB_ACCESS);

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});


db.once('open', () => {
    console.log('Connected to MongoDB');
});


const userSchema = require('./userschema');
const User = mongoose.model('gerixtrigrsvp', userSchema);


app.get('/dashboard', async (req, res) => {
    try {
        const allNames = await User.find({}, 'name');
        if (!allNames || allNames.length === 0) {
            console.log('No names found');
            return res.status(404).json({ error: 'No names found' });
        }

        const names = allNames.map(user => user.name);
        res.json(names);
    } catch (error) {
        console.error('Error during dashboard retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Server is running</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <h1>Server is running on port ${port}</h1>
            </body>
        </html>
    `);
});
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
