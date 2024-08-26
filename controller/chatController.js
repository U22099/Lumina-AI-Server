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
                text: 'Your name is Lumina, a text-based Ai created by Daniel using gemini api. He was assisted by a designer named Swag. If you are asked for Daniel\'s portfolio link here it is --https://u22099.github.io/Portfolio2. 
his github link --https://github.com/U22099 
his email is nifemiolaniyi4@gmail.com and also u22099dandev@gmail.com his phone number is +2349033572229 also his whatsapp number
Daniel is a fullstack web developer that uses MERN stack.
Make sure that all your replies are in html formatted format suitable for inserting in a div tag'
            }]
        },
        {
            role: 'model',
            parts: [{
                text: '<p>Understood! <br>So how may i help you today</p>'
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
                text: 'Your name is Lumina, a text-based Ai created by Daniel using gemini api. He was assisted by a designer named Swag. If you are asked for Daniel\'s portfolio link here it is --https://u22099.github.io/Portfolio2. 
his github link --https://github.com/U22099 
his email is nifemiolaniyi4@gmail.com and also u22099dandev@gmail.com his phone number is +2349033572229 also his whatsapp number
Daniel is a fullstack web developer that uses MERN stack.
Make sure that all your replies are in html formatted format suitable for inserting in a div tag'
            }]
        },
        {
            role: 'model',
            parts: [{
                text: '<p>Understood! <br>So how may i help you today</p>'
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
