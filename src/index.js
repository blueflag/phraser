import {AdjectiveFactory} from './constituent/Adjective';
import {AdjectivePhraseFactory} from './constituent/AdjectivePhrase';
import {AdverbFactory} from './constituent/Adverb';
import {AdverbClauseFactory} from './constituent/AdverbClause';
import {AdverbPhraseFactory} from './constituent/AdverbPhrase';
import {ClauseFactory} from './constituent/Clause';
import {DeterminerFactory} from './constituent/Determiner';
import {NounFactory} from './constituent/Noun';
import {NounPhraseFactory} from './constituent/NounPhrase';
import {SentenceFactory} from './constituent/Sentence';
import {PrepositionFactory} from './constituent/Preposition';
import {PrepositionPhraseFactory} from './constituent/PrepositionPhrase';
import {SubordinatingConjunctionFactory} from './constituent/SubordinatingConjunction';
import {VerbFactory} from './constituent/Verb';
import {VerbPhraseFactory} from './constituent/VerbPhrase';
import {WordMetaFactory} from './constituent/WordMeta';


function Phraser(lexicon: Object) {
    return {
        Adjective: AdjectiveFactory,
        AdjectivePhrase: AdjectivePhraseFactory,
        Adverb: AdverbFactory,
        AdverbClause: AdverbClauseFactory,
        AdverbPhrase: AdverbPhraseFactory,
        Clause: ClauseFactory,
        Determiner: DeterminerFactory,
        Noun: NounFactory,
        NounPhrase: NounPhraseFactory,
        Preposition: PrepositionFactory,
        PrepositionPhrase: PrepositionPhraseFactory,
        Sentence: SentenceFactory,
        SubordinatingConjunction: SubordinatingConjunctionFactory,
        Verb: VerbFactory,
        VerbPhrase: VerbPhraseFactory,
        WordMeta: WordMetaFactory,

        // short hand
        A: AdjectiveFactory,
        AP: AdjectivePhraseFactory,
        Adv: AdverbFactory,
        AdvP: AdverbPhraseFactory,
        Det: DeterminerFactory,
        N: NounFactory,
        NP: NounPhraseFactory,
        S: SentenceFactory,
        P: PrepositionFactory,
        PP: PrepositionPhraseFactory,
        V: VerbFactory,
        VP: VerbPhraseFactory
    };
}

export default Phraser;
