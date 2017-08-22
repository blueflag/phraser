import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {NounPhraseFactory} from './NounPhrase';

const DeterminerRecord = ConstituentRecordFactory({
    determiner: "",
    quantity: null,
    possessor: null // NounPhrase
});

class Determiner extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Determiner");
    }

    static isDeterminer(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Determiner;
    }

    _clone(...args: any): Determiner {
        return new Determiner(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        const quantity: number|string = this.data.quantity != null
            ? `${this.data.quantity}`
            : null;

        return this._flattenChildren([
            this.data.possessor,
            this.data.determiner,
            quantity
        ], context);
    }

    //
    // determiner
    //

    determiner(determiner: string): Determiner {
        CheckType(determiner, ["string"]);
        return this.clone({
            data: this.data.set('determiner', determiner)
        });
    }

    det(determiner: string): Determiner {
        return this.determiner(determiner);
    }

    //
    // quantity
    //

    quantity(quantity: number|string): Determiner {
        CheckType(quantity, ["number", "string"]);
        return this.clone({
            data: this.data.set('quantity', quantity)
        });
    }

    //
    // possessor
    //

    possessor(possessor: NounPhrase|string, suffix: string = null): Determiner {
        CheckType(possessor, ["NounPhrase", "string"]);
        possessor = NounPhraseFactory(possessor);
        if(suffix) {
            possessor = possessor.after(suffix);
        }

        return this.clone({
            data: this.data.set('possessor', possessor)
        });
    }
}

const DeterminerFactory = (determiner: Determiner|string): Determiner => {
    CheckType(determiner, [Determiner, "string", "undefined", "null"]);
    if(Determiner.isDeterminer(determiner)) {
        return determiner;
    }
    return new Determiner(DeterminerRecord({
        determiner: determiner || ""
    }));
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
