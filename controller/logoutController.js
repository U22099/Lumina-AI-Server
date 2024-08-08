const User = require('../model/User');
const logOut = async (req, res) => {
    const refreshToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if(!refreshToken) return res.sendStatus(401);
    const user = await User.findOne({ refreshToken: refreshToken });

    if(user){
        user.refreshToken = "";
        user.accessToken = "";
        await user.save();
    }
    //res.cookie('refreshToken', '', {
        //expires: new Date('1970-01-01'),
        //httpOnly: true, sameSite: 'None', secure: true
    //});
    //res.cookie('accessToken', '', {
        //expires: new Date('1970-01-01'),
        //httpOnly: true, sameSite: 'None', secure: true
    //});

    res.sendStatus(200);
}

module.exports = { logOut };
