import {List, Record} from 'immutable';
import Constituent from './Constituent';
import {Verb, VerbFactory} from './Verb';
import {AdverbFactory} from './Adverb';

const VerbPhraseRecord = Record({
    verb: null, // Verb
    adverbs: List() // List<Adverb>
});

class VerbPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["VerbPhrase"];
    }

    static isVerbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof VerbPhrase;
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        const {
            tense,
            aspect,
            number,
            person
        } = context.toObject();

        const perfect: boolean = aspect == "perfect" || aspect == "perfectContinuous";

        var auxiliaries = null;

        if(tense == "present" || !tense) {
            if(aspect == "continuous") {
                if(person == "first") {
                    auxiliaries = number == "singular" ? "am" : "are";
                } else if(person == "second") {
                    auxiliaries = "are";
                } else {
                    auxiliaries = number == "singular" ? "is" : "are";
                }
            } else if(perfect) {
                auxiliaries = number == "singular" && person == "third" ? "has" : "have";
            }
        } else if(tense == "past") {
            if(aspect == "continuous") {
                auxiliaries = number == "singular" && person != "second" ? "was" : "were";
            } else if(perfect) {
                auxiliaries = "had";
            }
        } else {
            auxiliaries = tense == "futurePast" ? "would" : "will";
            if(aspect == "continuous") {
                auxiliaries += " be";
            } else if(perfect) {
                auxiliaries += " have";
            }
        }

        if(aspect == "perfectContinuous") {
            auxiliaries += " been";
        }

        return this._flattenChildren([
            auxiliaries,
            this.data.adverbs,
            this.data.verb
        ], context);
    }


    // "quickly" ran
    // jumped "swiftly"
    // TODO adverbs have positions

    adverb(adv: Adverb|string): VerbPhrase {
        return new VerbPhrase(
            this.data.update('adverbs', advs => advs.push(AdverbFactory(adv)))
        );
    }

    adv(adv: Adverb|string): VerbPhrase {
        return this.adverb(adv);
    }
}

const VerbPhraseFactory = (verb: VerbPhrase|Verb|string): VerbPhrase => {
    if(VerbPhrase.isVerbPhrase(verb)) {
        return verb;
    }
    return new VerbPhrase(VerbPhraseRecord({
        verb: VerbFactory()(verb)
    }));
};

export {
    VerbPhrase,
    VerbPhraseFactory
};
