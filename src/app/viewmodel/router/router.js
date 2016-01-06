'use strict';

import { View } from '../view.js';


export class RouteView extends View {

    static ACTIVE_CLASS() { return 'is-active'; }
    static BACK_CLASS() { return 'is-previous-view'; }
    static INACTIVE() { return ''; }

    constructor(viewOrElement) {

        var element;

        if (viewOrElement instanceof View) {

            element = viewOrElement._element;
        } else {

            element = viewOrElement;
        }

        super(element);
    }

    setRouteClass(className) {

        super.removeClasses([RouteView.ACTIVE_CLASS(), RouteView.BACK_CLASS(), RouteView.INACTIVE()]);
        super.addClass(className);
    }

}

export class Router {

    constructor() {

        this._viewStack = [];
    }

    moveTo(view) {

        var indexInStack = -1;

        for (let stackedView of this._viewStack) {

            if (stackedView.equals(view)) {

                indexInStack = this._viewStack.indexOf(stackedView);
                break;
            }
        }

        for (let stackedView of this._viewStack) {

            stackedView.setRouteClass(RouteView.INACTIVE());
        }

        if (indexInStack === -1) {

            this._viewStack.push(new RouteView(view));
            indexInStack = 0;
        } else {

            while (this._viewStack.length - 1 > indexInStack) {

                this._viewStack.pop();
            }
        }

        this._viewStack[indexInStack].setRouteClass(RouteView.ACTIVE_CLASS());
        indexInStack > 0 ? this._viewStack[indexInStack - 1].setRouteClass(RouteView.BACK_CLASS()) : null;
    }


}