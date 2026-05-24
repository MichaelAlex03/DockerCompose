const allowedOrigins = [
    '*'
]

const corsOptions = {
    origin: (origin, callback) => {
	console.log(origin)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessState: 200
}
 
module.exports = corsOptions
