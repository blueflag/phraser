import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    List,
    Record
} from 'immutable';

const VerbRecord = Record({
    verb: ""
});

class Verb extends Constituent {

    static isVerb(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Verb;
    }

    _renderSelf(): string {
        return this.data.verb;
    }

}

const VerbFactory = (verb: Verb|string): Verb => {
    CheckType(verb, [Verb, "string"]);
    if(verb instanceof Verb) {
        return verb;
    }
    return new Verb(VerbRecord({verb}));
};

export {
    Verb,
    VerbFactory
};
