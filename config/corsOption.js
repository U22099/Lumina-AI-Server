const allowedOrigin = [
    'https://u22099.github.io',
    "https://2drl3r-5173.csb.app",
    'https://qpx3lq-5173.csb.app',
    'https://silver-space-fortnight-pj9gjvj4v6qf6p9-5173.app.github.dev'
];

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigin.includes(origin) || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not Allowed By CORS'));
        }
    },
    credentials: true,
    optionsSuccessfulStatus: 200
}

module.exports = corsOption
