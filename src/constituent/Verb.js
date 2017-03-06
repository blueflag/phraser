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

    toList(): List {
        return List()
            .push(this.data.verb);
    }
}

const VerbFactory = (verb: string): Verb => {
    CheckType(verb, ["string"]);
    return new Verb(VerbRecord({verb}));
};

export {
    Verb,
    VerbFactory
};