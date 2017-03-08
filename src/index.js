import {AdjectiveFactory} from './constituent/Adjective';
import {AdjectivePhraseFactory} from './constituent/AdjectivePhrase';
import {AdverbFactory} from './constituent/Adverb';
import {AdverbPhraseFactory} from './constituent/AdverbPhrase';
import {ClauseFactory} from './constituent/Clause';
import {ConjunctionFactory} from './constituent/Conjunction';
import {DeterminerFactory} from './constituent/Determiner';
import {NounFactory} from './constituent/Noun';
import {NounPhraseFactory} from './constituent/NounPhrase';
import {ParagraphFactory} from './constituent/Paragraph';
import {PrepositionFactory} from './constituent/Preposition';
import {PrepositionPhraseFactory} from './constituent/PrepositionPhrase';
import {PronounFactory} from './constituent/Pronoun';
import {SentenceFactory} from './constituent/Sentence';
import {VerbFactory} from './constituent/Verb';
import {VerbPhraseFactory} from './constituent/VerbPhrase';
import {WordMetaFactory} from './constituent/WordMeta';


function Constituent(lexicon: Object) {
    return {
        Adjective: AdjectiveFactory,
        AdjectivePhrase: AdjectivePhraseFactory,
        Adverb: AdverbFactory,
        AdverbPhrase: AdverbPhraseFactory,
        Clause: ClauseFactory,
        Conjunction: ConjunctionFactory,
        Determiner: DeterminerFactory,
        Noun: NounFactory,
        NounPhrase: NounPhraseFactory,
        Paragraph: ParagraphFactory,
        Preposition: PrepositionFactory,
        PrepositionPhrase: PrepositionPhraseFactory,
        Pronoun: PronounFactory,
        Sentence: SentenceFactory,
        Verb: VerbFactory(lexicon),
        VerbPhrase: VerbPhraseFactory,
        WordMeta: WordMetaFactory,

        // short hand
        Adj: AdjectiveFactory,
        AdjP: AdjectivePhraseFactory,
        Adv: AdverbFactory,
        AdvP: AdverbPhraseFactory,
        Conj: ConjunctionFactory,
        Det: DeterminerFactory,
        N: NounFactory,
        NP: NounPhraseFactory,
        S: SentenceFactory,
        P: PrepositionFactory,
        PP: PrepositionPhraseFactory,
        Pro: PronounFactory,
        V: VerbFactory(lexicon),
        VP: VerbPhraseFactory
    };
}

export {
    Constituent
};
