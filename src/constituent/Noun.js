import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    List,
    Record
} from 'immutable';

const NounRecord = Record({
    noun: "",
    plural: false
});

class Noun extends Constituent {

    static isNoun(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Noun;
    }

    plural(): Noun {
        return new Noun(this.data.set('plural', true));
    }

    singular(): Noun {
        return new Noun(this.data.set('plural', false));
    }

    single(): Noun {
        return this.singular();
    }

    toList(): List {
        const isPlural = this.data.plural;

        const pluralisedNoun = isPlural
            ? this.data.noun + "s" // TODO make this work from a dictionary
            : this.data.noun;

        // TODO enable prepositional phrase flipping
        return List()
            .push(pluralisedNoun);
    }
}

const NounFactory = (noun: string): Noun => {
    CheckType(noun, ["string"]);
    return new Noun(NounRecord({noun}));
};

export {
    Noun,
    NounFactory
};
