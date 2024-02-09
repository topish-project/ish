const ChatRoom = require("../models/chatRoom");
const Users = require("../models/users");
const Message = require("../models/message");
const { handleResponse } = require("../utils/handleResponse");


class MessagesCTRL {
    // Route for retrieving all chat rooms with additional information
    async getAllChatRooms(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            // Retrieve all chat rooms where the current user is a participant
            const chatRooms = await ChatRoom.find({ users: req.user._id });

            // Fetch additional information for each chat room
            const chatRoomsWithInfo = await Promise.all(
                chatRooms.map(async (chatRoom) => {
                    // Find the other user's ID in the chat room (not the current user)
                    const otherUserId = chatRoom.users.find(
                        (userId) => userId.toString() !== req.user._id.toString()
                    );

                    // Find the other user's information (e.g., name and avatar)
                    const otherUser = await Users.findById(otherUserId);

                    // Find the last message in the chat room
                    const lastMessage = await Message.findOne({
                        chatRoom: chatRoom._id,
                    })
                        .sort({ timestamp: -1 }) // Sort by descending createdAt
                        .populate("sender")
                        .exec();

                    // Create an object with the desired information
                    const chatRoomInfo = {
                        _id: chatRoom._id,
                        otherUser: {
                            _id: otherUser._id,
                            fullName: otherUser.fullName,
                            avatar: otherUser.avatar,
                        },
                        lastMessage: lastMessage ? lastMessage.text : null,
                        lastMessageTime: lastMessage ? lastMessage.timestamp : null,
                    };

                    return chatRoomInfo;
                })
            );

            return handleResponse(res, 200, 'success', 'Chat rooms retrieved successfully', {
                chatRooms: chatRoomsWithInfo
            }, chatRoomsWithInfo.length);
        } catch (error) {
            console.error("Error in getAllChatRooms function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    async deleteChatRoom(req, res, io) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const chatRoomId = req.params.chatRoomId;

            // Fetch all messages for the chat room
            const messages = await Message.find({ chatRoomId });

            // Mark all messages as deleted and save them to the database
            const deletedMessages = messages.map((message) => {
                message.deleted = true;
                return message.save();
            });

            // Wait for all messages to be deleted before deleting the chat room
            await Promise.all(deletedMessages);

            // Delete the chat room by ID
            const result = await ChatRoom.deleteOne({ _id: chatRoomId });

            if (result.deletedCount === 0) {
                return handleResponse(res, 404, 'error', 'Chat room not found', {}, 0);
            }

            // Emit a message to all connected clients that the chat room has been deleted
            io.emit("chatRoomDeleted", chatRoomId);

            return handleResponse(res, 204, 'success', 'Chat room deleted successfully', {}, 0);
        } catch (error) {
            console.error("Error in deleteChatRoom function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    // Route for deleting a message
    async deleteMessage(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const messageId = req.params.messageId;

            // Find the message by ID
            const message = await Message.findById(messageId);

            if (!message) {
                return handleResponse(res, 404, 'error', 'Message not found', {}, 0);
            }

            // Check if the user is authorized to delete the message
            if (message.sender.toString() !== req.user._id.toString()) {
                return handleResponse(res, 403, 'error', 'You are not authorized to delete this message', {}, 0);
            }

            // Mark the message as deleted
            message.deleted = true;
            await message.save();

            return handleResponse(res, 200, 'success', 'Message deleted successfully', {}, 0);
        } catch (error) {
            console.error("Error in deleteMessage function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    // Route for retrieving a single chat room with message history
    async getChatRoom(req, res, io) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const chatRoomId = req.params.chatRoomId;
            const userId = req.user._id; // Current user's ID

            // Retrieve the chat room and populate the 'users' field with name and avatar
            const chatRoom = await ChatRoom.findById(chatRoomId).populate({
                path: "users",
                select: "fullName avatar",
            });

            if (!chatRoom) {
                return handleResponse(res, 404, 'error', 'Chat room not found', {}, 0);
            }

            // Update the message status for the current user in this chat room
            await markLastSeenMessage(userId, chatRoomId);

            // Join the current user to the real-time communication channel for the chat room
            const roomName = `chatRoom-${chatRoomId}`;
            req.app.locals.io.on("connection", (socket) => {
                socket.join(roomName);
            });

            // Retrieve the message history for the chat room
            const messageHistory = await Message.find({ chatRoom: chatRoomId })
                .sort({ timestamp: 1 }) // Sort messages by ascending timestamp
                .populate("sender", "fullName avatar") // Populate sender info
                .exec();

            if (messageHistory.length === 0) {
                return handleResponse(res, 200, 'success', 'No messages', {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Chat room and message history retrieved successfully', { chatRoom, messageHistory }, messageHistory.length);
        } catch (error) {
            console.error("Error in getChatRoom function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    // Function to mark the last seen message for a user in a chat room
    async markLastSeenMessage(userId, chatRoomId) {
        try {
            // Find the latest message in the chat room
            const latestMessage = await Message.findOne({ chatRoom: chatRoomId })
                .sort({ timestamp: -1 }) // Sort by descending timestamp
                .exec();

            if (latestMessage) {
                // Update the user's last seen message in the chat room
                await Users.findByIdAndUpdate(userId, {
                    lastSeenMessage: latestMessage._id,
                });
            }
        } catch (error) {
            console.error("Error marking last seen message:", error);

            throw new Error("Error marking last seen message");
            // Handle the error, log it, or return an appropriate response
        }
    }

    // Route for sending a message
    async sendMessage(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const { text, sender, recipient } = req.body;

            // Check if a chat room exists for the sender and recipient
            let chatRoom = await ChatRoom.findOne({
                users: { $all: [sender, recipient] },
            });

            // If a chat room doesn't exist, create a new chat room
            if (!chatRoom) {
                chatRoom = new ChatRoom({
                    users: [sender, recipient],
                });
                await chatRoom.save();
            }

            // Add the message to the chat room
            const message = new Message({ text, sender, recipient });
            chatRoom.messages.push(message._id);
            await message.save();
            await chatRoom.save();

            // Emit the message to the chat room
            req.app.locals.io.in(chatRoom._id.toString()).emit("message", { message });

            return handleResponse(res, 201, 'success', 'Message sent successfully', { message }, 1);
        } catch (error) {
            console.error("Error in sendMessage function:", error);
            return handleResponse(res, 500, 'error', 'An error occurred while sending the message', {}, 0);
        }
    }

}

module.exports = new MessagesCTRL();