import {Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const PronounRecord = Record({
    pronoun: ""
});

class Pronoun extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Pronoun", "Noun"];
    }

    static isPronoun(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Pronoun;
    }

    _clone(...args: any): Pronoun {
        return new Pronoun(...args);
    }

    _renderSelf(): string {
        return this.data.pronoun;
    }

}

const PronounFactory = (pronoun: Pronoun|string): Pronoun => {
    CheckType(pronoun, ["Pronoun", "string"]);
    if(Pronoun.isPronoun(pronoun)) {
        return pronoun;
    }
    return new Pronoun(PronounRecord({pronoun}));
};

export {
    Pronoun,
    PronounFactory
};
