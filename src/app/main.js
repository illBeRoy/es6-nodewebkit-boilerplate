'use strict';

class App {

    constructor(appName) {

        this._appName = appName || 'default name';
    }

    main(args) {

        console.log(this._appName, args);
    }

}

var app = new App();
app.main(['a', 1, true]);
