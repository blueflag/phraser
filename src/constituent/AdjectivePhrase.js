import Constituent from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';
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

    flatten(): List {
        return this._flattenChildren([
            this.data.adjective
        ]);
    }
}

const AdjectivePhraseFactory = (adjective: AdjectivePhrase|Adjective|string): AdjectivePhrase => {
    if(AdjectivePhrase.isAdjectivePhrase(adjective)) {
        return adjective;
    }
    return new AdjectivePhrase(AdjectivePhraseRecord({
        adjective: AdjectiveFactory(adjective)
    }));
};

export {
    AdjectivePhrase,
    AdjectivePhraseFactory
};
