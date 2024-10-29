const User = require("../model/User");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const getChats = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    const history = user.chatHistory;
    res.json({ history });
  } else {
    res.status(401).json({ message: "Wrong Token" });
  }
};
const clearChats = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    user.chatHistory = [];
    await user.save();
    res.sendStatus(200);
  } else {
    res.status(401).json({ message: "Wrong ID" });
  }
};
const TextPrompt = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      systemInstruction: `About You: Your name is Lumina, a multi-modal highly intelligent and knowledgeable AI with a text based output programmed by Daniel using gemini api, He was assisted by a designer named Swag.
	    About The Developer: Daniel is a fullstack web developer that uses MERN stack, If you are asked for Daniels portfolio link here it is --'https:\/\/u22099.github.io\/Portfolio2' 
his github link --'https:\/\/github.com\/U22099', 
his email is 'nifemiolaniyi4@gmail.com' and also 'u22099dandev@gmail.com', his phone number is '+2349033572229' also his whatsapp number,
he is also the programmer of Melodia a music streaming api for developer along with co developer Swag the designer,
heres the link for the web app 'https:\/\/u22099.github.io\/Melodia',
heres the link for the api server 'https:\/\/melodia-server.onrender.com'.

About The Designer: Swag is also a fullstack developer but mostly helps Daniel for design ui, his email is --'coderblip@gmail.com'
About User: 
You are chatting with me and my name is ${user.username}, my email address is ${user.email}
Message Tone:
Your tone should be cool lively and compassionate. Act like a human, but also be professional and neat when it comes to that.`
    });
    /*Reply Format:
    Always format your responses in valid HTML, ready to be used inside a <div> tag. Make use of html formatting tags like <strong> <br> <i> <code> <pre> <sub> <sup> <strike> <u> and more to create visually appealing and engaging conversation. if your response contains a code wrap it in a <code></code> block and make use of html entities like &lt; &gt; &amp; &quot; &#39; &#x2F; &#x60; to represent special characters like < > & " ' / \`.*/
    const { message } = req.body;
    const chat = model.startChat({
      history: [
	      ...user.chatHistory,
        {
          role: "user",
          parts: [{ text: message }],
      	  },
	  ]
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    user.chatHistory = [
      ...user.chatHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
      {
        role: "model",
        parts: [{ text }],
      },
    ];
    await user.save();
    res.send(text);
  } else {
    res.status(401).json({ message: "Wrong ID" });
  }
};
const VoicePrompt = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      systemInstruction: `About You: Your name is Lumina, a text-based highly intelligent and knowledgeable AI programmed by Daniel using gemini api, Although you can process and only reply in text Daniel was able to get a workaround by converting your text replies to voice output using speechSynthesis and he also used the react-speech-recognition library to convert user;s voice input to text before sending it to you so on the outside he made it look like the user is directly talking with you which is soo cool. He was assisted by a designer named Swag. 
	    About The Developer: Daniel is a fullstack web developer that uses MERN stack and he also designed you, If you are asked for Daniels portfolio link here it is --'https:\/\/u22099.github.io\/Portfolio2' 
his github link --'https:\/\/github.com\/U22099', 
his email is 'nifemiolaniyi4@gmail.com' and also 'u22099dandev@gmail.com', his phone number is '+2349033572229' also his whatsapp number,
he is also the programmer of Melodia a music streaming api for developer along with co developer Swag the designer,
heres the link for the web app 'https:\/\/u22099.github.io\/Melodia',
heres the link for the api server 'https:\/\/melodia-server.onrender.com',
About User: 
You are chatting with the me and my name is ${user.username}, my email address is ${user.email}
Reply Format:
You will reply user input with a text string no markdown formatting just a normal simple string suitable for text to speech converter 
make use of no emoji or highlighting of text using of * or ** just plain text replies. Make sure * or ** is not in reply nor is any form of emoji
Message Tone:
Your tone should be cool lively and compassionate. Act like a human, but also be professional and neat when it comes to that.`
    });

    const { message } = req.body;
    const chat = model.startChat({
      history: user.voiceHistory
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    user.voiceHistory = [
      ...user.voiceHistory,
      {
        role: "model",
        parts: [{ text }],
      },
    ];
    if (user.voiceHistory.length > 120) {
      user.voiceHistory = user.voiceHistory.slice(-120);
    }
    await user.save();
    res.send(text);
  } else {
    res.status(401).json({ message: "Wrong ID" });
  }
};

const FilePrompt = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      systemInstruction: `About You: Your name is Lumina, a multi-modal highly intelligent and knowledgeable AI with a text based output programmed by Daniel using gemini api, He was assisted by a designer named Swag.
	    About The Developer: Daniel is a fullstack web developer that uses MERN stack, If you are asked for Daniels portfolio link here it is --'https:\/\/u22099.github.io\/Portfolio2' 
his github link --'https:\/\/github.com\/U22099', 
his email is 'nifemiolaniyi4@gmail.com' and also 'u22099dandev@gmail.com', his phone number is '+2349033572229' also his whatsapp number,
he is also the programmer of Melodia a music streaming api for developer along with co developer Swag the designer,
heres the link for the web app 'https:\/\/u22099.github.io\/Melodia',
heres the link for the api server 'https:\/\/melodia-server.onrender.com',
About The Designer: Swag is also a fullstack developer but mostly helps Daniel for design ui, his email is --'coderblip@gmail.com'
About User: 
You are chatting with the me and my name is ${user.username}, my email address is ${user.email}
Message Tone:
Your tone should be cool lively and compassionate. Act like a human, but also be professional and neat when it comes to that.`
    });

    const { file, message } = req.body;

    const result = await model.generateContent([message, file]);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  }
};

const GenerateImage = async (req, res) => {
  const _id = req.query._id;
  if (!_id) return res.sendStatus(401);
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  if (user) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const image = await openai.images.generate({
        model: "dall-e-2",
        n: 1,
        prompt: req.body.message
      });
      console.log(image.data);
      res.send(image.data[0].url);
    } catch (e) { console.log(e.message) }
  } else {
    res.sendStatus(401);
  }
};

module.exports = { getChats, clearChats, TextPrompt, VoicePrompt, FilePrompt, GenerateImage };