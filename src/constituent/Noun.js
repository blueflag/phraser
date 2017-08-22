import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';

const NUMBER_ENUM = [
    'plural',
    'singular'
];

const PERSON_ENUM = [
    'first',
    'second',
    'third'
];

const NounRecord = ConstituentRecordFactory({
    noun: "",
    plural: "",
    number: "singular",
    person: "third"
});

const numberFromQuantity = (quantity: number): string => {
    CheckType(quantity, ["number"]);
    return Math.abs(quantity) !== 1 ? "plural" : "singular";
};

class Noun extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Noun");
    }

    static isNoun(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Noun;
    }

    _clone(...args: any): Noun {
        return new Noun(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {

        // override number from context if it exists
        const data: NounRecord = this.data
            .update('number', ownNumber => context.get('number') || ownNumber);

        return this.clone({data});
    }

    _renderSelf(): string {
        var {
            noun,
            plural,
            number,
            person
        } = this.data;

        if(person == "first") {
            return number == "singular" ? "I" : "we";
        }
        if(person == "second") {
            return "you";
        }
        if(number == "plural") {
            noun = plural || `${noun}s`;
        }
        return noun;
    }

    //
    // set plural
    //

    setPlural(plural: string): Noun {
        return this.clone({
            data: this.data.set('plural', plural)
        });
    }

    //
    // number (pluralization)
    //

    number(number: string): Noun {
        CheckEnum(number, NUMBER_ENUM);
        return this.clone({
            data: this.data.set('number', number)
        });
    }

    numberFromQuantity(quantity: number): string {
        return this.number(numberFromQuantity(quantity));
    }

    plural(): Noun {
        return this.number('plural');
    }

    singular(): Noun {
        return this.number('singular');
    }

    single(): Noun {
        return this.number('singular');
    }

    //
    // person
    //

    person(person: string): Noun {
        CheckEnum(person, PERSON_ENUM);
        return this.clone({
            data: this.data.set('person', person)
        });
    }

    firstPerson(): Noun {
        return this.person('first');
    }

    secondPerson(): Noun {
        return this.person('second');
    }

    thirdPerson(): Noun {
        return this.person('third');
    }

}

const NounFactory = (noun: Noun|string|number): Noun => {
    CheckType(noun, [Noun, "string", "number"]);
    if(Noun.isNoun(noun)) {
        return noun;
    }
    return new Noun(NounRecord({
        noun: `${noun}`
    }));
};

export {
    Noun,
    NounFactory,
    numberFromQuantity,
    NUMBER_ENUM,
    PERSON_ENUM
};
