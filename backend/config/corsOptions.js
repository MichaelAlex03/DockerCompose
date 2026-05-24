const allowedOrigins = [
    'http://ec2-98-81-133-119.compute-1.amazonaws.com:80'
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
