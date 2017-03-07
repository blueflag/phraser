import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
import {
    List,
    Record
} from 'immutable';

const PrepositionRecord = Record({
    preposition: ""
});

class Preposition extends Constituent {

    static isPreposition(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Preposition;
    }

    _renderSelf(): string {
        return this.data.preposition;
    }

}

const PrepositionFactory = (preposition: Preposition|WordMeta|string): Preposition => {
    CheckType(preposition, [Preposition, WordMeta, "string"]);
    if(Preposition.isPreposition(preposition)) {
        return preposition;
    }
    return new Preposition(PrepositionRecord({preposition}));
};

export {
    Preposition,
    PrepositionFactory
};

// DEV: http://www.chompchomp.com/terms/prepositionalphrase.htm
