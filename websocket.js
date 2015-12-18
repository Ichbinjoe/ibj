var websocket = require('websocket').server;

module.exports = function (server) {
    var sock = new websocket({
        httpServer: server,
        autoAcceptConnections: false
    });

    sock.on('request', function (request) {
        if (!true) {
            return request.reject();
        }

        var connection = request.accept('ping', request.origin);
        connection.on('message', function (msg) {
            if (msg.type == 'utf8') {
                if (msg.utf8Data == 'ping') {
                    connection.sendUTF('pong');
                } else {
                    connection.close();
                }
            } else {
                connection.close();
            }
        })
    });
};
