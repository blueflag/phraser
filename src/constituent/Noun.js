import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
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

    _renderSelf(): string {
        return this.data.plural
            ? this.data.noun + "s" // TODO make this work from a dictionary
            : this.data.noun;
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

}

const NounFactory = (noun: Noun|WordMeta|string): Noun => {
    CheckType(noun, [Noun, WordMeta, "string"]);
    if(Noun.isNoun(noun)) {
        return noun;
    }
    return new Noun(NounRecord({noun}));
};

export {
    Noun,
    NounFactory
};
