const Music = require("../../model/Music");
const User = require("../../model/User");

const getMusics = async (req, res) => {
  const music = await Music.find({}, "artist title image genre uploader");

  res.json({ music: music });
};

const getTopSixMusics = async (req, res) => {
  const music = await Music.find(
    {},
    "artist title image genre uploader clicks"
  );

  music.sort((a, b) => b.clicks - a.clicks);
  const data = music.slice(0, 6);
  res.json({ music: data });
};
const getRecentlyUploaded = async (req, res) => {
  const data = await Music.find({},  "artist title image genre uploader date")
 const music = data.slice(-6);
  res.json({ music: music });
};

const addMusic = async (req, res) => {
  const data = req.body;

  if (data.length != 0) {
    data.forEach(async (x) => {
      if (!(await Music.findOne({ title: x.title }))) {
        await Music.create({
          artist: x.artist,
          title: x.title,
          image: x.image,
          genre: x.genre,
          data: x.data,
          uploader: x.uploader,
        });
        res.json({ message: `Uploaded successfully by ${data[0].uploader}` });
      } else {
        res.json({ message: `Duplicate found! }` });
      }
    });
  } else {
    res.json({ message: "No Data Received" });
  }
};
const getMusicById = async (req, res) => {
  const _id = req.body._id;
  const music = await Music.findOne({ _id: _id }, "data clicks");

  music.clicks = music.clicks + 1;
  await music.save();
  res.json({ music: music });
};
const deleteMusicById = async (req, res) => {
  try {
    const _id = req.body._id;
    await Music.findOneAndDelete({ _id: _id });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete Music" });
  }
};

module.exports = {
  getMusics,
  addMusic,
  getMusicById,
  deleteMusicById,
  getTopSixMusics,
  getRecentlyUploaded,
};
