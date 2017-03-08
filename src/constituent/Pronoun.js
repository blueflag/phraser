import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
import {Record} from 'immutable';

const PronounRecord = Record({
    pronoun: ""
});

class Pronoun extends Constituent {

    static isPronoun(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Pronoun;
    }

    _renderSelf(): string {
        return this.data.pronoun;
    }

}

const PronounFactory = (pronoun: Pronoun|WordMeta|string): Pronoun => {
    CheckType(pronoun, [Pronoun, WordMeta, "string"]);
    if(Pronoun.isPronoun(pronoun)) {
        return pronoun;
    }
    return new Pronoun(PronounRecord({pronoun}));
};

export {
    Pronoun,
    PronounFactory
};
