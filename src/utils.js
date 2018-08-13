const getHash256 = input => {
    let sha256 = require('js-sha256');
    let hash2 = sha256.update(input);   
    return hash2.array();
}



module.exports = {
    getHash256
}