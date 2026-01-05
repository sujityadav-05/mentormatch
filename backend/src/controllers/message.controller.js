import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Connection from "../models/connection.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch users connected with the logged-in user
    const connections = await Connection.find({
      $or: [{ mentor: loggedInUserId }, { mentee: loggedInUserId }],
      status: "accepted"
    }).populate("mentor mentee", "-password");

    // Extract the user details of connected mentors/mentees
    const filteredUsers = connections.map(conn =>
      conn.mentor._id.toString() === loggedInUserId.toString() ? conn.mentee : conn.mentor
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    console.log(req.params);
    const { receiverId } = req.params;
    
    const myId = req.user._id;

    console.log("Authenticated User ID:", myId);
    console.log("Requested Receiver ID:", receiverId);

    // Check if sender and receiver are connected
    const connection = await Connection.findOne({
      $or: [
        { mentor: myId, mentee: receiverId, status: "accepted" },
        { mentor: receiverId, mentee: myId, status: "accepted" }
      ]
    });

    if (!connection) {
      return res.status(403).json({ message: "You can only view messages of connected mentors/mentees." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });

    // Mark received messages as read
    await Message.updateMany(
      {
        $or: [
          { senderId: receiverId, receiverId: myId, isRead: false },
        ],
      },
      { isRead: true, status: "read" }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Check if a valid mentor-mentee connection exists
    const connection = await Connection.findOne({
      $or: [
        { mentor: senderId, mentee: receiverId },
        { mentor: receiverId, mentee: senderId },
      ],
      status: "accepted", // Ensure the connection is accepted
    });

    if (!connection) {
      return res.status(403).json({ error: "You are not connected with this user" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      connectionId: connection._id, // Link the message to the connection
      status: "sent",
      isRead: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Update message status to delivered
      await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Notify sender that message was read via Socket.io
    const senderSocketId = getReceiverSocketId(message.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", { messageId, status: "read" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in markMessageAsRead:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { query } = req.query;
    const senderId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      text: { $regex: query, $options: "i" },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in searchMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};