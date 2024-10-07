type DeepPartial<T> = {
    [K in keyof T]?: (T[K] | DeepPartial<T[K]>);
};

type NonFunction<T> = T extends Function ? never : T;

function isClass(obj: (object | undefined)) {
    const c: (Function | undefined) = obj && obj.constructor;
    return !!(isObject(obj, true) && (c && (c as any).name && (c as any).name !== 'Object'));
}

function isArray(obj: unknown): obj is Array<unknown> {
    const str = Object.prototype.toString.call(obj);
    return str === '[object Array]' || str === '[object Array Iterator]';
}

function isObject<T>(obj: T, strict?: boolean): obj is object & NonFunction<NonNullable<T>> {
    return (!!obj && typeof obj === 'object' && (!strict || !isArray(obj)));
}

const restrictedKeys = [`__proto__`, `constructor`, `prototype`];

export function merge<T = object>(object: T, ...sources: Array<DeepPartial<T> | undefined>): T {

    const doCopy = function (copy: any, original: any): any {

        // An object is replacing a primitive
        if (typeof copy !== 'object') {
            copy = {};
        }

        Object.entries(original).forEach(([key, value]) => {

            // Prototype pollution (#14883)
            if (restrictedKeys.includes(key)) {
                return;
            }

            // Copy the contents of objects, but not arrays
            if (isObject(value, true) && !isClass(value)) {
                copy[key] = doCopy(copy[key] || {}, value);
            } 
            // Primitives and arrays are copied over directly
            else {
                copy[key] = original[key];
            }
        });

        return copy;
    };

    // For each source, extend the object
    const len = sources.length;
    for (let i = 0; i < len; i++) {
        object = doCopy(object, sources[i]);
    }

    return object;
}
