import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Preposition, PrepositionFactory} from './Preposition';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {
    List,
    Record
} from 'immutable';

const PrepositionPhraseRecord = Record({
    preposition: null, // Preposition
    object: null // NounPhrase, TODO can also have Pronoun|Gerund|Clause
});

class PrepositionPhrase extends Constituent {

    static isPrepositionPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof PrepositionPhrase;
    }

    flatten(): List {
        return this._flattenChildren([
            this.data.preposition,
            this.data.object
        ]);
    }
}

const PrepositionPhraseFactory = (
    prepositionOrPhrase: PrepositionPhrase|Preposition|string,
    object: NounPhrase|string
): PrepositionPhrase => {

    if(PrepositionPhrase.isPrepositionPhrase(prepositionOrPhrase)) {
        return prepositionOrPhrase;
    }

    CheckType(prepositionOrPhrase, [Preposition]);
    CheckType(object, [NounPhrase]);

    return new PrepositionPhrase(PrepositionPhraseRecord({
        preposition: PrepositionFactory(prepositionOrPhrase),
        object: NounPhraseFactory(object)
    }));
};

export {
    PrepositionPhrase,
    PrepositionPhraseFactory
};
