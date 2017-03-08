import {Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const PrepositionRecord = Record({
    preposition: ""
});

class Preposition extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Preposition"];
    }

    static isPreposition(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Preposition;
    }

    _renderSelf(): string {
        return this.data.preposition;
    }

}

const PrepositionFactory = (preposition: Preposition|string): Preposition => {
    CheckType(preposition, ["Preposition", "string"]);
    if(Preposition.isPreposition(preposition)) {
        return preposition;
    }
    return new Preposition(PrepositionRecord({preposition}));
};

export {
    Preposition,
    PrepositionFactory
};
