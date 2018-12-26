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
    if (instance in Types) return Types[instane]

    if (typeof instance == 'object') {
        //if( instance.constructor.name == 'AminoType' ) return instance.typeName()
        //return instance.constructor.name;
        //
        //
        // Checking aminoType
        // as instructor.constructor.name doesn't work in release mobile
        try {
            if (instance.baseName() == 'AminoType')
                return instance.typeName()
        } catch (err) {
            return instance.constructor.name
        }

    }

    return typeof instance;
}

const _ownKeys = instance => {
    if (!isExisted(_typeOf(instance))) return [] //throw new TypeError("instance must be amino type") //remember to check it again
    return Reflect.ownKeys(instance).filter(key => {
        let val = instance.lookup(key)
        return val != null || val != undefined
    })
}

const Reflection = {
    ownKeys: _ownKeys,
    typeOf: _typeOf,
}

const defaultTypes = [Types.Struct, Types.ByteSlice] //list of type needs to init default value before decoding

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

    let objAmino = {
        [className]: class extends BaseAminoType {

            constructor(...args) {
                super()
                let idx = 0;

                properties.forEach(prop => {
                    Reflect.ownKeys(prop).forEach(key => {
                        if (key == 'name') {
                            this[prop[key]] = args[idx++]
                        } else if (key == 'type') {
                            this.set(prop['name'], prop['type'])
                            if ( defaultTypes.includes(prop['type']) ) { //action for decoding: set up the default value for Type.Struct field
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
                if (args.length == 0) { //retreive the default value for this class : it necessary for decoding phase
                    this[privTypeMap].forEach((value, key, map) => {
                        if ( defaultTypes.includes(value) ) {
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
            //info  was set as static property
            set info(_info) {
                objAmino[className].prototype.privateInfo = _info
            }

            get type() {
                return objAmino[className].prototype.privateType
            }

            JsObject() {
                let obj = {}

                Reflect.ownKeys(this).forEach((key) => {

                    if (typeof key != 'symbol' && this.lookup(key) != Types.Struct) {
                        if (this[key]) {
                            obj[key] = this[key]
                        }
                    } else if (this.lookup(key) == Types.Struct) {
                        obj[key] = this[key].JsObject()
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
    isExisted,
    Reflection
}


if (require.main === module) {

    let A = create('A', [{
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
    let bObj = new B(100, 200);

    aObj.info = 500;
    bObj.info = 10000;

    let aObj2 = new A();

    console.log(aObj)
    console.log(bObj)
    //console.log(aObj2.info)
    // console.log(aObj.info)
    // console.log(aObj)
    // console.log(bObj)


    // console.log(aObj.JsObject())



    /*
    const nameIt = (name, cls) => {

        let obj = {
            [name]: class extends cls {
                getNumber() {
                    //console.log("name=",[name])
                    return obj[name].prototype.test;
                }
                setNumber(num) {
                    obj[name].prototype.test = num;
                }

            }
            //sanh.constructor.name = name;

        }
        obj[name].prototype.test = 100;
        return obj[name];


    };



    class Dummy {};

    const NamedDummy = nameIt('NamedDummy', Dummy);
    const NamedDummyMore = nameIt('NamedDummyMore', class {});
    //console.log(nameIt)
    console.log('Here are the classes:');
    console.log(Dummy);
    console.log(NamedDummy);
    console.log(NamedDummyMore);

    const dummy = new Dummy();
    const namedDummy = new NamedDummy();
    const namedDummy2 = new NamedDummy();
    const namedDummyMore = new NamedDummyMore();

    namedDummy.setNumber(1000);
    namedDummyMore.setNumber(2000);

    console.log('\nHere are the objects:');
    // console.log(dummy.getNumber);
    console.log(namedDummy2.getNumber());
    console.log(namedDummyMore.getNumber());

*/
}