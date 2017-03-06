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
    toList(): List {
        return List()
            .concat(this.data.preposition)
            .concat(this.data.object);
    }
}

const PrepositionPhraseFactory = (
    preposition: Preposition|string,
    object: NounPhrase|string
): PrepositionPhrase => {

    // TODO: move these inside PrepositionPhraseRecord and always call it on all args
    if(typeof preposition == "string") {
        preposition = PrepositionFactory(preposition);
    }
    if(typeof object == "string") {
        object = NounPhraseFactory(object);
    }

    CheckType(preposition, [Preposition]);
    CheckType(object, [NounPhrase]);

    return new PrepositionPhrase(PrepositionPhraseRecord({
        preposition,
        object
    }));
};

export {
    PrepositionPhrase,
    PrepositionPhraseFactory
}
