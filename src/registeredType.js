
let Utils = require('./utils')


const PrefixBytesLen = 4;
const DisambBytesLen = 3;
const DisfixBytesLen = PrefixBytesLen + DisambBytesLen;
const DelimiterValue = 0x00;


let privObj = {
    disamb:null,
    prefix: null,
    reflectType: null
}

 class RegisteredType {

    constructor(name, rtype) {
        this.name = name;                    
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
     * save Disamb and prefix.
     * refer the calculation: https://github.com/tendermint/go-amino  
     * @param {None}      * 
     * @return {Object} : 2 properties :disAmb and prefix
     */
     
    calculateDisambAndPrefix() {
        let nameHash = Utils.getHash256(this.name)
        nameHash = this.dropLeadingZeroByte(nameHash)        
        let disamb = nameHash.slice(0, DisambBytesLen)
        nameHash = this.dropLeadingZeroByte(nameHash.slice(3))      
        let prefix = nameHash.slice(0,PrefixBytesLen)      
        prefix[3] &= 0xF8
        return {disamb, prefix};        
    }

    /**
     * remove the first item in hash until there is no DelimiterValue at 1st element .
     * refer the calculation: https://github.com/tendermint/go-amino  
     * @param {array}      * hash input
     * @return {array} : array that contains no DelimiterValue at 1st position
     */
    dropLeadingZeroByte(hash) {
        while(hash[0] == DelimiterValue) {
            hash = hash.slice(1)
        }
        return hash;
    }
}

module.exports = {
    RegisteredType
}
if (require.main === module) {
    let type = new RegisteredType("shareledger/MsgSend");
    console.log("disAmb=",type.disamb)
    console.log("prefix=",type.prefix)
    console.log("disfix=", type.disfix)

}