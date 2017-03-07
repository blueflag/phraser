import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Adjective} from './Adjective';
import {Noun, NounFactory} from './Noun';
import {Verb, VerbFactory} from './Verb';
import {AdjectivePhrase, AdjectivePhraseFactory} from './AdjectivePhrase';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {VerbPhrase, VerbPhraseFactory} from './VerbPhrase';
import {
    List,
    Record
} from 'immutable';

const ClauseRecord = Record({
    subject: null, // NounPhrase
    verb: null, // VerbPhrase
    object: null, // ?NounPhrase|AdjectivePhrase|string
    modifiers: List()
});

class Clause extends Constituent {

    static isClause(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Clause;
    }

    // TODO add datives like "Sam gave MARY a present"

    modifier(modifier: PrepositionalPhrase|string): Clause {
        return new Clause(
            this.data.update('modifiers', modifiers => modifiers.push(modifier)) // TODO cast this
        );
    }

    flatten(): List {
        return this._flattenChildren([
            this.data.subject,
            this.data.verb,
            this.data.object,
            this.data.modifiers
        ]);
    }
}

const ClauseFactory = (
    subjectOrClause: Clause|NounPhrase|Noun|string,
    verb: VerbPhrase|Verb|string,
    object: ?NounPhrase|Noun|AdjectivePhrase|Adjective|string
): Clause => {

    if(Clause.isClause(subjectOrClause)) {
        return subjectOrClause;
    }

    // enforce that the object to already has its final type
    CheckType(object, [NounPhrase, AdjectivePhrase, "null", "undefined"]);

    return new Clause(ClauseRecord({
        subject: NounPhraseFactory(subjectOrClause),
        verb: VerbPhraseFactory(verb),
        object: object || null
    }));
};

export {
    Clause,
    ClauseFactory
};

// TODO - make SubordinateClause and others from http://www.chompchomp.com/terms/clause.htm
