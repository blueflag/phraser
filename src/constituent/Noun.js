import {Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {CheckEnum} from '../decls/TypeErrors';

const NUMBER_ENUM = [
    'plural',
    'singular'
];

const PERSON_ENUM = [
    'first',
    'second',
    'third'
];

const NounRecord = Record({
    noun: "",
    number: "singular",
    person: "third"
});

class Noun extends Constituent {

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
            noun += "s";
        }
        return noun;
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

const NounFactory = (noun: Noun|string): Noun => {
    CheckType(noun, [Noun, "string"]);
    if(Noun.isNoun(noun)) {
        return noun;
    }
    return new Noun(NounRecord({noun}));
};

export {
    Noun,
    NounFactory,
    NUMBER_ENUM,
    PERSON_ENUM
};
