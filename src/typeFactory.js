//let privTypeMap = undefined
let {
    Types
} = require('./types')


let privTypeMap = Symbol("privateTypeMap")


let aminoTypes = new Array()

const isExisted = name => {
    return aminoTypes.includes(name)
}

const _typeOf = instance => {
    if ((typeof instance) === "undefined") {
        throw new Error("Undefined Type");
    }
    if( instance in Types ) return Types[instane]
    
    if (typeof instance == 'object') {
        //if( instance.constructor.name == 'AminoType' ) return instance.typeName()
        //return instance.constructor.name;
        //
        //
        // Checking aminoType
        // as instructor.constructor.name doesn't work in release mobile
        try {
            if ( instance.baseName() == 'AminoType' )
                return isntance.typeName()
        } catch (err) {
            return instance.constructor.name
        }

    }
 
    return typeof instance;
}

const _ownKeys = instance => {
    if( !isExisted(_typeOf(instance)) ) return []//throw new TypeError("instance must be amino type") //remember to check it again
    return Reflect.ownKeys(instance).filter(key => {
        let val = instance.lookup(key)
        return val != null || val != undefined
    })
}

const Reflection = {
    ownKeys: _ownKeys,
    typeOf: _typeOf,
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


let create = (className, properties, type = Types.Struct) => {

    if (!properties) {
        throw new Error("Type List can not be empty")        
    }
    if (!properties.length) {
        throw new Error("Need to provide TypeList")        
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

        baseName() {
            return 'AminoType';
        }

        get info() {
            return AminoType.info
        }

        set info(_info) {
            AminoType.info = _info;
        }

        get type() {
            return AminoType.type
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
    AminoType.type = type //describe the type(Struct,Array) for encode/decode

    return AminoType;

}

module.exports = {
    create,
    isExisted,
    Reflect
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
