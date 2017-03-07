import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
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

const AdjectiveFactory = (adjective: Adjective|WordMeta|string): Adjective => {
    CheckType(adjective, [Adjective, WordMeta, "string"]);
    if(Adjective.isAdjective(adjective)) {
        return adjective;
    }
    return new Adjective(AdjectiveRecord({adjective}));
};

export {
    Adjective,
    AdjectiveFactory
};
