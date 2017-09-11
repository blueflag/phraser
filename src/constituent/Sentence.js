import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';

const SentenceRecord = ConstituentRecordFactory({
    sentence: List(),
    after: List(["."])
});

class Sentence extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Sentence");
    }

    static isSentence(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Sentence;
    }

    _clone(...args: any): Sentence {
        return new Sentence(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent> {
        const flattened: List<Constituent> = this._flattenChildren([
            this.data.sentence
        ], context);

        if(flattened.isEmpty()) {
            return flattened;
        }

        return flattened
            .update(0, (item: ?Constituent): ?Constituent => {
                return item.clone({
                    data: item.data.set('first', true)
                });
            });
    }

}

const SentenceFactory = (config: Object) => (...sentence: Consitutent|string): Sentence => {
    return new Sentence(
        SentenceRecord({
            sentence: List(sentence).filter(ii => ii)
        }),
        config
    );
};

export {
    Sentence,
    SentenceFactory
};
