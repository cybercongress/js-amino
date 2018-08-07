

const PrefixBytesLen = 4;
const DisambBytesLen = 3;
const DisfixBytesLen = PrefixBytesLen + DisambBytesLen;
const DelimiterValue = 0x00;

const getHash256 = input => {
    let sha256 = require('js-sha256');
    let hash2 = sha256.update(input);   
    return hash2.array();
}

let privObj = {
    disamb:null,
    prefix: null,
    reflectType: null
}

 class RegisteredType {

    constructor(name, rtype) {
        this.name = name;
        this._nameHash = getHash256(name);            
        privObj = this.calculateDisambAndPrefix();
        privObj.reflectType = rtype           
    }

    get prefix() {
        return privObj.prefix
    }

    get disfix() {       
        return this.disamb.concat(this.prefix)
    }

    get disamb() {
        return privObj.disamb
    }

    get reflectType() {
        return privObj.rtype;
    }
     /**
     * save KeyInfo with name to Db.  
     * @param {None}      * 
     * @return {Object} : 2 properties :disAmb and prefix
     */

    calculateDisambAndPrefix() {
        let nameHash = getHash256(this.name)
        while( this._nameHash[0] == DelimiterValue) {
            nameHash = nameHash.slice(1)
        }
        let disamb = nameHash.slice(0, DisambBytesLen)
        nameHash = nameHash.slice(3);
        while( this._nameHash[0] == DelimiterValue) {
            nameHash = nameHash.slice(1)
        }
        let prefix = nameHash.slice(0,PrefixBytesLen)

        return {disamb, prefix};
        
    }
}

module.exports = {
    RegisteredType
}
if (require.main === module) {
    let type = new RegisteredType("SimpleStruct");
    console.log("disAmb=",type.disamb)
    console.log("prefix=",type.prefix)
    console.log("disfix=", type.disfix)

}