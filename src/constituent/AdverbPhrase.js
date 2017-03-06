import Constituent from './Constituent';
import {Adverb, AdverbFactory} from './Adverb';
import {CheckType} from '../decls/TypeErrors';
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

    toList(): List {
        return List()
            .concat(this.data.adverb)
            .filter(ii => ii);
    }
}

const AdverbPhraseFactory = (adverb: Adverb) => {
    if(typeof adverb == "string") {
        adverb = AdverbFactory(adverb);
    }
    CheckType(adverb, [Adverb]);
    return new AdverbPhrase(AdverbPhraseRecord({adverb}));
};

export {
    AdverbPhrase,
    AdverbPhraseFactory
};
