import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {Adjective, AdjectiveFactory} from './Adjective';
import {CheckType} from '../decls/TypeErrors';

const AdjectivePhraseRecord = ConstituentRecordFactory({
    adjective: null, // Adjective
    modifiers: List()
});

class AdjectivePhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["AdjectivePhrase"];
    }

    static isAdjectivePhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdjectivePhrase;
    }

    _clone(...args: any): AdjectivePhrase {
        return new AdjectivePhrase(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this._flattenChildren([
            this.data.adjective,
            this.data.modifiers
        ], context);
    }

    modifier(modifier: any): Clause {
        CheckType(modifier, ["Modifier"]);
        return this.clone({
            data: this.data.update('modifiers', modifiers => modifiers.push(modifier))
        });
    }
}

const AdjectivePhraseFactory = (adjective: AdjectivePhrase|Adjective|string): AdjectivePhrase => {
    if(AdjectivePhrase.isAdjectivePhrase(adjective)) {
        return adjective;
    }
    return new AdjectivePhrase(AdjectivePhraseRecord({
        adjective: AdjectiveFactory(adjective)
    }));
};

export {
    AdjectivePhrase,
    AdjectivePhraseFactory
};
