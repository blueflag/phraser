import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const PrepositionRecord = ConstituentRecordFactory({
    preposition: ""
});

class Preposition extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Preposition");
    }

    static isPreposition(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Preposition;
    }

    _clone(...args: any): Preposition {
        return new Preposition(...args);
    }

    _renderSelf(): string {
        return this.data.preposition;
    }

}

const PrepositionFactory = (config: Object) => (preposition: Preposition|string): Preposition => {
    CheckType(preposition, ["Preposition", "string"]);
    if(Preposition.isPreposition(preposition)) {
        return preposition;
    }
    return new Preposition(
        PrepositionRecord({preposition}),
        config
    );
};

export {
    Preposition,
    PrepositionFactory
};
