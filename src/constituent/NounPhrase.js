import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {AdjectiveFactory} from './Adjective';
import {DeterminerFactory} from './Determiner';
import {Noun, NounFactory, NUMBER_ENUM, PERSON_ENUM} from './Noun';
import {PrepositionPhrase} from './PrepositionPhrase';
import {CheckType, CheckEnum} from '../decls/TypeErrors';

const NounPhraseRecord = Record({
    noun: null, // Noun|Pronoun
    determiner: null, // Determiner
    adjectives: List(), // List<Adjective>
    modifiers: List() // List<PrepositionPhrase  TODO: |AdjectiveClause|ParticiplePhrase|Infinitive>
});

class NounPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["NounPhrase"];
    }

    //
    // static methods
    //

    static isNounPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof NounPhrase;
    }

    //
    // internal methods
    //

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        var {
            determiner,
            adjectives,
            noun,
            modifiers
        } = this.data;

        // set noun pluralization based off determiner's quantity
        if(noun && determiner) {
            const {quantity} = determiner.data;
            if(quantity != null) {
                context = context.set('number', Math.abs(quantity) != 1 ? "plural" : "singular");
            }
        }

        return this._flattenChildren([
            determiner,
            adjectives,
            noun,
            modifiers
        ], context);
    }

    //
    // determiner
    //

    // "the" dog
    // "a" dog
    // "those" dogs
    // "most" dogs
    // "7" dogs

    determiner(determiner: Determiner|string): NounPhrase {
        return new NounPhrase(
            this.data.set('determiner', DeterminerFactory(determiner)),
            this.lexicon
        );
    }

    det(determiner: Determiner|string): NounPhrase {
        return this.determiner(determiner);
    }

    the(): Determiner {
        return this.determiner('the');
    }

    a(): Determiner {
        return this.determiner('a');
    }

    //
    // noun methods
    //

    number(number: string): NounPhrase {
        CheckEnum(number, NUMBER_ENUM);
        return new NounPhrase(
            this.data.set('noun', this.data.noun.number(number)),
            this.lexicon
        );
    }

    plural(): NounPhrase {
        return this.number('plural');
    }

    singular(): NounPhrase {
        return this.number('singular');
    }

    single(): NounPhrase {
        return this.number('singular');
    }

    //
    // person
    //

    person(person: string): NounPhrase {
        CheckEnum(person, PERSON_ENUM);
        return new NounPhrase(
            this.data.set('noun', this.data.noun.person(person)),
            this.lexicon
        );
    }

    firstPerson(): NounPhrase {
        return this.person('first');
    }

    secondPerson(): NounPhrase {
        return this.person('second');
    }

    thirdPerson(): NounPhrase {
        return this.person('third');
    }

    //
    // adjectives
    //

    // "blue" dog
    // "fat" dog

    adjective(adj: Adjective|string): NounPhrase {
        return new NounPhrase(
            this.data.update('adjectives', adjs => adjs.push(AdjectiveFactory(adj))),
            this.lexicon
        );
    }

    adj(adj: Adjective|string): NounPhrase {
        return this.adjective(adj);
    }

    //
    // modifier
    //

    // dog "in the wild"
    // dog "with no collar"
    // dog "under the house"

    // Be careful which noun phrase has which modifiers
    // YouTube showed that THE CAT played the piano in a blue shirt.
    // YouTube showed THAT THE CAT PLAYED THE PIANO in high definition.
    // YouTube showed that the cat played the PIANO in the living room.
    // from http://allthingslinguistic.com/post/102131750573/how-to-draw-a-syntax-tree-part-8-a-step-by-step

    modifier(modifier: any): NounPhrase {
        CheckType(modifier, ["Modifier"]);
        return new NounPhrase(
            this.data.update('modifiers', modifiers => modifiers.push(modifier))
        );
    }

    //TODO: complements(), such as "the student OF PHYSICS". Complements can't be placed after modifiers (adjuncts)

}

const NounPhraseFactory = (noun: NounPhrase|Noun|string): NounPhrase => {
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
