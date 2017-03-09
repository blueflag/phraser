import {Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const AdverbRecord = Record({
    adverb: ""
});

class Adverb extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Adverb"];
    }

    static isAdverb(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Adverb;
    }

    _clone(...args: any): Adverb {
        return new Adverb(...args);
    }

    _renderSelf(): string {
        return this.data.adverb;
    }
}

const AdverbFactory = (adverb: Adverb|string): Adverb => {
    CheckType(adverb, ["Adverb", "string"]);
    if(Adverb.isAdverb(adverb)) {
        return adverb;
    }
    return new Adverb(AdverbRecord({adverb}));
};

export {
    Adverb,
    AdverbFactory
};
