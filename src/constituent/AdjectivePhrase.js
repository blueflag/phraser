// @flow

import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';
import {WordMeta} from './WordMeta';

const AdjectivePhraseRecord = Record({
    adjective: null // Adjective
});

class AdjectivePhrase extends Constituent {

    static isAdjectivePhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdjectivePhrase;
    }

    _flattenSelf(context: Map<string, any>): List {
        return this._flattenChildren([
            this.data.adjective
        ], context);
    }
}

const AdjectivePhraseFactory = (adjective: AdjectivePhrase|Adjective|WordMeta|string): AdjectivePhrase => {
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
