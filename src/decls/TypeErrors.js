import {List} from 'immutable';

function CheckType(item: any, validTypes: Array<string|Object>) {
    const validTypesList = List(validTypes).filter(ii => ii);
    const valid = validTypesList
        .some(test => {
            if(test == "null") {
                return item == null;
            }
            if(typeof test == "string") {
                return typeof item == test;
            }
            return typeof item == "object"
                ? item instanceof test
                : false;
        });

    if(valid) {
        return true;
    }

    const expected = validTypesList
        .map(test => typeof test == "string" ? test : test && test.name)
        .join(", ");

    const got = item && item.constructor ? item.constructor.name : typeof item;

    throw new Error(`Expected ${expected}, got ${got}: ${item}`);
}

export {
    CheckType
};
