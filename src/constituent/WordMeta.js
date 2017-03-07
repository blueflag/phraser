import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    Record
} from 'immutable';

const WordMetaRecord = Record({
    word: "",
    meta: null
});

console.log("!!", Constituent);

class WordMeta extends Constituent {

    static isWordMeta(obj: any): boolean {
        return typeof obj == "object" && obj instanceof WordMeta;
    }

    _renderSelf(): string {
        return "!!"; //this.data.word;
    }

    render(): Object {
        return "??"; //this.data.word.toObject();
    }
}

const WordMetaFactory = (word: WordMeta|string, meta: any): WordMeta => {
    CheckType(word, [WordMeta, "string"]);
    if(WordMeta.isWordMeta(word)) {
        return word;
    }
    return new WordMeta(WordMetaRecord({word, meta}));
};

export {
    WordMeta,
    WordMetaFactory
};
