import {List, Map} from 'immutable';
import {Constituent, ConstituentRecordFactory, ArbitraryString} from './Constituent';
import {Verb, VerbFactory} from './Verb';
import {AdverbFactory} from './Adverb';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {Series} from './Series';

const ADVERB_POSITION_ENUM = [
    "middle",
    "end"
];

const VerbPhraseRecord = ConstituentRecordFactory({
    verb: null, // Verb
    object: null, // ?Clause|NounPhrase|AdjectivePhrase|string
    adverbs: Map({
        middle: List(),
        end: List()
    })
});

class VerbPhrase extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("VerbPhrase");
    }

    static isVerbPhrase(obj: any): boolean {
        return typeof obj == "object" && obj instanceof VerbPhrase;
    }

    _clone(...args: any): VerbPhrase {
        return new VerbPhrase(...args);
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
            this.data.adverbs.get('middle'),
            this.data.verb,
            this.data.object,
            this.data.adverbs.get('end')
        ], context);
    }

    // "quickly" ran
    // jumped "swiftly"

    adverb(adv: Adverb|string, position: string = "end"): VerbPhrase {
        CheckType(position, ['string']);
        CheckEnum(position, ADVERB_POSITION_ENUM);
        return this.clone({
            data: this.data.updateIn(
                ['adverbs', position],
                advs => advs.push(
                    AdverbFactory(this.config)(adv)
                )
            )
        });
    }

    adv(adv: Adverb|string): VerbPhrase {
        return this.adverb(adv);
    }
}

const VerbPhraseFactory = (config: Object) => (
    verb: VerbPhrase|Verb|string,
    object: ?Clause|NounPhrase|AdjectivePhrase
): VerbPhrase => {

    if(VerbPhrase.isVerbPhrase(verb)) {
        return verb;
    }

    CheckType(object, ['Clause', 'NounPhrase', 'AdjectivePhrase', 'null', 'undefined']);
    object = object || null;

    return new VerbPhrase(
        VerbPhraseRecord({
            verb: Series.isSeries(verb) || ArbitraryString.isArbitraryString(verb)
                ? verb
                : VerbFactory(config)(verb),
            object
        }),
        config
    );
};

export {
    VerbPhrase,
    VerbPhraseFactory,
    ADVERB_POSITION_ENUM
};
