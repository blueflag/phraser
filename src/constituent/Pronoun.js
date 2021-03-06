import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const PronounRecord = ConstituentRecordFactory({
    pronoun: ""
});

class Pronoun extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Pronoun", "Noun");
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

const PronounFactory = (config: Object) => (pronoun: Pronoun|string): Pronoun => {
    CheckType(pronoun, ["Pronoun", "string"]);
    if(Pronoun.isPronoun(pronoun)) {
        return pronoun;
    }
    return new Pronoun(
        PronounRecord({pronoun}),
        config
    );
};

export {
    Pronoun,
    PronounFactory
};
