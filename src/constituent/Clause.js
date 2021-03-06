import {List, Map} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {AdjectivePhrase} from './AdjectivePhrase';
import {Adverb, AdverbFactory} from './Adverb';
import {AdverbPhrase} from './AdverbPhrase';
import {Determiner, DeterminerFactory} from './Determiner';
import {NounPhrase} from './NounPhrase';
import {Pronoun, PronounFactory} from './Pronoun';
import {TENSE_ENUM, ASPECT_ENUM} from './Verb';
import {VerbPhrase} from './VerbPhrase';

const ClauseRecord = ConstituentRecordFactory({
    subject: null, // ?NounPhrase
    verb: null, // VerbPhrase
    object: null, // ?Clause|NounPhrase|AdjectivePhrase|string
    whAdverb: null, // AdverbPhrase e.g. when, where, why
    whDeterminer: null, // Determiner e.g. that, which
    whPronoun: null, // Pronoun e.g. who, whom, whose
    modifiers: Map({
        front: List(),
        end: List()
    }),
    tense: "",
    aspect: ""
});

class Clause extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Clause", "Modifier");
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
        context = Map({
            tense,
            aspect
        });

        const flatWh: List<Constituent|string> = this._flattenChildren([
            this.data.modifiers.get('front'),
            this.data.whDeterminer,
            this.data.whAdverb
        ], context, {hasLast: false});

        const flatSubject: List<Constituent|string> = this._flattenChildren([
            this.data.subject
        ], context, {hasFirst: false, hasLast: false});

        var noun = this.getIn(['subject','noun']);
        if(noun) {
            context = context
                .set('number', noun.get('number'))
                .set('person', noun.get('person'));
        }

        const flatPredicate: List<Constituent|string> = this._flattenChildren([
            this.data.verb,
            this.data.object,
            this.data.modifiers.get('end')
        ], context, {hasFirst: false});

        return List()
            .concat(flatWh)
            .concat(flatSubject)
            .concat(flatPredicate);
    }

    // TODO add datives like "Sam gave MARY a present"

    modifier(modifier: any, position: string): NounPhrase {
        return this._modifier(modifier, position);
    }

    whAdverb(whAdverb: Adverb|string): Clause {
        CheckType(whAdverb, ['Adverb', 'string']);
        return this.clone({
            data: this.data
                .set('whAdverb', AdverbFactory(this.config)(whAdverb))
                .set('whDeterminer', '')
                .set('whPronoun', '')
        });
    }

    whDeterminer(whDeterminer: Determiner|string): Clause {
        CheckType(whDeterminer, ['Determiner', 'string']);
        return this.clone({
            data: this.data
                .set('whAdverb', '')
                .set('whDeterminer', DeterminerFactory(this.config)(whDeterminer))
                .set('whPronoun', '')
        });
    }

    whPronoun(whPronoun: Pronoun|string): Clause {
        CheckType(whPronoun, ['Pronoun', 'string']);
        return this.clone({
            data: this.data
                .set('whDeterminer', '')
                .set('whAdverb', '')
                .set('whPronoun', PronounFactory(this.config)(whPronoun))
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

const ClauseFactory = (config: Object) => (
    subjectOrClause: Clause|NounPhrase|AdverbPhrase|Determiner|null,
    verb: VerbPhrase|string,
    object: ?Clause|NounPhrase|AdjectivePhrase
): Clause => {

    if(Clause.isClause(subjectOrClause)) {
        return subjectOrClause;
    }

    CheckType(subjectOrClause, ['NounPhrase', 'AdverbPhrase', 'Determiner', 'Pronoun', 'null']);
    CheckType(verb, ['VerbPhrase']);
    CheckType(object, ['Clause', 'NounPhrase', 'AdjectivePhrase', 'null', 'undefined']);
    object = object || null;

    if(AdverbPhrase.isAdverbPhrase(subjectOrClause)) {
        return new Clause(
            ClauseRecord({
                whAdverb: subjectOrClause,
                verb,
                object
            }),
            config
        );
    }

    if(Determiner.isDeterminer(subjectOrClause)) {
        return new Clause(
            ClauseRecord({
                whDeterminer: subjectOrClause,
                verb,
                object
            }),
            config
        );
    }

    if(Pronoun.isPronoun(subjectOrClause)) {
        return new Clause(
            ClauseRecord({
                whPronoun: subjectOrClause,
                verb,
                object
            }),
            config
        );
    }

    return new Clause(
        ClauseRecord({
            subject: subjectOrClause,
            verb,
            object
        }),
        config
    );
};



export {
    Clause,
    ClauseFactory
};

// TODO - make SubordinateClause and others from http://www.chompchomp.com/terms/clause.htm
