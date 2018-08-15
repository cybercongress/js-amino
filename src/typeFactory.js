//let privTypeMap = undefined
let { Types } = require('./types')

const Reflection = require("./reflect") 


let privTypeMap = Symbol("privateTypeMap")

let aminoTypes  = new Array()

const isExisted = name => {
    return aminoTypes.includes(name)
}


class BaseAminoType {

    constructor() {
        this[privTypeMap] = new Map();
    }

    set(name, type) {
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
                    }
                })
            })

        }
        typeName() {
            return className;
        }
    }
    aminoTypes.push(className)
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


    console.log(Reflection.typeOf(obj))



}