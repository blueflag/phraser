import Constituent from './Constituent';
import {CheckType} from '../decls/TypeErrors';
import {
    Record
} from 'immutable';

const WordMetaRecord = Record({
    word: "",
    meta: null
});

class WordMeta extends Constituent {

    static isWordMeta(obj: any): boolean {
        return typeof obj == "object" && obj instanceof WordMeta;
    }

    _postRenderSelf(): Object {
        return this.data;
    }

    _stringRenderSelf(): string {
        return this.data.word;
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
