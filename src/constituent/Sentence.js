import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';

const SentenceRecord = ConstituentRecordFactory({
    sentence: List(),
    after: List(["."])
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

    _flattenSelf(context: Map<string, any>): List<Constituent> {
        return this._flattenChildren([
            this.data.sentence
        ], context)
            .update(0, (item: Constituent): Constituent => {
                return item.clone({
                    data: item.data.set('first', true)
                });
            });
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
