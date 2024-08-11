const allowedOrigin = [
    'https://u22099.github.io',
    'http://localhost:5173',
    'https://2drl3r-5173.csb.app'
];

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigin.includes(origin) || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not Allowed By CORS'));
        }
    },
    optionsSuccessfulStatus: 200
}

module.exports = corsOption
