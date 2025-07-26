import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { content, recipientId } = req.body;

    const message = new Message({
      senderId: req.user._id,
      recipientId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, recipientId } = req.query;
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
