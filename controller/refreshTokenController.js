const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.query.token;
  if (!refreshToken) return res.sendStatus(401);
  const user = await User.findOne({ refreshToken });

  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || (user.username !== decoded.username)) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      user.accessToken = accessToken;
      await user.save();
      /*res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });*/
      res.json({token: accessToken});
    }
  );
};

module.exports = { handleRefreshToken };
