'use strict';

class Sabba {

    constructor() {

        this._x = 1;
        this._y = 2;
    }

    x() {

        return this._x
    }

    y() {

        return this._y;
    }

}

var a = new Sabba();

console.log(a.x());
a._x = 232;
console.log(a.x());