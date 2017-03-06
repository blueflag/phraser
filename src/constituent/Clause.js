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
            this.data.update('modifiers', modifiers => modifiers.push(modifier))
        );
    }

    toList(): List {
        const object = typeof this.data.object == "string"
            ? List(this.data.object)
            : this.data.object;

        return List()
            .concat(this.data.subject || List())
            .concat(this.data.verb || List())
            .concat(object)
            .concat(this.data.modifiers)
            .filter(ii => ii);
    }
}

const ClauseFactory = (
    subject: NounPhrase|Noun|string,
    verb: VerbPhrase|Verb|string,
    object: ?NounPhrase|Noun|AdjectivePhrase|Adjective|string
): Clause => {

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

    CheckType(subject, [NounPhrase]);
    CheckType(verb, [VerbPhrase]);
    CheckType(object, [NounPhrase, AdjectivePhrase, "undefined"]);
    return new Clause(ClauseRecord({subject, verb, object}));
};

export {
    Clause,
    ClauseFactory
};

// TODO - make SubordinateClause and others from http://www.chompchomp.com/terms/clause.htm
