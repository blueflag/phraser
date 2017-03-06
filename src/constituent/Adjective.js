import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    List,
    Record
} from 'immutable';

const AdjectiveRecord = Record({
    adjective: ""
});

class Adjective extends Constituent {

    static isAdjective(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Adjective;
    }

    toList(): List {
        return List()
            .push(this.data.adjective);
    }
}

const AdjectiveFactory = (adjective: string): Adjective => {
    CheckType(adjective, ["string"]);
    return new Adjective(AdjectiveRecord({adjective}));
};

export {
    Adjective,
    AdjectiveFactory
};
