import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory} from './Constituent';

const ParagraphRecord = ConstituentRecordFactory({
    sentences: List()
});

class Paragraph extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Paragraph");
    }

    static isParagraph(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Paragraph;
    }

    _clone(...args: any): Paragraph {
        return new Paragraph(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
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
