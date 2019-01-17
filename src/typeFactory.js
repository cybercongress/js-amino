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


const defaultTypes = [Types.Struct, Types.ByteSlice, Types.Interface] //list of type needs to init default value before decoding

class BaseAminoType {

    constructor() {
        this[privTypeMap] = new Map();

    }

    set(name, type) {
        if (this[privTypeMap].has(name)) throw new RangeError(`property '${name}' existed`)
        this[privTypeMap].set(name, type)
    }

    lookup(name) {
        return this[privTypeMap].get(name)
    }

}


let create = (className, properties, type = Types.Struct) => {

    if (!properties) {
        throw new Error("Type List can not be empty")
    }
    if (!properties.length) {
        throw new Error("Need to provide TypeList")
    }



    /*AminoType*/
    let objAmino = {

        [className]: class extends BaseAminoType {

            constructor(...args) {
                super()
                let idx = 0;
                properties.forEach(prop => {
                    Reflect.ownKeys(prop).forEach(key => {

                        if (key == 'name') {
                            this.idx = idx;
                            this[prop[key]] = args[idx++]
                        } else if (key == 'type') {
                            this.set(prop['name'], prop['type'])
                            if (defaultTypes.includes(prop['type'])) { //action for decoding: set up the default value for Type.Struct field
                                if (this[prop['name']]) {
                                    // let defaultAminotye = Object.assign({}, this[prop['name']])                                 

                                    // Object.setPrototypeOf(defaultAminotye, objAmino[className].prototype)
                                    // objAmino[className].prototype.defaultMap.set(prop['name'], defaultAminotye)
                                    objAmino[className].prototype.defaultMap.set(prop['name'], this[prop['name']])
                                }
                            }
                        }
                    })
                })
                if (args.length == 0) {
                    this[privTypeMap].forEach((value, key, map) => {
                        if (defaultTypes.includes(value)) {
                            this[key] = objAmino[className].prototype.defaultMap.get(key)
                        }
                    })
                }

            }

            typeName() {
                return className;
            }

            baseName() {
                return 'AminoType';
            }

            get info() {
                return objAmino[className].prototype.privateInfo;
            }

            set info(_info) {
                objAmino[className].prototype.privateInfo = _info
            }

            /*  get index() {
                return this.idx
            }
    
            set index(_idx) {
                console.log('set index=',_idx)
                this.idx = _idx
            } */

            get type() {
                return objAmino[className].prototype.privateType
            }

            JsObject() {
                let obj = {}

                Reflect.ownKeys(this).forEach((key) => {
                    let typeLookup = this.lookup(key)
                    if (typeof key != 'symbol') {
                        if (typeof this[key].JsObject !== 'function') { //check if this property has recursive JsObject
                            obj[key] = this[key]
                        } else {
                            obj[key] = this[key].JsObject()
                        }
                    }
                })
                return obj;
            }


        }

    }

    aminoTypes.push(className)
    objAmino[className].prototype.defaultMap = new Map()
    objAmino[className].prototype.privateInfo = null;
    objAmino[className].prototype.privateType = type;

    //return AminoType;
    return objAmino[className]

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


    console.log(Reflection.typeOf(obj))



}