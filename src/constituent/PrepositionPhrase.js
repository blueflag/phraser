import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {Preposition, PrepositionFactory} from './Preposition';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';

const PrepositionPhraseRecord = ConstituentRecordFactory({
    preposition: null, // Preposition
    object: null // NounPhrase
});

class PrepositionPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("PrepositionPhrase", "Modifier");
    }

    static isPrepositionPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof PrepositionPhrase;
    }

    _clone(...args: any): PrepositionPhrase {
        return new PrepositionPhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.preposition,
            this.data.object
        ], context);
    }
}

const PrepositionPhraseFactory = (config: Object) => (
    prepositionOrPhrase: PrepositionPhrase|Preposition|string,
    object: NounPhrase|Noun|string
): PrepositionPhrase => {

    if(PrepositionPhrase.isPrepositionPhrase(prepositionOrPhrase)) {
        return prepositionOrPhrase;
    }

    return new PrepositionPhrase(
        PrepositionPhraseRecord({
            preposition: PrepositionFactory(config)(prepositionOrPhrase),
            object: NounPhraseFactory(config)(object)
        }),
        config
    );
};

export {
    PrepositionPhrase,
    PrepositionPhraseFactory
};
