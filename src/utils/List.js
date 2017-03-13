import {List} from 'immutable';

function CreateList(ii) {
    if(List.isList(ii)) {
        return ii;
    }
    if(Array.isArray(ii)) {
        return List(ii);
    }
    return List([ii]);
}

export {
    CreateList
};
