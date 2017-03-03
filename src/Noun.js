import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const NounRecord = Record({
    noun: "",
    plural: false,
    amount: undefined, // TODO add this to determiner instead
    determiner: "",
    prepositionalPhrases: List(),
    adjectives: List()
});

class Noun extends PhraserObject {
    determiner(determiner: Determiner): Noun {
        const newNoun: Noun = this.data
            .set('determiner', determiner);

        return new Noun(newNoun);
    }

    adjective(adj: Adjective): Noun {
        const newNoun: Noun = this.data
            .update('adjectives', adjs => adjs.push(adj));

        return new Noun(newNoun);
    }

    plural(): Noun {
        return new Noun(this.data.set('plural', true));
    }

    singular(): Noun {
        return new Noun(this.data.set('plural', false));
    }

    single(): Noun {
        return this.singular();
    }

    amount(amount: number): Noun {
        return new Noun(this.data
            .set('amount', amount)
            .set('plural', amount != 1)
        );
    }

    prepositionalPhrase(prepositionalPhrase: PrepositionalPhrase): Noun {
        const newNoun: Noun = this.data
            .update('prepositionalPhrases', pps => pps.push(prepositionalPhrase));

        return new Noun(newNoun);
    }

    toList(): List {
        const pluralisedNoun = this.data.plural
            ? this.data.noun + "s" // TODO make this work from a dictionary
            : this.data.noun;

        // TODO enable prepositional phrase flipping
        return List()
            .concat(this.data.determiner) // TODO make this work from a dictionary to enforce correct pluralisation, see Determiner
            .push(this.data.amount)
            .concat(this.data.adjectives)
            // TODO this should be an AdjectiveList, or a static method on adjectives that can format them for a list with an "and" in the right spot
            .push(pluralisedNoun)
            .concat(this.data.prepositionalPhrases)
            .filter(ii => ii);
    }
}

const NounFactory = (noun) => {
    return new Noun(NounRecord({noun}));
};

// testing...
NounFactory.lexicon = (nouns) => {
    Noun.lexicon = nouns;
};

export default NounFactory;
