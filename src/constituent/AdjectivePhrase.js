import {List, Map} from 'immutable';
import {Constituent, ConstituentRecordFactory, ArbitraryString} from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';
import {Series} from './Series';

const AdjectivePhraseRecord = ConstituentRecordFactory({
    adjective: null, // Adjective
    modifiers: Map({
        front: List(),
        end: List()
    })
});

class AdjectivePhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("AdjectivePhrase");
    }

    static isAdjectivePhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdjectivePhrase;
    }

    _clone(...args: any): AdjectivePhrase {
        return new AdjectivePhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.modifiers.get('front'),
            this.data.adjective,
            this.data.modifiers.get('end')
        ], context);
    }

    modifier(modifier: any, position: string): NounPhrase {
        return this._modifier(modifier, position);
    }
}

const AdjectivePhraseFactory = (config: Object) => (adjective: AdjectivePhrase|Adjective|string): AdjectivePhrase => {
    if(AdjectivePhrase.isAdjectivePhrase(adjective)) {
        return adjective;
    }
    return new AdjectivePhrase(
        AdjectivePhraseRecord({
            adjective: Series.isSeries(adjective) || ArbitraryString.isArbitraryString(adjective)
                ? adjective
                : AdjectiveFactory(config)(adjective)
        }),
        config
    );
};

export {
    AdjectivePhrase,
    AdjectivePhraseFactory
};
