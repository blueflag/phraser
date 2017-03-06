import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {Adjective} from './Adjective';
import {AdjectivePhrase, AdjectivePhraseFactory} from './AdjectivePhrase';
import {Noun, NounFactory} from './Noun';
import {NounPhrase, NounPhraseFactory} from './NounPhrase';
import {SubordinatingConjunction, SubordinatingConjunctionFactory} from './SubordinatingConjunction';
import {Verb, VerbFactory} from './Verb';
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
            this.data.update('modifiers', modifiers => modifiers.push(modifier))
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
    conjunction: SubordinatingConjunction|string,
    subject: ?NounPhrase|Noun|string,
    verb: ?VerbPhrase|Verb|string,
    object: ?NounPhrase|Noun|AdjectivePhrase|Adjective|string
): AdverbClause => {

    if(typeof conjunction == "string") {
        conjunction = SubordinatingConjunctionFactory(conjunction);
    }
    if(typeof subject == "string") {
        subject = NounFactory(subject);
    }
    if(Noun.isNoun(subject)) {
        subject = NounPhraseFactory(subject);
    }
    if(typeof verb == "string") {
        verb = VerbFactory(verb);
    }
    if(Verb.isVerb(verb)) {
        verb = VerbPhraseFactory(verb);
    }
    if(object) {
        if(Noun.isNoun(object)) {
            object = NounPhraseFactory(object);
        }
        if(Adjective.isAdjective(object)) {
            object = AdjectivePhraseFactory(object);
        }
    }

    CheckType(conjunction, [SubordinatingConjunction]);
    CheckType(subject, [NounPhrase, "null"]);
    CheckType(verb, [VerbPhrase, "null"]);
    CheckType(object, [NounPhrase, AdjectivePhrase, "undefined"]);

    return new AdverbClause(AdverbClauseRecord({
        conjunction,
        subject,
        verb,
        object
    }));
};

export {
    AdverbClause,
    AdverbClauseFactory
};

// TODO - make SubordinateAdverbClause and others from http://www.chompchomp.com/terms/clause.htm
