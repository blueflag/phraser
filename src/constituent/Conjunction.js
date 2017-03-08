import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
import {Record} from 'immutable';

const ConjunctionRecord = Record({
    conjunction: ""
});

class Conjunction extends Constituent {

    static isConjunction(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Conjunction;
    }

    _renderSelf(): string {
        return this.data.conjunction;
    }

}

const ConjunctionFactory = (conjunction: Conjunction|WordMeta|string): Conjunction => {
    CheckType(conjunction, [Conjunction, WordMeta, "string"]);
    if(Conjunction.isConjunction(conjunction)) {
        return conjunction;
    }
    return new Conjunction(ConjunctionRecord({conjunction}));
};

export {
    Conjunction,
    ConjunctionFactory
};
