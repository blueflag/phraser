import PhraserObject from './PhraserObject';
import {
    List,
    Record
} from 'immutable';

const DeterminerRecord = Record({
    determiner: ""
    // TODO needs sense of pluralisation
});

class Determiner extends PhraserObject {
    toList(): List {
        return this.data.determiner
            ? List.of(this.data.determiner)
            : List();
    }
}

const DeterminerFactory = (determiner: Determiner) => new Determiner(DeterminerRecord({determiner}));

export default DeterminerFactory;

/*
Definite article : the
Indefinite articles : a, an
Demonstratives: this, that, these, those
Pronouns and possessive determiners : my, your, his, her, its, our, their
Quantifiers : a few, a little, much, many, a lot of, most, some, any, enough
Numbers : one, ten, thirty
Distributives : all, both, half, either, neither, each, every
Difference words : other, another
Pre-determiners : such, what, rather, quite
*/
