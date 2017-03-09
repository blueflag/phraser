import {List, Map, Record} from 'immutable';
import Constituent from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {Adjective} from './Adjective';
import {AdjectivePhrase} from './AdjectivePhrase';
import {Adverb, AdverbFactory} from './Adverb';
import {Determiner, DeterminerFactory} from './Determiner';
import {Noun} from './Noun';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {Pronoun, PronounFactory} from './Pronoun';
import {Verb, TENSE_ENUM, ASPECT_ENUM} from './Verb';
import {VerbPhrase, VerbPhraseFactory} from './VerbPhrase';

const ClauseRecord = Record({
    subject: null, // ?NounPhrase
    verb: null, // VerbPhrase
    object: null, // ?Clause|NounPhrase|AdjectivePhrase|string
    modifiers: List(),
    whAdverb: "", // e.g. when, where, why
    whDeterminer: "", // e.g. that, which
    whPronoun: "", // e.g. who, whom, whose
    tense: "",
    aspect: ""
});

class Clause extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Clause", "Modifier"];
    }

    static isClause(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Clause;
    }

    _clone(...args: any): Clause {
        return new Clause(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        const {
            tense,
            aspect
        } = this.data;

        // this is a new clause with its own context
        // tense should default to the tense provided through context
        context = Map({
            tense: tense || context.get('tense'),
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
        CheckType(modifier, ["Modifier"]);
        return this.clone({
            data: this.data.update('modifiers', modifiers => modifiers.push(modifier))
        });
    }

    whAdverb(whAdverb: Adverb|string): Clause {
        CheckType(whAdverb, ['Adverb', 'string']);
        return this.clone({
            data: this.data
                .set('whAdverb', AdverbFactory(whAdverb))
                .set('whDeterminer', '')
                .set('whPronoun', '')
        });
    }

    whDeterminer(whDeterminer: Determiner|string): Clause {
        CheckType(whDeterminer, ['Determiner', 'string']);
        return this.clone({
            data: this.data
                .set('whAdverb', '')
                .set('whDeterminer', DeterminerFactory(whDeterminer))
                .set('whPronoun', '')
        });
    }

    whPronoun(whPronoun: Pronoun|string): Clause {
        CheckType(whPronoun, ['Pronoun', 'string']);
        return this.clone({
            data: this.data
                .set('whDeterminer', '')
                .set('whAdverb', '')
                .set('whPronoun', PronounFactory(whPronoun))
        });
    }

    tense(tense: string): Clause {
        CheckEnum(tense, TENSE_ENUM);
        return this.clone({
            data: this.data.set('tense', tense)
        });
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
    subjectOrClause: Clause|NounPhrase|Noun|string|null,
    verb: VerbPhrase|Verb|string,
    object: ?Clause|NounPhrase|Noun|AdjectivePhrase|Adjective
): Clause => {

    if(Clause.isClause(subjectOrClause)) {
        return subjectOrClause;
    }

    // enforce that the object to already has its final type
    CheckType(object, ['NounPhrase', 'AdjectivePhrase', "null", "undefined"]);

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
