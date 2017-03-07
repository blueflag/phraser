import Constituent from './Constituent';
import {AdjectiveFactory} from './Adjective';
import {DeterminerFactory} from './Determiner';
import {Noun, NounFactory} from './Noun';
import {PrepositionPhrase} from './PrepositionPhrase';
import {WordMeta} from './WordMeta';
import {CheckType} from '../decls/TypeErrors';

// TODO - validate types on method args!

import {
    List,
    Record
} from 'immutable';

const NounPhraseRecord = Record({
    noun: null, // Noun|Pronoun
    determiner: null, // Determiner
    adjectives: List(), // List<Adjective>
    modifiers: List() // List<PrepositionPhrase  TODO: |AdjectiveClause|ParticiplePhrase|Infinitive>
});

class NounPhrase extends Constituent {

    static isNounPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof NounPhrase;
    }

    // "the" dog
    // "a" dog
    // "those" dogs
    // "most" dogs
    // "7" dogs

    determiner(determiner: Determiner|WordMeta|string): NounPhrase {
        return new NounPhrase(
            this.data.set('determiner', DeterminerFactory(determiner))
        );
    }

    det(determiner: Determiner|WordMeta|string): NounPhrase {
        return this.determiner(determiner);
    }

    the(): Determiner {
        return this.determiner('the');
    }

    a(): Determiner {
        return this.determiner('a');
    }

    // "blue" dog
    // "fat" dog

    adjective(adj: Adjective|WordMeta|string): NounPhrase {
        return new NounPhrase(
            this.data.update('adjectives', adjs => adjs.push(AdjectiveFactory(adj)))
        );
    }

    // dog "in the wild"
    // dog "with no collar"
    // dog "under the house"

    // Be careful which noun phrase has which modifiers
    // YouTube showed that THE CAT played the piano in a blue shirt.
    // YouTube showed THAT THE CAT PLAYED THE PIANO in high definition.
    // YouTube showed that the cat played the PIANO in the living room.
    // from http://allthingslinguistic.com/post/102131750573/how-to-draw-a-syntax-tree-part-8-a-step-by-step

    modifier(modifier: PrepositionPhrase/*|ParticiplePhrase|AdjectiveClause|AdverbClause|Infinitive|WordMeta|string*/): NounPhrase {
        CheckType(modifier, [PrepositionPhrase]);
        return new NounPhrase(
            this.data.update('modifiers', modifiers => modifiers.push(modifier))
        );
    }

    //TODO: complements(), such as "the student OF PHYSICS". Complements can't be placed after modifiers (adjuncts)

    flatten(): List {
        var {
            determiner,
            adjectives,
            noun,
            modifiers
        } = this.data;

        // set noun pluralization based off determiner's quantity
        if(noun && determiner) {
            const {quantity} = determiner.data;
            if(quantity != null && quantity != 1 && quantity != -1) {
                noun = noun.plural();
            } else {
                noun = noun.singular();
            }
        }

        return this._flattenChildren([
            determiner,
            adjectives,
            noun,
            modifiers
        ]);
    }
}

const NounPhraseFactory = (noun: NounPhrase|Noun|WordMeta|string): NounPhrase => {
    if(NounPhrase.isNounPhrase(noun)) {
        return noun;
    }
    return new NounPhrase(NounPhraseRecord({
        noun: NounFactory(noun)
    }));
};

export {
    NounPhrase,
    NounPhraseFactory
};
