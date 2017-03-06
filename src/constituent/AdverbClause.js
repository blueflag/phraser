import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Adjective} from './Adjective';
import {AdjectivePhrase} from './AdjectivePhrase';
import {Noun} from './Noun';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {SubordinatingConjunction, SubordinatingConjunctionFactory} from './SubordinatingConjunction';
import {Verb} from './Verb';
import {VerbPhrase, VerbPhraseFactory} from './VerbPhrase';
import {
    List,
    Record
} from 'immutable';

const AdverbClauseRecord = Record({
    conjunction: "", // SubordinatingConjunction
    subject: null, // NounPhrase
    verb: null, // VerbPhrase
    object: null, // ?NounPhrase|AdjectivePhrase|string
    modifiers: List()
});

class AdverbClause extends Constituent {

    static isAdverbClause(obj: any): boolean {
        return typeof obj == "object" && obj instanceof AdverbClause;
    }

    // TODO add datives like "Sam gave MARY a present"

    modifier(modifier: PrepositionalPhrase|string): AdverbClause {
        return new AdverbClause(
            this.data.update('modifiers', modifiers => modifiers.push(modifier)) // TODO cast this
        );
    }

    toList(): List {
        const object = typeof this.data.object == "string"
            ? List(this.data.object)
            : this.data.object;

        return List()
            .push(this.data.conjunction)
            .concat(this.data.subject || List())
            .concat(this.data.verb || List())
            .concat(object)
            .concat(this.data.modifiers)
            .filter(ii => ii);
    }
}

const AdverbClauseFactory = (
    conjunctionOrAdvClause: AdverbClause|SubordinatingConjunction|string,
    subject: ?NounPhrase|Noun|string,
    verb: ?VerbPhrase|Verb|string,
    object: ?NounPhrase|Noun|AdjectivePhrase|Adjective|string
): AdverbClause => {

    if(AdverbClause.isAdverbClause(conjunctionOrAdvClause)) {
        return conjunctionOrAdvClause;
    }

    // enforce that the object to already has its final type
    CheckType(object, [NounPhrase, AdjectivePhrase, "null", "undefined"]);

    return new AdverbClause(AdverbClauseRecord({
        conjunction: SubordinatingConjunctionFactory(conjunctionOrAdvClause),
        subject: subject && NounPhraseFactory(subject),
        verb: verb && VerbPhraseFactory(verb),
        object: object || null
    }));
};

export {
    AdverbClause,
    AdverbClauseFactory
};

// TODO - make SubordinateAdverbClause and others from http://www.chompchomp.com/terms/clause.htm
