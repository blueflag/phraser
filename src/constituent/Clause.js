import {List, Map, Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {Adjective} from './Adjective';
import {Noun} from './Noun';
import {Verb, TENSE_ENUM, ASPECT_ENUM} from './Verb';
import {AdjectivePhrase} from './AdjectivePhrase';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {VerbPhrase, VerbPhraseFactory} from './VerbPhrase';
import {WordMeta} from './WordMeta';

const ClauseRecord = Record({
    subject: null, // ?NounPhrase
    verb: null, // VerbPhrase
    object: null, // ?Clause|NounPhrase|AdjectivePhrase|string
    modifiers: List(),
    whAdverb: "",
    whDeterminer: "",
    tense: "",
    aspect: ""
});

class Clause extends Constituent {

    static isClause(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Clause;
    }

    _flattenSelf(context: Map<string, any>): List {
        const {
            tense,
            aspect
        } = this.data;

        // replace context with own, as this is a new clause with its own context
        context = Map({
            tense,
            aspect
        });

        const flatWh: List<Constituent|string> = this._flattenChildren([
            this.data.whDeterminer,
            this.data.whAdverb
        ], context);

        const flatSubject: List<Constituent|string> = this._flattenChildren([
            this.data.subject
        ], context);

        flatSubject
            .filter(ii => Noun.isNoun(ii))
            .forEach((ii: Constituent|string) => {
                context = context
                    .set('number', ii.data.number)
                    .set('person', ii.data.person);
            });

        const flatPredicate: List<Constituent|string> = this._flattenChildren([
            this.data.verb,
            this.data.object,
            this.data.modifiers
        ], context);

        return List()
            .concat(flatWh)
            .concat(flatSubject)
            .concat(flatPredicate);
    }

    // TODO add datives like "Sam gave MARY a present"

    modifier(modifier: PrepositionalPhrase|string): Clause {
        return new Clause(
            this.data.update('modifiers', modifiers => modifiers.push(modifier)) // TODO cast this
        );
    }

    whAdverb(whAdverb: string): Clause {
        CheckType(whAdverb, ['string']);
        return new Clause(
            this.data
                .set('whAdverb', whAdverb)
                .set('whDeterminer', '')
        );
    }

    whDeterminer(whDeterminer: string): Clause {
        CheckType(whDeterminer, ['string']);
        return new Clause(
            this.data
                .set('whDeterminer', whDeterminer)
                .set('whAdverb', '')
        );
    }

    tense(tense: string): Clause {
        CheckEnum(tense, TENSE_ENUM);
        return new Clause(
            this.data.set('tense', tense),
            this.lexicon
        );
    }

    past(): Clause {
        return this.tense('past');
    }

    present(): Clause {
        return this.tense('present');
    }

    future(): Clause {
        return this.tense('future');
    }

    futurePast(): Clause {
        return this.tense('futurePast');
    }

    aspect(aspect: string): Clause {
        CheckEnum(aspect, ASPECT_ENUM);
        return new Clause(
            this.data.set('aspect', aspect),
            this.lexicon
        );
    }

    simple(): Clause {
        return this.aspect('simple');
    }

    continuous(): Clause {
        return this.aspect('continuous');
    }

    perfect(): Clause {
        return this.aspect('perfect');
    }

    perfectContinuous(): Clause {
        return this.aspect('perfectContinuous');
    }
}

const ClauseFactory = (
    subjectOrClause: Clause|NounPhrase|Noun|WordMeta|string|null,
    verb: VerbPhrase|Verb|WordMeta|string,
    object: ?Clause|NounPhrase|Noun|AdjectivePhrase|Adjective
): Clause => {

    if(Clause.isClause(subjectOrClause)) {
        return subjectOrClause;
    }

    // enforce that the object to already has its final type
    CheckType(object, [NounPhrase, AdjectivePhrase, "null", "undefined"]);

    return new Clause(ClauseRecord({
        subject: subjectOrClause && NounPhraseFactory(subjectOrClause),
        verb: VerbPhraseFactory(verb),
        object: object || null
    }));
};

export {
    Clause,
    ClauseFactory
};

// TODO - make SubordinateClause and others from http://www.chompchomp.com/terms/clause.htm
