import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    List,
    Record
} from 'immutable';

const SubordinatingConjunctionRecord = Record({
    conjunction: ""
});

class SubordinatingConjunction extends Constituent {

    static isSubordinatingConjunction(obj: any): boolean {
        return typeof obj == "object" && obj instanceof SubordinatingConjunction;
    }

    toList(): List {
        return List()
            .push(this.data.conjunction);
    }
}

const SubordinatingConjunctionFactory = (conjunction: SubordinatingConjunction|string): SubordinatingConjunction => {
    CheckType(conjunction, [SubordinatingConjunction, "string"]);
    if(SubordinatingConjunction.isSubordinatingConjunction(conjunction)) {
        return conjunction;
    }
    return new SubordinatingConjunction(SubordinatingConjunctionRecord({conjunction}));
};

export {
    SubordinatingConjunction,
    SubordinatingConjunctionFactory
};
