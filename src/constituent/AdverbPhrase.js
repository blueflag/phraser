import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {Adverb, AdverbFactory} from './Adverb';

const AdverbPhraseRecord = Record({
    adverb: null // Adverb
});

class AdverbPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["AdverbPhrase"];
    }

    static isAdverbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdverbPhrase;
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.adverb
        ], context);
    }
}

const AdverbPhraseFactory = (adverb: AdverbPhrase|Adverb|string): AdverbPhrase => {
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
