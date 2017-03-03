import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const ClauseRecord = Record({
    subject: null,
    predicates: List(),
    prepositionalPhrases: List()
});

class Clause extends PhraserObject {

    prepositionalPhrase(prepositionalPhrase: PrepositionalPhrase): Clause {
        const newClause: Noun = this.data
            .update('prepositionalPhrases', pps => pps.push(prepositionalPhrase));

        return new Clause(newClause);
    }

    toList(): List {
        // TODO enable prepositional phrase flipping
        return List()
            .concat(this.data.subject)
            .concat(this.data.predicates) // TODO needs to make a proper sentence list
            .concat(this.data.prepositionalPhrases);
    }
}

// TODO unsudre if multiple predicates should be allowed in, or whether they must be inserted into a Join first
const ClauseFactory = (subject: Noun, ...predicates: Predicate): Clause => {
    const predicatesList: List = List.isList(predicates)
        ? predicates
        : List(predicates);

    return new Clause(ClauseRecord({
        subject,
        predicates: predicatesList
    }));
};

export default ClauseFactory;
