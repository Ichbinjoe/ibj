window.onload = function () {
    var httpReq = new XMLHttpRequest();
    httpReq.open("get", "https://raw.githubusercontent.com/Ichbinjoe/MCAuthenticator/master/README.md");
    httpReq.onreadystatechange = function () {
        if (httpReq.readyState == 4) {
            var ebid = document.getElementById("ghcontent");
            ebid.innerHTML = marked(httpReq.responseText);
        }
    };
    httpReq.send();
};