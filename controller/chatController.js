const User = require("../model/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getChats = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const history = user.chatHistory;
    res.json({ history });
  } else {
    res.status(401).json({ message: "Wrong Token" });
  }
};
const TextPrompt = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const { history, message } = req.body;
    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(message.parts);
    const response = await result.response;
    const text = response.text();
    user.chatHistory = [
      ...history,
      message,
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
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const { history, image, message } = req.body;
    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage([message, image]);
    const response = await result.response;
    const text = response.text();
    user.chatHistory = [
      ...history,
      {
        role: "user",
        parts: [{ image }, { text: message }],
      },
      {
        role: "model",
        parts: [{ text }],
      },
    ];
    await user.save();
    res.send(text);
  }
};

module.exports = { getChats, TextPrompt, ImagePrompt };
