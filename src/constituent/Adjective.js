import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const AdjectiveRecord = ConstituentRecordFactory({
    adjective: ""
});

class Adjective extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Adjective");
    }

    static isAdjective(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Adjective;
    }

    _clone(...args: any): Adjective {
        return new Adjective(...args);
    }

    _renderSelf(): string {
        return this.data.adjective;
    }
}

const AdjectiveFactory = (adjective: Adjective|string): Adjective => {
    CheckType(adjective, ["Adjective", "string"]);
    if(Adjective.isAdjective(adjective)) {
        return adjective;
    }
    return new Adjective(AdjectiveRecord({adjective}));
};

export {
    Adjective,
    AdjectiveFactory
};
