import {List, Map} from 'immutable';
import {Constituent, ConstituentRecordFactory, ArbitraryString} from './Constituent';
import {AdjectiveFactory} from './Adjective';
import {DeterminerFactory} from './Determiner';
import {Series} from './Series';
import {Noun, NounFactory, numberFromQuantity, NUMBER_ENUM, PERSON_ENUM} from './Noun';
import {CheckEnum} from '../decls/TypeErrors';

const NounPhraseRecord = ConstituentRecordFactory({
    noun: null, // Noun|Pronoun|Series
    determiner: null, // Determiner
    adjectives: List(), // List<Adjective>
    modifiers: Map({
        front: List(),
        end: List()
    })
});

class NounPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("NounPhrase");
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

        // if quantity is of type number, set noun pluralization based off determiner's quantity
        if(noun && determiner) {
            const {quantity} = determiner.data;
            if(typeof quantity === "number") {
                context = context.set('number', numberFromQuantity(quantity));
            }
        }

        return this._flattenChildren([
            modifiers.get('front'),
            determiner,
            adjectives,
            noun,
            modifiers.get('end')
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
        if(typeof determiner == "string") {
            determiner = this.data.determiner
                ? this.data.determiner.determiner(determiner)
                : DeterminerFactory(this.config)(determiner);
        }

        return this.clone({
            data: this.data.set('determiner', determiner)
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

    quantity(quantity: number|string): NounPhrase {
        return this.determiner(
            DeterminerFactory(this.config)(this.data.determiner).quantity(quantity)
        );
    }

    possessor(possessor: NounPhrase|string, suffix: string = null): NounPhrase {
        return this.determiner(
            DeterminerFactory(this.config)(this.data.determiner).possessor(possessor, suffix)
        );
    }

    //
    // set plural
    //

    setPlural(plural: string): NounPhrase {
        return this.clone({
            data: this.data.update('noun', noun => noun.setPlural(plural))
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

    numberFromQuantity(quantity: number): NounPhrase {
        return this.clone({
            data: this.data.update('noun', noun => noun.numberFromQuantity(quantity))
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
            data: this.data.update(
                'adjectives',
                adjs => adjs.push(
                    AdjectiveFactory(this.config)(adj)
                )
            )
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

    modifier(modifier: any, position: string): NounPhrase {
        return this._modifier(modifier, position);
    }

    //TODO: complements(), such as "the student OF PHYSICS". Complements can't be placed after modifiers (adjuncts)

}

const NounPhraseFactory = (config: Object) => (noun: NounPhrase|Noun|Series|string|number): NounPhrase => {
    if(NounPhrase.isNounPhrase(noun)) {
        return noun;
    }
    return new NounPhrase(
        NounPhraseRecord({
            noun: Series.isSeries(noun) || ArbitraryString.isArbitraryString(noun)
                ? noun
                : NounFactory(config)(noun)
        }),
        config
    );
};

export {
    NounPhrase,
    NounPhraseFactory
};
