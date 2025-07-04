import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js'; 



export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({ // ✅ fixed
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      newMessage,
    });
  } catch (error) {
    console.log("Send Message Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });

  } catch (error) {
    console.log("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};
