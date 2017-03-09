import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const PunctuationRecord = ConstituentRecordFactory({
    punctuation: ""
});

class Punctuation extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Punctuation"];
    }

    static isPunctuation(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Punctuation;
    }

    _clone(...args: any): Punctuation {
        return new Punctuation(...args);
    }

    _renderSelf(): string {
        return this.data.punctuation;
    }

}

const PunctuationFactory = (punctuation: Punctuation|string): Punctuation => {
    CheckType(punctuation, ["Punctuation", "string"]);
    if(Punctuation.isPunctuation(punctuation)) {
        return punctuation;
    }
    return new Punctuation(PunctuationRecord({punctuation}));
};

export {
    Punctuation,
    PunctuationFactory
};
