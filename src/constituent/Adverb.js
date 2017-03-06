import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
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

    toList(): List {
        return List()
            .push(this.data.adverb);
    }
}

const AdverbFactory = (adverb: Adverb|string): Adverb => {
    CheckType(adverb, [Adverb, "string"]);
    if(Adverb.isAdverb(adverb)) {
        return adverb;
    }
    return new Adverb(AdverbRecord({adverb}));
};

export {
    Adverb,
    AdverbFactory
};
