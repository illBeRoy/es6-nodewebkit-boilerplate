'use strict';


export class View {

    /**
     *
     * @param {Element|string} elementOrSelector
     */
    constructor(elementOrSelector) {

        this._element = View._getElement(elementOrSelector);
    }

    addClass(className) {

        let classes = this._element.getAttribute('class').split(' ');
        if (classes.indexOf(className) === -1) {

            classes.push(className);
            this._element.setAttribute('class', classes.join(' '));
        }
    }

    addClasses(classNames) {

        for (let className of classNames) {

            this.addClass(className);
        }
    }

    removeClass(className) {

        let classes = this._element.getAttribute('class').split(' ');
        let givenClassIndex = classes.indexOf(className);

        if (givenClassIndex === -1) {

            return;
        }

        classes.splice(givenClassIndex, 1);
        this._element.setAttribute('class', classes.join(' '));
    }

    removeClasses(classNames) {

        for (let className of classNames) {

            this.removeClass(className);
        }
    }

    enforceClass(className) {

        this._element.setAttribute('class', className);
    }

    enforceClasses(classNames) {

        this._element.setAttribute('class', classNames.join(' '));
    }

    equals(otherView) {

        return this._element === otherView._element;
    }

    static _getElement(elementOrSelector) {

        if (elementOrSelector instanceof Element) {

            return elementOrSelector;
        } else {

            return document.querySelector(elementOrSelector);
        }
    }

}
