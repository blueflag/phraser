import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {numberFromQuantity, NUMBER_ENUM, PERSON_ENUM} from './Noun';

const TENSE_ENUM = [
    'past',
    'present',
    'future',
    'futurePast'
];

const ASPECT_ENUM = [
    'simple',
    'continuous',
    'perfect',
    'perfectContinuous'
];

const VerbRecord = ConstituentRecordFactory({
    verb: "",
    tense: "", // blank so this is an infinitive by default
    aspect: "simple",
    number: "singular",
    person: "third"
});

class Verb extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Verb");
    }

    static isVerb(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Verb;
    }

    _clone(...args: any): Verb {
        return new Verb(...args);
    }

    _flattenSelf(context: Map<string, any>): List {

        // override tense and aspect from context if it exists
        const data: VerbRecord = this.data
            .update('tense', ownTense => context.get('tense') || ownTense)
            .update('aspect', ownAspect => context.get('aspect') || ownAspect)
            .update('number', ownNumber => context.get('number') || ownNumber)
            .update('person', ownPerson => context.get('person') || ownPerson);

        return new Verb(
            data,
            this.config
        );
    }

    _renderSelf(): string {
        var {
            verb,
            tense,
            aspect,
            number,
            person
        } = this.data;

        //console.log(this.config);

        if(aspect == "continuous" || aspect == "perfectContinuous") {
            verb += "ing";
        } else if(aspect == "perfect" || tense == "past") {
            verb += "ed";
        } else if(aspect == "simple") {
            if(number == "singular" && person == "third" && tense == "present") {
                verb += "s";
            }
        }

        return verb;
    }

    //
    // tense
    //

    tense(tense: string): Verb {
        CheckEnum(tense, TENSE_ENUM);
        return this.clone({
            data: this.data.set('tense', tense)
        });
    }

    past(): Verb {
        return this.tense('past');
    }

    present(): Verb {
        return this.tense('present');
    }

    future(): Verb {
        return this.tense('future');
    }

    futurePast(): Verb {
        return this.tense('futurePast');
    }

    //
    // aspect
    //

    aspect(aspect: string): Verb {
        CheckEnum(aspect, ASPECT_ENUM);
        return this.clone({
            data: this.data.set('aspect', aspect)
        });
    }

    simple(): Verb {
        return this.aspect('simple');
    }

    continuous(): Verb {
        return this.aspect('continuous');
    }

    perfect(): Verb {
        return this.aspect('perfect');
    }

    perfectContinuous(): Verb {
        return this.aspect('perfectContinuous');
    }

    //
    // number
    //

    number(number: string): NounPhrase {
        CheckEnum(number, NUMBER_ENUM);
        return this.clone({
            data: this.data.set('number', number)
        });
    }

    numberFromQuantity(quantity: number): NounPhrase {
        return this.clone({
            data: this.data.set('number', numberFromQuantity(quantity))
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
            data: this.data.set('person', person)
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

}

const VerbFactory = (config: Object) => (verb: Verb|string): Verb => {
    CheckType(verb, ["Verb", "string"]);
    if(verb instanceof Verb) {
        return verb;
    }
    return new Verb(
        VerbRecord({verb}),
        config
    );
};

export {
    Verb,
    VerbFactory,
    TENSE_ENUM,
    ASPECT_ENUM
};
