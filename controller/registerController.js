const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleNewUser = async (req, res) => {
    const { username, email, password, image } = req.body;

    if(!username || !email || !password) return res.status(401).json({"message": "Username, Email and Password must be provided"});

    const user = await User.findOne({$or: [{username: username}, {email: email}]});
    if(user) return res.status(409).json({"message": 'Username or Email already exists'})

    try {
        const hashedpwd = await bcrypt.hash(password, 10);

        
        const accessToken = jwt.sign(
            {'username' : username}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn : '10m'}
        );
        const refreshToken = jwt.sign(
            {'username' : username}, 
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn : '3d'}
        );
		const isAdmin = (["Daniel","Swag","Atijohan"].includes(username)) ? true : false;
        await User.create({
            'username': username,
            'email': email,
            'password': hashedpwd,
            'image': image,
			'isAdmin': isAdmin,
            'refreshToken': refreshToken,
            'accessToken': accessToken
        });

        //res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 3 * 24 * 60 * 60 * 1000});
        //res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'None', secure:true, maxAge: 10 * 60 * 1000});
        res.status(200).json({"token" : {
	"accessToken" : accessToken,
	"refreshToken" : refreshToken
}});
    } catch (error) {
        console.log(error);
        res.status(500).json({'message' : error.message})
    }
}

module.exports = {handleNewUser};
