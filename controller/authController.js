const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { input, password, rememberMe } = req.body;

  if (!input || !password){
    console.log("No Inputs");
    return res
      .status(403)
      .json({ message: "Username Or Email and Password is required" });
  }
  
  const user = await User.findOne({
    $or: [{ username: input }, { email: input }],
  });
  if (!user){
    console.log("User not found")
    return res.status(401).json({ message: "Username or Email not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    let refreshToken = '';
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    if (rememberMe) {
      refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      /*res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });*/
    }
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();
    /*res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });*/
    res.json({
      accessToken, 
      refreshToken,
      _id: user._id
    });
  } else {
    res.status(401).json({ message: "Incorrect Password" });
  }
};

module.exports = { handleLogin };
