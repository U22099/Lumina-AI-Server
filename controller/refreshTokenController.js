const jwt = require("jsonwebtoken");
const User = require("../model/User");
const mongoose = require("mongoose");

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.query.token;
  const _id = req.query._id
  if (!refreshToken || !_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });

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
