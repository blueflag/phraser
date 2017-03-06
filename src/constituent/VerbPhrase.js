import Constituent from './Constituent';
import {Verb, VerbFactory} from './Verb';
import {AdverbFactory} from './Adverb';

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

    adverb(adv: Adverb|string): VerbPhrase {
        return new VerbPhrase(
            this.data.update('adverbs', advs => advs.push(AdverbFactory(adv)))
        );
    }

    toList(): List {
        return List()
            .concat(this.data.adverbs)
            .concat(this.data.verb)
            .filter(ii => ii);
    }
}

const VerbPhraseFactory = (verb: VerbPhrase|Verb|string): VerbPhrase => {
    if(VerbPhrase.isVerbPhrase(verb)) {
        return verb;
    }
    return new VerbPhrase(VerbPhraseRecord({
        verb: VerbFactory(verb)
    }));
};

export {
    VerbPhrase,
    VerbPhraseFactory
};
