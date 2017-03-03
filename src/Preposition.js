import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const PreopositionRecord = Record({
    preposition: ""
});

class Preoposition extends PhraserObject {
    toList(): List {
        return this.data.preposition
            ? List.of(this.data.preposition)
            : List();
    }
}

const PreopositionFactory = (preposition: Preoposition) => new Preoposition(PreopositionRecord({preposition}));

export default PreopositionFactory;

// DEV: http://www.chompchomp.com/terms/prepositionalphrase.htm
