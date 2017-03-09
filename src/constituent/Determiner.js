import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';

const DeterminerRecord = ConstituentRecordFactory({
    determiner: "",
    quantity: null
});

class Determiner extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["Determiner"];
    }

    static isDeterminer(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Determiner;
    }

    _clone(...args: any): Determiner {
        return new Determiner(...args);
    }

    _renderSelf(): List {
        return List()
            .push(this.data.determiner)
            .push(this.data.quantity != null
                ? this.data.quantity + ""
                : null
            )
            .filter(ii => ii);
    }

    quantity(quantity: number): Determiner {
        CheckType(quantity, ["number"]);
        return this.clone({
            data: this.data.set('quantity', quantity)
        });
    }
}

const DeterminerFactory = (determiner: Determiner|string): Determiner => {
    CheckType(determiner, [Determiner, "string"]);
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
