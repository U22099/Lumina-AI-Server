const allowedOrigins = [
    "https://u22099.github.io", 
    "http://localhost:5173",
    "https://2drl3r-5173.csb.app",
    "https://silver-space-fortnight-pj9gjvj4v6qf6p9-5173.app.github.dev"
];

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)||!origin){
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials
