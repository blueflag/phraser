import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const AdverbRecord = ConstituentRecordFactory({
    adverb: ""
});

class Adverb extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Adverb");
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

const AdverbFactory = (config: Object) => (adverb: Adverb|string): Adverb => {
    CheckType(adverb, ["Adverb", "string"]);
    if(Adverb.isAdverb(adverb)) {
        return adverb;
    }
    return new Adverb(
        AdverbRecord({adverb}),
        config
    );
};

export {
    Adverb,
    AdverbFactory
};
