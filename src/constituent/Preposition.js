import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
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

    toList(): List {
        return this.data.preposition
            ? List.of(this.data.preposition)
            : List();
    }
}

const PrepositionFactory = (preposition: Preposition|string): Preposition => {
    CheckType(preposition, [Preposition, "string"]);
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
