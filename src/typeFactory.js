//let privTypeMap = undefined
let {
    Types
} = require('./types')

const Reflection = require("./reflect")


let privTypeMap = Symbol("privateTypeMap")

let aminoTypes = new Array()

const isExisted = name => {
    return aminoTypes.includes(name)
}


class BaseAminoType {

    constructor() {
        this[privTypeMap] = new Map();          
    }

    set(name, type) {
        if( this[privTypeMap].has(name) ) throw new RangeError(`property '${name}' existed`)
        this[privTypeMap].set(name, type)
    }

    lookup(name) {
        return this[privTypeMap].get(name)
    }
   

}


let create = (className, properties) => {

    if (!properties) {
        throw new Error("Type List can not be empty")
        return;
    }
    if (!properties.length) {
        throw new Error("Need to provide TypeList")
        return;
    }

    /*AminoType*/
    class AminoType extends BaseAminoType {

        constructor(...args) {
            super()
            let idx = 0;
            properties.forEach(prop => {
                Reflect.ownKeys(prop).forEach(key => {
                    if (key == 'name') {
                        this[prop[key]] = args[idx++]
                    } else if (key == 'type') {
                        this.set(prop['name'], prop['type'])
                        if (prop['type'] == Types.Struct) { //set up the default value for Type.Struct field
                            if (this[prop['name']]) {
                                let defaultAminotye = Object.assign({}, this[prop['name']])
                                Object.setPrototypeOf(defaultAminotye, AminoType.prototype);
                                AminoType.defaultMap.set(prop['name'], defaultAminotye)
                            }
                        }
                    }
                })
            })
            if (args.length == 0) {
                this[privTypeMap].forEach((value, key, map) => {
                    if (value == Types.Struct) {
                        this[key] = AminoType.defaultMap.get(key)
                    }
                })
            }          

        }

        typeName() {
            return className;
        }

        get info() {
            return AminoType.info
        }

        set info(_info) {
            AminoType.info = _info;
        }

        JsObject() {
            let obj = {}
            Reflect.ownKeys(this).forEach((key) => {               
                if( typeof key != 'symbol' &&  this.lookup(key) != Types.Struct) {
                    if( this[key] ) {
                       obj[key] = this[key]
                    }                
                }
                else if( this.lookup(key) == Types.Struct ) {
                    obj[key] = this[key].JsObject()
                }
            })
            return obj;
        }
       
    }
    aminoTypes.push(className)
    AminoType.defaultMap = new Map(); //static map for default value-dirty hack
    AminoType.info = null //static registered type info

    return AminoType;

}

module.exports = {
    create,
    isExisted
}


if (require.main === module) {
    let A = create('TestAmino', [{
            name: "a",
            type: Types.Int32
        },
        {
            name: "b",
            type: Types.Int64
        }
    ])

    let B = create('B', [{
            name: "a",
            type: Types.Int32
        },
        {
            name: "b",
            type: Types.Int16
        }
    ])



    let aObj = new A(100, 200);
    let obj = new B(100, 200);


    console.log(aObj.JsObject())



}