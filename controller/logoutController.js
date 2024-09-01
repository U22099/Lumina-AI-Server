const User = require("../model/User");

const logOut = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id });

  if (user) {
    user.refreshToken = "";
    user.accessToken = "";
    await user.save();
    /*res.cookie("refreshToken", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000,
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000,
    });*/
  }

  res.sendStatus(200);
};

module.exports = { logOut };
