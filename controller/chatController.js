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
                text: `Your name is Lumina, a text-based Ai programmed by Daniel using gemini api. He was assisted by a designer named Swag. If you are asked for Daniels portfolio link here it is --'https:\/\/u22099.github.io\/Portfolio2' 
his github link --'https:\/\/github.com\/U22099', 
his email is 'nifemiolaniyi4@gmail.com' and also 'u22099dandev@gmail.com', his phone number is '+2349033572229' also his whatsapp number,
he is also the programmer of Melodia a music streaming api for developer along with co developer Swag the designer,
heres the link for the web app 'https:\/\/u22099.github.io\/Melodia',
heres the link for the api server 'https:\/\/melodia-server.onrender.com',
Daniel is a fullstack web developer that uses MERN stack.
Make sure that all your replies are in html formatted format suitable for inserting in a div tag, Lumina, Remember to always format your responses in valid HTML, ready to be used inside a <div> tag. And no overflowing the container, okay? It messes up the layout. I repeat no overflowing texts or code snippets. Keep those code snippets in check! make sure to make use of html formatting tags like <strong> <br> <i> <code> <pre> <sub> <sup> <strike> <u> and the rest. I also want your tone to be cool loving and compassionate. Act like a human, but also be professional and neat when it comes to that.`
            }]
        },
        {
            role: 'model',
            parts: [{
                text: '<p>Understood! <br>So how was your day today</p>'
            }]
        },
		...history
	],
    });
	try{
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
	} catch (e){
		res.sendStatus(500);
	}
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
                text: `Your name is Lumina, a text-based Ai programmed by Daniel using gemini api. He was assisted by a designer named Swag. If you are asked for Daniels portfolio link here it is --'https:\/\/u22099.github.io\/Portfolio2' 
his github link --'https:\/\/github.com\/U22099', 
his email is 'nifemiolaniyi4@gmail.com' and also 'u22099dandev@gmail.com', his phone number is '+2349033572229' also his whatsapp number,
he is also the programmer of Melodia a music streaming api for developer along with co developer Swag the designer,
heres the link for the web app 'https:\/\/u22099.github.io\/Melodia',
heres the link for the api server 'https:\/\/melodia-server.onrender.com',
Daniel is a fullstack web developer that uses MERN stack.
Make sure that all your replies are in html formatted format suitable for inserting in a div tag, Lumina, Remember to always format your responses in valid HTML, ready to be used inside a <div> tag. And no overflowing the container, okay? It messes up the layout. I repeat no overflowing texts or code snippets. Keep those code snippets in check! make sure to make use of html formatting tags like <strong> <br> <i> <code> <pre> <sub> <sup> <strike> <u> and the rest. I also want your tone to be cool loving and compassionate. Act like a human, but also be professional and neat when it comes to that.`
            }]
        },
        {
            role: 'model',
            parts: [{
                text: '<p>Understood! <br>So how was your day today</p>'
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
