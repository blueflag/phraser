import Constituent from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';
import {CheckType} from '../decls/TypeErrors';
import {
    List,
    Record
} from 'immutable';

const AdjectivePhraseRecord = Record({
    adjective: null // Adjective
});

class AdjectivePhrase extends Constituent {

    static isAdjectivePhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdjectivePhrase;
    }

    toList(): List {
        return List()
            .concat(this.data.adjective)
            .filter(ii => ii);
    }
}

const AdjectivePhraseFactory = (adjective: Adjective) => {
    if(typeof adjective == "string") {
        adjective = AdjectiveFactory(adjective);
    }
    CheckType(adjective, [Adjective]);
    return new AdjectivePhrase(AdjectivePhraseRecord({adjective}));
};

export {
    AdjectivePhrase,
    AdjectivePhraseFactory
};
