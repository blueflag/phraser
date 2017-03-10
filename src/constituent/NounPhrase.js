import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {AdjectiveFactory} from './Adjective';
import {DeterminerFactory} from './Determiner';
import {Noun, NounFactory, NUMBER_ENUM, PERSON_ENUM} from './Noun';
import {CheckType, CheckEnum} from '../decls/TypeErrors';

const NounPhraseRecord = ConstituentRecordFactory({
    noun: null, // Noun|Pronoun
    determiner: null, // Determiner
    adjectives: List(), // List<Adjective>
    modifiers: List() // List<PrepositionPhrase>
});

class NounPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["NounPhrase"];
    }

    static isNounPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof NounPhrase;
    }

    _clone(...args: any): NounPhrase {
        return new NounPhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        var {
            determiner,
            adjectives,
            noun,
            modifiers
        } = this.data;

        // never use person or number from context
        context = context
            .delete('person')
            .delete('number');

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
        return this.clone({
            data: this.data.set('determiner', DeterminerFactory(determiner))
        });
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

    quantity(quantity: number): NounPhrase {
        if(!this.data.determiner) {
            return this.determiner(DeterminerFactory("").quantity(quantity));
        }
        return this.clone({
            data: this.data.update('determiner', det => det.quantity(quantity))
        });
    }

    //
    // noun methods
    //

    number(number: string): NounPhrase {
        CheckEnum(number, NUMBER_ENUM);
        return this.clone({
            data: this.data.update('noun', noun => noun.number(number))
        });
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
        return this.clone({
            data: this.data.update('noun', noun => noun.person(person))
        });
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
        return this.clone({
            data: this.data.update('adjectives', adjs => adjs.push(AdjectiveFactory(adj)))
        });
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

    modifier(modifier: any): NounPhrase {
        CheckType(modifier, ["Modifier"]);
        return this.clone({
            data: this.data.update('modifiers', modifiers => modifiers.push(modifier))
        });
    }

    //TODO: complements(), such as "the student OF PHYSICS". Complements can't be placed after modifiers (adjuncts)

}

const NounPhraseFactory = (noun: NounPhrase|Noun|string|number): NounPhrase => {
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
