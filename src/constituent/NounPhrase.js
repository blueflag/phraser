import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Noun, NounFactory} from './Noun';

// TODO - validate types on method args!

import {
    List,
    Record
} from 'immutable';

const NounPhraseRecord = Record({
    noun: null, // Noun|Pronoun
    determiner: null, // Determiner
    adjectives: List(), // List<Adjective>
    modifiers: List() // List<PrepositionalPhrase  TODO: |AdjectiveClause|ParticiplePhrase|Infinitive>
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

    determiner(determiner: Determiner|string): NounPhrase {
        return new NounPhrase(
            this.data.set('determiner', determiner)
        );
    }

    // "blue" dog
    // "fat" dog

    adjective(adj: Adjective|string): NounPhrase {
        return new NounPhrase(
            this.data.update('adjectives', adjs => adjs.push(adj))
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

    modifier(modifier: PrepositionalPhrase|ParticiplePhrase|AdjectiveClause|AdverbClause|Infinitive|string): NounPhrase {
        return new NounPhrase(
            this.data.update('modifiers', modifiers => modifiers.push(modifier))
        );
    }

    //TODO: complements(), such as "the student OF PHYSICS". Complements can't be placed after modifiers (adjuncts)

    toList(): List {
        return List()
            .concat(this.data.determiner)
            .concat(this.data.adjectives)
            .concat(this.data.noun)
            .concat(this.data.modifiers)
            .filter(ii => ii);

    }
}

const NounPhraseFactory = (noun: Noun|string) => {
    if(typeof noun == "string") {
        noun = NounFactory(noun);
    }
    CheckType(noun, [Noun]);
    return new NounPhrase(NounPhraseRecord({noun}));
};

export {
    NounPhrase,
    NounPhraseFactory
};
