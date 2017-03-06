import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Verb, VerbFactory} from './Verb';

import {
    List,
    Record
} from 'immutable';

const VerbPhraseRecord = Record({
    verb: null, // Verb
    adverbs: List() // List<Adverb>
});

class VerbPhrase extends Constituent {

    static isVerbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof VerbPhrase;
    }

    // "quickly" ran
    // jumped "swiftly"
    // TODO adverbs have positions

    adverb(adj: Adverb|string): VerbPhrase {
        return new VerbPhrase(
            this.data.update('adverbs', adjs => adjs.push(adj))
        );
    }

    toList(): List {
        return List()
            .concat(this.data.adverbs)
            .concat(this.data.verb)
            .filter(ii => ii);
    }
}

const VerbPhraseFactory = (verb: Verb|string) => {
    if(typeof verb == "string") {
        verb = VerbFactory(verb);
    }
    CheckType(verb, [Verb]);
    return new VerbPhrase(VerbPhraseRecord({verb}));
};

export {
    VerbPhrase,
    VerbPhraseFactory
};
