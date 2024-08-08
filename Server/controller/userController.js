const User = require("../model/User");
const Music = require("../model/Music");

const getData = async (req, res) => {
  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
    });
  } else {
    res.sendStatus(403);
  }
};

const updateData = async (req, res) => {
  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newImage = req.body.image;

  const userConflict = await User.findOne({
    $or: [{ username: newUsername }, { email: newEmail }],
  });
  if (userConflict && userConflict.username != user.username)
    return res
      .status(409)
      .json({ message: "Username or Email already exists" });
  if (user && newUsername && newEmail && newImage) {
    user.username = newUsername;
    user.email = newEmail;
    user.image = newImage;

    user.save();
    res.json({ message: "successful" });
  } else {
    res.json({ message: "Empty Inputs Or Unauthorised User" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const accessToken =
      req.headers.Authorization?.split(" ")[1] ||
      req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.sendStatus(401);
    await User.findOneAndDelete({ accessToken: accessToken });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

const getUsersData = async (req, res) => {
  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });

  if (user && user.isAdmin) {
    const data = (await User.find({}, "image username email")).sort((a, b) =>
      a.username.localeCompare(b.username)
    );
    let chunkNo = req.query.chunkNo;
    let chunkAmount = 0;
    if (data.length % 10 === 0) {
      chunkAmount = data.length / 10;
    } else {
      chunkAmount = Math.floor(data.length / 10) + 1;
    }
    const x = (chunkNo > 1 ? 1 : 0) + (chunkNo - 1) * 10;
    const chunk = data.slice(x, x + 10);
    const no = await Music.countDocuments();
    res.json({
      users: { chunk: chunk, chunkAmount: chunkAmount },
      musicCount: no,
    });
  } else {
    res.sendStatus(403);
  }
};

const getDevs = async (req, res) => {
  const admin = await User.find({ isAdmin: true }, "username email image role");

  res.json({ admin: admin });
};
module.exports = { getData, updateData, deleteUser, getUsersData, getDevs };
