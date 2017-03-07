import Constituent from './Constituent';
import {firstToUpper} from '../utils/String';
import {
    List,
    Record
} from 'immutable';

const SentenceRecord = Record({
    sentence: List()
});

class Sentence extends Constituent {

    static isSentence(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Sentence;
    }

    flatten(): List {
        return this._flattenChildren([
            this.data.sentence
        ]);
    }

    render(): List {
        return super.render()
            .update(0, firstToUpper);
    }

}

const SentenceFactory = (...sentence: Consitutent|string): Sentence => {
    return new Sentence(SentenceRecord({
        sentence: List(sentence)
    }));
};

export {
    Sentence,
    SentenceFactory
};
