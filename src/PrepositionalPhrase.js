import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const PrepositionalPhraseRecord = Record({
    preposition: null, // Preposition
    object: null // Noun|Pronoun|Gerund|Clause
});

class PrepositionalPhrase extends PhraserObject {
    toList(): List {
        return List()
            .concat(this.data.preposition)
            .concat(this.data.object);
    }
}

const PrepositionalPhraseFactory = (preposition: Preposition, object: Noun|Pronoun|Gerund|Clause): PrepositionalPhrase => {
    return new PrepositionalPhrase(PrepositionalPhraseRecord({
        preposition,
        object
    }));
};

export default PrepositionalPhraseFactory;
