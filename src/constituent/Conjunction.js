import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const ConjunctionRecord = ConstituentRecordFactory({
    conjunction: ""
});

class Conjunction extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Conjunction");
    }

    static isConjunction(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Conjunction;
    }

    _clone(...args: any): Conjunction {
        return new Conjunction(...args);
    }

    _renderSelf(): string {
        return this.data.conjunction;
    }

}

const ConjunctionFactory = (config: Object) => (conjunction: Conjunction|string): Conjunction => {
    CheckType(conjunction, ["Conjunction", "string"]);
    if(Conjunction.isConjunction(conjunction)) {
        return conjunction;
    }
    return new Conjunction(
        ConjunctionRecord({conjunction}),
        config
    );
};

export {
    Conjunction,
    ConjunctionFactory
};
