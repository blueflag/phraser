import {List, Record} from 'immutable';
import Constituent from './Constituent';

const ParagraphRecord = Record({
    sentences: List()
});

class Paragraph extends Constituent {

    static isParagraph(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Paragraph;
    }

    _flattenSelf(context: Map<string, any>): List {
        return this._flattenChildren([
            this.data.sentences
        ], context);
    }

}

const ParagraphFactory = (...sentences: Sentence): Paragraph => {
    return new Paragraph(ParagraphRecord({
        sentences: List(sentences)
    }));
};

export {
    Paragraph,
    ParagraphFactory
};
