import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {firstToUpper} from '../utils/String';

const SentenceRecord = Record({
    sentence: List()
});

class Sentence extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Sentence"];
    }

    static isSentence(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Sentence;
    }

    _clone(...args: any): Sentence {
        return new Sentence(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.sentence,
            "."
        ], context);
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
