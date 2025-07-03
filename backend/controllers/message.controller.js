import {Conversation}from '../models/conversation.model.js';
// for chating
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // ID of the user sending the message
        const  receiverId = req.params.id; // ID of the user receiving the
        const {message} = req.body; // Message content

        let conversation = await Conversation.findOne({ 
            participants: { $all: [senderId, receiverId] }
        });
        // establish the conversation if not start yet
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        };
        const newMessage = 
        
    } catch (error) {
        console.log(error);
        
    }
}