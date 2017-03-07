import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {WordMeta} from './WordMeta';
import {
    List,
    Record
} from 'immutable';

const DeterminerRecord = Record({
    determiner: ""
});

class Determiner extends Constituent {

    static isDeterminer(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Determiner;
    }

    _renderSelf(): string {
        return this.data.determiner;
    }
}

const DeterminerFactory = (determiner: Determiner|WordMeta|string): Determiner => {
    CheckType(determiner, [Determiner, WordMeta, "string"]);
    if(Determiner.isDeterminer(determiner)) {
        return determiner;
    }
    return new Determiner(DeterminerRecord({determiner}));
};

export {
    Determiner,
    DeterminerFactory
};

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
