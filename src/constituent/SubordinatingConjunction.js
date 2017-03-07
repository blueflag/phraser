import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
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

    _renderSelf(): string {
        return this.data.conjunction;
    }

}

const SubordinatingConjunctionFactory = (conjunction: SubordinatingConjunction|WordMeta|string): SubordinatingConjunction => {
    CheckType(conjunction, [SubordinatingConjunction, WordMeta, "string"]);
    if(SubordinatingConjunction.isSubordinatingConjunction(conjunction)) {
        return conjunction;
    }
    return new SubordinatingConjunction(SubordinatingConjunctionRecord({conjunction}));
};

export {
    SubordinatingConjunction,
    SubordinatingConjunctionFactory
};
