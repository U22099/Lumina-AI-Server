const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { input, password, rememberMe } = req.body;

  if (!input || !password)
    return res
      .status(403)
      .json({ message: "Username Or Email and Password is required" });

  const user = await User.findOne({
    $or: [{ username: input }, { email: input }],
  });
  if (!user)
    return res.status(401).json({ message: "Username or Email not found" });

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    let refreshToken;
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );
    if (rememberMe) {
      refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1w" }
      );

      user.refreshToken = refreshToken;
      user.accessToken = accessToken;
      user.markModified(["refreshToken", "accessToken"]);
      await user.save();
    }
    user.accessToken = accessToken;
    user.markModified("accessToken");
    await user.save();
    res.status(200).json({
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } else {
    res.status(401).json({ message: "Incorrect Password" });
  }
};

module.exports = { handleLogin };
