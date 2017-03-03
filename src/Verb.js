import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const VerbRecord = Record({
    verb: ""
});

class Verb extends PhraserObject {
    toList(): List {
        return List()
            .push(this.data.verb);
    }
}

const VerbFactory = (verb: Verb) => new Verb(VerbRecord({verb}));

export default VerbFactory;
