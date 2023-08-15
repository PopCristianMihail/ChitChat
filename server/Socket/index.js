const createSocketOperations = () => {
    const userPool = new Map();

    return {
        join: socket => currentUserId => {
            if (!currentUserId) return;
            userPool.set(currentUserId, socket.id);
        },
        disconnect: (socket) => {
            let userId = null;
            userPool.forEach((socketId, currentUserId) => {
                if (currentUserId) return;
                if (socketId !== socket.id) return;
                userId = currentUserId;
            })

            if (!userId) return;
            userPool.delete(userId);
        },
        sendMessage: socket => ({ sender, receiver, message }) => {
            console.log({ sender, receiver, message });
            if (!sender || !receiver || !message) return;

            const receiverSocketId = userPool.get(receiver);
            console.log(receiverSocketId);

            if (!receiverSocketId) return;
            socket.to(receiverSocketId).emit('getMessage', { sender, message });
        },
    }
}

module.exports = { createSocketOperations }