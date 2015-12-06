var fs = require('fs');

var cfg;

if(!fs.existsSync('config.json')){
    var jsonString = fs.readFileSync('config-default.json');
    fs.writeFileSync('config.json',jsonString);
    cfg = JSON.parse(jsonString);
} else {
    cfg = JSON.parse(fs.readFileSync('config.json'));
    deflt = JSON.parse(fs.readFileSync('config-default.json'));
    if(deflt.version > cfg.version) {
        for(var key in deflt){
            if(deflt.hasOwnProperty(key) && !cfg.hasOwnProperty(key)){
                cfg[key] = deflt[key];
            }
        }
        fs.writeFileSync('config.json',JSON.stringify(cfg))
    }
}

module.exports = cfg;