const promClient = require('prom-client')

const register = new promClient.Registry()

promClient.collectDefaultMetrics({ register })

const httpRequestsTotal = new promClient.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status'],
	registers: [register]
})

const httpRequestDuration = new promClient.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'route', 'status'],
	buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
	registers: [register],
})

module.exports = {
	register,
	httpRequestsTotal,
	httpRequestDuration
}
