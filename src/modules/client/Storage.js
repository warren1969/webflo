

/**
 * @imports
 */
import { Observer } from '@webqit/pseudo-browser/index2.js';
import { _isUndefined } from '@webqit/util/js/index.js';

export default function(persistent = false) {

    const storeType = persistent ? 'localStorage' : 'sessionStorage';
    if (!window[storeType]) {
        throw new Error(`The specified Web Storage API ${storeType} is invalid or not supported`)
    }

    const _storage = {};
    Observer.intercept(_storage, (event, received, next) => {
        if (event.type === 'get') {
            const value = window[storeType].getItem(event.name);
            return !_isUndefined(value) ? JSON.parse(value) : value;
        }
        if (event.type === 'set') {
            window[storeType].setItem(event.name, !_isUndefined(event.value) ? JSON.stringify(event.value) : event.value);
            return true;
        }
        if (event.type === 'deleteProperty') {
            window[storeType].removeItem(event.name);
            return true;
        }
        if (event.type === 'has') {
            for(var i = 0; i < window[storeType].length; i ++){
                if (window[storeType].key(i) === event.name) {
                    return true;
                }
            };
            return false;
        }
        if (event.type === 'ownKeys') {
            var keys = [];
            for(var i = 0; i < window[storeType].length; i ++){
                keys.push(window[storeType].key(i));
            };
            return keys;
        }
        return next();
    });

    return Observer.proxy(_storage, {
        getOwnPropertyDescriptor: (t, prop) => ({ enumerable: true, configurable: true }),
    });
}

export {
    Observer,
}