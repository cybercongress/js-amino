
let Utils = require('./utils')


const PrefixBytesLen = 4;
const DisambBytesLen = 3;
const DisfixBytesLen = PrefixBytesLen + DisambBytesLen;
const DelimiterValue = 0x00;


//let private = {
    //disamb:null,
    //prefix: null,
    //reflectType: null,
    //isRegistered: false
//}

let privObject = Symbol("privateObj")

 class RegisteredType {

    constructor(name, rtype) {
        this.name = name;
                             
        this[privObject]  = this.calculateDisambAndPrefix();
        this[privObject].reflectType = rtype
        this[privObject].isRegistered = false;
       // privObj.reflectType = rtype 
       // privObj.isRegistered = false          
    }

    get prefix() {
        return this[privObject].prefix
    }

    get disfix() {       
        return this.disamb.concat(this.prefix)
    }

    get disamb() {
        return this[privObject].disamb
    }

    get reflectType() {
        return this[privObject].rtype;
    }

    get registered() {
        return this[privObject].isRegistered
    }

    set registered(status) {
        this[privObject].isRegistered = status;
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
    let type = new RegisteredType("shareledger/PubSecp256k1");
    console.log("disAmb=",type.disamb)
    console.log("prefix=",type.prefix)
    console.log("disfix=", type.disfix)

}
