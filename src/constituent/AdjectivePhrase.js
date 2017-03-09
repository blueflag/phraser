import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';

const AdjectivePhraseRecord = Record({
    adjective: null // Adjective
});

class AdjectivePhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["AdjectivePhrase"];
    }

    static isAdjectivePhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdjectivePhrase;
    }

    _clone(...args: any): AdjectivePhrase {
        return new AdjectivePhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.adjective
        ], context);
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
