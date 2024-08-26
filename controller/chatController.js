const User = require("../model/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getChats = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const history = user.chatHistory;
    res.json({ history });
  } else {
    res.status(401).json({ message: "Wrong Token" });
  }
};
const clearChats = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    user.chatHistory = [];
	 await user.save();
    res.sendStatus(200);
  } else {
    res.status(401).json({ message: "Wrong Token" });
  }
};
const TextPrompt = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const { history, message } = req.body;
    const chat = model.startChat({
      history: [
		{
            role: 'user',
            parts: [{
                text: 'Your name is Lumina, a text-based Ai created by Daniel using gemini api. If you are asked for his my portfolio link here it is --https://u22099.github.io/Portfolio2. Daniel is a fullstack web developer that uses MERN stack'
            }]
        },
        {
            role: 'model',
            parts: [{
                text: 'Understood! so how may i help you today'
            }]
        },
		...history
	],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    user.chatHistory = [
      ...history,
      {
        role: "model",
        parts: [{ text }],
      },
    ];
    await user.save();
    res.send(text);
  } else {
    res.status(401).json({ message: "Wrong Token" });
  }
};

const ImagePrompt = async (req, res) => {
  const accessToken = req.query.token;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const { history, image, message } = req.body;
    const chat = model.startChat({
      history: [
		{
            role: 'user',
            parts: [{
                text: 'Your name is Lumina, a text-based Ai created by Daniel using gemini api.'
            }]
        },
        {
            role: 'model',
            parts: [{
                text: 'Understood! so how may i help you today'
            }]
        },
		...history
	],
    });

    const result = await chat.sendMessage([message, image]);
    const response = await result.response;
    const text = response.text();
    user.chatHistory = [
      ...history,
      {
        role: "model",
        parts: [{ text }],
      },
    ];
    await user.save();
    res.send(text);
  }
};

module.exports = { getChats, clearChats, TextPrompt, ImagePrompt };
