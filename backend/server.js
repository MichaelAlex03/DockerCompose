const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const logger = require('./config/logger');
const { v4: uuidv4 } = require('uuid');
const pinoHttp = require('pino-http');

const httpLogger = pinoHttp({ 
    logger,

    genReqId: (req, res) => {
        const existing = req.headers['x-request-id'];
        const id = existing || uuidv4();

        res.setHeader('X-Request-ID', id);
        return id;
    },

    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn'
        return 'info'
    }
 });

const {register, httpRequestsTotal, httpRequestDuration } = require('./config/metrics.js')
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

app.use(httpLogger)

app.use((req, res, next) => {
    
    const end = httpRequestDuration.startTimer()

    res.on('finish', () => {
        const route = req.route ? req.route.path: 'unmatched';
        const labels = {
            method: req.method,
            route: route,
            status: res.statusCode
        }

        httpRequestsTotal.inc(labels);
        end(labels)
    })

    next()

})


app.get('/healthCheck', (req, res) => {
    req.log.info('health check')
    res.sendStatus(200)

})

app.get('/hello', (req, res) => {
    req.log.info('hello')
    res.sendStatus(200)
})

app.post('/add', async (req, res) => {
    try {
        const result = await pool.query('SElECT NOW()')
        req.log.info('query success')
        res.json({ time: result.rows[0].now })
    } catch (error) {
        req.log.error({ error }, 'failed to query')
        return res.status(500).json(error)
    }

})

app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users')
        req.log.info('query success')
        res.status(200).json({ data: result.rows })
    } catch (error) {
        req.log.error({ error }, 'failed to query')
        return res.status(500).json(error)
    }
})

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    req.log.info('testtt')
    req.log.info('testtt3333')
    res.end(await register.metrics());
});

app.listen(8080, (req, res) => {
    logger.info('server started on 8080')
})
