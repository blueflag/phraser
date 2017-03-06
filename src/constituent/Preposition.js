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
    toList(): List {
        return this.data.preposition
            ? List.of(this.data.preposition)
            : List();
    }
}

const PrepositionFactory = (preposition: string): Preposition => {
    CheckType(preposition, ["string"]);
    return new Preposition(PrepositionRecord({preposition}));
};

export {
    Preposition,
    PrepositionFactory
};

// DEV: http://www.chompchomp.com/terms/prepositionalphrase.htm
