const logger = require('consola');
const clients = {};
const warnedUsers = {};

module.exports = function (io) {
    io.on('connection', (socket) => {
        logger.success(`(${socket.id}) Terhubung ke chat`);
        clients[socket.id] = socket;

        const MAX_MESSAGES = 5;
        const TIME_INTERVAL = 1000; // 1 detik

        let messageCount = 0;
        let lastMessageTime = Date.now();

        socket.on('chatlog', (msg) => {
            const currentTime = Date.now();
            if (currentTime - lastMessageTime < TIME_INTERVAL) {
                messageCount++;
                if (messageCount > MAX_MESSAGES) {
                    // Jika pengguna melewati batas penggunaan
                    if (!warnedUsers[socket.id]) {
                        // Jika pengguna sudah di peringati
                        logger.warn(
                            `Pengguna (${socket.id}) terdeteksi melakukan spam! Harap perhatikan.`
                        );
                        socket.emit('warnUser', {
                            senderId: socket.id,
                            timeout: 3000,
                        });
                        warnedUsers[socket.id] = true;
                    }
                    // socket.emit(
                    //     'chatlog',
                    //     'Anda telah mencapai batas pesan dalam waktu yang singkat.'
                    // );
                    return;
                }
            } else {
                messageCount = 1;
                lastMessageTime = currentTime;

                // Reset status peringatan jika pengguna tidak melakukan spam lagi
                warnedUsers[socket.id] = false;
            }

            if (messageCount <= MAX_MESSAGES) {
                logger.info(`(${socket.id}) [MSG] => ${msg.message}`);
            }

            io.emit('chatlog', msg);
        });

        socket.on('disconnect', () => {
            logger.info(`[LEAVE] (${socket.id}) Meninggalkan chat`);
            delete clients[socket.id];
        });
    });
};
