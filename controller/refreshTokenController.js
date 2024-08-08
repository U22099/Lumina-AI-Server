const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if(!refreshToken) return res.sendStatus(401);
    const user = await User.findOne({ refreshToken: refreshToken });

    if(!user) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err || (user.username !== decoded.username)) return res.redirect('/');
            const accessToken = jwt.sign(
                {'username': user.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '10m'}
            );
            user.accessToken = accessToken;
            user.markModified('accessToken');
            await user.save();
            //res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 10 * 60 * 1000 });
            res.status(200).json({
	"accessToken" : accessToken});
        }
    )
}

module.exports = {handleRefreshToken};
