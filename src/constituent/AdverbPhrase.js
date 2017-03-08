import Constituent from './Constituent';
import {Adverb, AdverbFactory} from './Adverb';
import {WordMeta} from './WordMeta';
import {
    List,
    Record
} from 'immutable';

const AdverbPhraseRecord = Record({
    adverb: null // Adverb
});

class AdverbPhrase extends Constituent {

    static isAdverbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdverbPhrase;
    }

    _flattenSelf(context: Map<string, any>): List {
        return this._flattenChildren([
            this.data.adverb
        ], context);
    }
}

const AdverbPhraseFactory = (adverb: AdverbPhrase|Adverb|WordMeta|string): AdverbPhrase => {
    if(AdverbPhrase.isAdverbPhrase(adverb)) {
        return adverb;
    }
    return new AdverbPhrase(AdverbPhraseRecord({
        adverb: AdverbFactory(adverb)
    }));
};

export {
    AdverbPhrase,
    AdverbPhraseFactory
};
