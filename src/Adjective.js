import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const AdjectiveRecord = Record({
    adjective: ""
});

class Adjective extends PhraserObject {
    toList(): List {
        return List()
            .push(this.data.adjective);
    }
}

const AdjectiveFactory = (adjective: string) => new Adjective(AdjectiveRecord({adjective}));

export default AdjectiveFactory;
