const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')

const app = express()

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

app.use(cors(corsOptions))

app.use(express.json())

app.get('/healthCheck', (req, res) => {
    console.log("health check")
    res.sendStatus(200)

})

app.get('/hello', (req, res) => {
    console.log('hello')
    res.sendStatus(200)
})

app.post('/add', async (req, res) => {
    try {
        const result = await pool.query('SElECT NOW()')
        res.json({ time: result.rows[0].now })
    } catch (error) {
        return res.status(500).json(error)
    }

})

app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users')
        res.status(200).json({ data: result.rows })
    } catch (error) {
        return res.status(500).json(error)
    }
})

app.listen(8080, (req, res) => {
    console.log('Listening on port 8080')
})
