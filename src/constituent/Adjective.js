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

    _renderSelf(): string {
        return this.data.adjective;
    }
}

const AdjectiveFactory = (adjective: Adjective|string): Adjective => {
    CheckType(adjective, [Adjective, "string"]);
    if(Adjective.isAdjective(adjective)) {
        return adjective;
    }
    return new Adjective(AdjectiveRecord({adjective}));
};

export {
    Adjective,
    AdjectiveFactory
};
