window.onload = function () {
    var pingElement = document.getElementById("ping");
    var colorChanger = document.getElementById("pingIndicator");
    var scale = chroma.scale(['green', 'yellow', 'red']);
    var socket = new WebSocket('wss://ibj.io','ping');
    var schedule = function () {
        setTimeout(runIt, 1000);
    };
    var runIt = function () {
        socket.send('ping');
        var time = new Date().getTime();
        socket.onmessage = function (event) {
            if (event.data != 'pong') {
                socket.close();
                return;
            }
            var diff = new Date().getTime() - time;
            pingElement.innerHTML = diff;
            var spread = diff / 600;
            if (spread > 1) {
                spread = 1;
            }
            colorChanger.style.color = scale(spread);
            schedule()
        };
    };


    socket.onopen = schedule;

};