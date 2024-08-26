const User = require("../model/User");

const getData = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    res.json({
      username: user.username,
      image: user.image
    });
  } else {
    res.sendStatus(403);
  }
};
const updateImage = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    user.image = req.body.image;
    await user.save();
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
};
const deleteUser = async (req, res) => {
  try {
    const accessToken = req.query.token;
    if (!accessToken) return res.sendStatus(401);
    await User.findOneAndDelete({ accessToken: accessToken });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
module.exports = { getData, updateImage, deleteUser };
