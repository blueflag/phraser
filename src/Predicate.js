import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const PredicateRecord = Record({
    verb: null, // Verb
    something: null // ???
});

class Predicate extends PhraserObject {
    toList(): List {
        return List()
            .concat(this.data.verb.toList())
            .concat(this.data.something
                ? this.data.something.toList()
                : List()
            );
    }
}

const PredicateFactory = (verb: Verb, something: any) => new Predicate(PredicateRecord({verb, something}));

export default PredicateFactory;
