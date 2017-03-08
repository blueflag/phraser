import {Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';

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

const VerbRecord = Record({
    verb: "",
    tense: "", // blank so this is an infinitive by default
    aspect: "simple",
    number: "singular",
    person: "third"
});

class Verb extends Constituent {

    static isVerb(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Verb;
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
            this.lexicon
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

        //console.log(this.lexicon);

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
        return new Verb(
            this.data.set('tense', tense),
            this.lexicon
        );
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
        return new Verb(
            this.data.set('aspect', aspect),
            this.lexicon
        );
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

}

const VerbFactory = (lexicon: Object) => (verb: Verb|WordMeta|string): Verb => {
    CheckType(verb, [Verb, WordMeta, "string"]);
    if(verb instanceof Verb) {
        return verb;
    }
    return new Verb(VerbRecord({verb}), lexicon);
};

export {
    Verb,
    VerbFactory,
    TENSE_ENUM,
    ASPECT_ENUM
};
