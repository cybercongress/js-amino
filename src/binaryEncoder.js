const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeBinary = (instance, type, isBare = true) => {

    let tmpInstance = instance;
    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface) { //only get the first property with type != Struct        
        let keys = Reflection.ownKeys(instance);
        if (keys.length > 0) { //type of AminoType class with single property
            keys.forEach(key => {
                let aminoType = instance.lookup(key)
                if (type != aminoType) throw new TypeError("Amino type does not match")
                tmpInstance = instance[key]
                return;
            })
        }
    }

    let data = null;
    switch (type) {

        case Types.Int8:
            {
                data = Encoder.encodeSignedVarint(tmpInstance)
                break;
            }

        case Types.Int32:
            {
                data = Encoder.encodeInt32(tmpInstance)
                break;
            }

        case Types.Int64:
            {
                data = Encoder.encodeInt64(tmpInstance)                
                break;
            }
        case Types.Boolean:
            {
                data = Encoder.encodeBoolean(tmpInstance)
                break;
            }
        case Types.String:
            {
                let encodedString = Encoder.encodeString(tmpInstance)
                data = encodedString
                break;
            }

        case Types.Struct:
            {
                data = encodeBinaryStruct(tmpInstance,isBare)
                break;
            }
        case Types.ByteSlice:
            {
                data = Encoder.encodeSlice(tmpInstance)
                break;

            }
        case Types.Interface:
            {  /*
                //add 0x00 | disAmp | prefix |length(if bare)
                
                data = encodeBinary(tmpInstance, tmpInstance.type, true) //dirty-hack
                data = instance.info.prefix.concat(data)
                if (!isBare) {
                    data = Encoder.encodeUVarint(data.length).concat(data)
                }

                
                console.log("typeName=", instance.info.name)
                */
               let data = encodeBinaryInterface(tmpInstance,isBare)
                return data; //dirty hack
            }
        default:
            {
                console.log("There is no data type to encode")
                break;
            }
    }
    if (instance.info) {
        if (instance.info.registered) {
            //instance.info.prefix[3] |= WireMap[type] //type properties was registered               
            // data = instance.info.prefix.concat(data)
        }
    }
    return data;

}

const encodeBinaryInterface = (instance, isBare) => {
    let data = encodeBinary(instance, instance.type, true) //dirty-hack
    data = instance.info.prefix.concat(data)
    if (!isBare) {
        data = Encoder.encodeUVarint(data.length).concat(data)
    }

    // data = /[0x00].concat*/(instance.info.disamb).concat(data)
    // data = instance.info.disamb.concat(data)
   // console.log("typeName=", instance.info.name)
  // console.log('isBare=',isBare)
  // console.log('data=',data)
    return data;

}


const encodeBinaryStruct = (instance, isBare = true) => {
    let result = []
    Reflection.ownKeys(instance).forEach((key, idx) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 

        let encodeData = encodeBinaryField(instance[key], idx, type,false)
        if (encodeData) {
            result = result.concat(encodeData)
        }
    })
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result)
    }

    // result = result.concat(4) //append 4 as denoted for struct

    return result;

}



const encodeBinaryField = (typeInstance, idx, type,isBare) => {
    console.log('idx=',idx+1)
    console.log('WireMap[type]=',WireMap[type])
    let encodeField = Encoder.encodeFieldNumberAndType(idx + 1, WireMap[type])
    let encodeData = encodeBinary(typeInstance, type,isBare)

    return encodeField.concat(encodeData)


}



module.exports = {
    encodeBinary
}