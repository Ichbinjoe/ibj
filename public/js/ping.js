window.onload = function() {
    var pingElement = document.getElementById("ping");
    var colorChanger = document.getElementById("pingIndicator");
    var scale = chroma.scale(['green','yellow','red']);
    var runIt = function() {
        var req = new XMLHttpRequest();
        req.open('get','/p?r='+Math.random(),true);
        req.onreadystatechange = function() {
            if(req.readyState == 4){
                if(req.status != 200){
                    pingelement.innerHTML = '&infin;';
                    colorChanger.style.color = '#000000';
                    schedule();
                } else {
                    var diff = new Date().getTime() - time;
                    pingElement.innerHTML = diff;
                    var spread = diff / 600;
                    if(spread > 1){
                        spread = 1;
                    }
                    colorChanger.style.color = scale(spread);
                    schedule()
                }
            }
        };
        var time = new Date().getTime();
        req.send();
    };

    var schedule = function(){
        setTimeout(runIt, 1000);
    };

    schedule();
};