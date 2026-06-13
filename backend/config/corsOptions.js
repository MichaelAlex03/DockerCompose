const allowedOrigins = [
    'http://35.169.16.141'
]

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessState: 200
}
 
module.exports = corsOptions
