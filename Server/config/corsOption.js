const allowedOrigin = [
    'https://melodia-f4nd.onrender.com',
    'https://u22099.github.io',
    'http://localhost:5173',
    'https://n6kzfx-5173.csb.app',
    'https://qrdw9g-5173.csb.app',
    'https://z7mx74-5173.csb.app'
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
