import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory, ArbitraryString} from './Constituent';
import {Adverb, AdverbFactory} from './Adverb';
import {Series} from './Series';

const AdverbPhraseRecord = ConstituentRecordFactory({
    adverb: null // Adverb
});

class AdverbPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("AdverbPhrase");
    }

    static isAdverbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdverbPhrase;
    }

    _clone(...args: any): AdverbPhrase {
        return new AdverbPhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.adverb
        ], context);
    }
}

const AdverbPhraseFactory = (config: Object) => (adverb: AdverbPhrase|Adverb|string): AdverbPhrase => {
    if(AdverbPhrase.isAdverbPhrase(adverb)) {
        return adverb;
    }
    return new AdverbPhrase(
        AdverbPhraseRecord({
            adverb: Series.isSeries(adverb) || ArbitraryString.isArbitraryString(adverb)
                ? adverb
                : AdverbFactory(config)(adverb)
        }),
        config
    );
};

export {
    AdverbPhrase,
    AdverbPhraseFactory
};
