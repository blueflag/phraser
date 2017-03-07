import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
import {
    List,
    Record
} from 'immutable';

const AdverbRecord = Record({
    adverb: ""
});

class Adverb extends Constituent {

    static isAdverb(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Adverb;
    }

    _renderSelf(): string {
        return this.data.adverb;
    }
}

const AdverbFactory = (adverb: Adverb|WordMeta|string): Adverb => {
    CheckType(adverb, [Adverb, WordMeta, "string"]);
    if(Adverb.isAdverb(adverb)) {
        return adverb;
    }
    return new Adverb(AdverbRecord({adverb}));
};

export {
    Adverb,
    AdverbFactory
};
