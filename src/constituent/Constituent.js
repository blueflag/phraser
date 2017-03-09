import {Record, Map, List} from 'immutable';
import {firstToUpper} from '../utils/String';

const ConstituentRecordFactory = (initialValues: Object): Record => {
    const defaultValues: Object = {
        before: List(),
        after: List(),
        afterPrevious: List(),
        beforeNext: List(),
        meta: Map(),
        text: "",
        first: false
    };

    return Record(Object.assign({}, defaultValues, initialValues));
};

class Constituent {

    constructor(data: Map<string, any>, lexicon: Object = {}) {
        this.data = data;
        this.lexicon = lexicon;
        this.types = [];
    }

    static isConstituent(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Constituent;
    }

    _clone(...args: any): Constituent {
        return new Constituent(...args);
    }

    _flattenChildren(
        children: Array<Constituent|string|null|List<Constituent|string|null>>,
        context: Map<string, any> = Map(),
        options: Object = {}
    ): List<Constituent> {

        const hasFirst: boolean = options.hasOwnProperty('hasFirst') ? options.hasFirst : true;
        const hasLast: boolean = options.hasOwnProperty('hasLast') ? options.hasLast : true;

        return List(children)
            // children are often Lists themselves, flatten them one level
            .flatten(true)
            // remove any empty strings / null values
            .filter(ii => ii)
            // call _flattenSelf() on any items that have it and use the resulting List
            // any non-constituents are cast to strings and put inside an ArbitraryString constituent
            .reduce((list: List<Constituent|string|null>, item: Constituent|string|null): List<Constituent|string> => {
                if(typeof item != "object" || !item._flattenSelf) {
                    return list.push(ArbitraryStringFactory(item + ""));
                }
                return list.concat(item._flattenSelf(context));
            }, List())
            // again remove any empty strings / null values
            .filter(ii => ii)
            // merge meta into children
            .map((item: Constituent, index: number, iter: List<Constituent>): Constituent => {
                var data: Record = item.data
                    .update('meta', meta => this.data.meta.merge(meta));

                if(hasFirst && index == 0) {
                    // if first child item, merge this constituents contents of before and afterPrevious into the child
                    data = data
                        .update('before', ii => this.data.before.concat(ii))
                        .update('afterPrevious', ii => this.data.afterPrevious.concat(ii));
                }

                if(hasLast && index + 1 == iter.size) {
                    // if last child item, merge this constituents contents of after and beforeNext into the child
                    data = data
                        .update('after', ii => ii.concat(this.data.after))
                        .update('beforeNext', ii => ii.concat(this.data.beforeNext));
                }

                return item.clone({data});
            });
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        return this;
    }

    _renderSelf(): string {
        return "...";
    }

    clone(override: Object = {}): Constituent {
        return this._clone(
            override.data || this.data,
            override.lexicon || this.lexicon
        );
    }

    flatten(): List<Constituent> {
        return this._flattenSelf(Map())
            // after and before punctuation
            .map((item: Constituent, index: number, iter: List<Constituent>): Constituent => {

                // take afterPrevious from each next item in the list
                // and add it to the end of this item's after
                if(index < iter.size - 1) {
                    const {afterPrevious} = iter.get(index + 1).data;
                    if(afterPrevious.size > 0) {
                        item = item.clone({
                            data: item.data.update('after', ii => ii.concat(afterPrevious))
                        });
                    }
                }

                // take beforeNext from each previous item in the list
                // and add it to the beginning of this item's before
                if(index > 0) {
                    const {beforeNext} = iter.get(index - 1).data;
                    if(beforeNext.size > 0) {
                        item = item.clone({
                            data: item.data.update('before', ii => beforeNext.concat(ii))
                        });
                    }
                }

                return item;
            })
            // add spaces
            .interpose(ArbitraryStringFactory(" "));
    }

    render(): List<Object> {
        return this.flatten()
            .map((item: Constituent): List<Object> => {
                const rendered: string|List<string> = item._renderSelf();
                var text: string = List.isList(rendered)
                    ? rendered.join(" ")
                    : rendered;

                if(item.data.first) {
                    text = firstToUpper(text);
                }

                text = item.data.before.join("") + text + item.data.after.join("");
                const {meta} = item.data;

                return Map({
                    text,
                    meta
                });
            });
    }

    renderString(): string {
        return this.render()
            .map(ii => ii.get('text'))
            .join("");
    }

    // TODO check types without causing a dependency loop

    before(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("before", List([item]))
        });
    }

    after(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("after", List([item]))
        });
    }

    wrap(startOrBoth: Punctuation|string, end: Punctuation|string): Constituent {
        if(!end) {
            return this.clone({
                data: this.data
                    .set("before", List([startOrBoth]))
                    .set("after", List([startOrBoth]))
            });
        }
        return this.clone({
            data: this.data
                .set("before", startOrBoth)
                .set("after", end)
        });
    }

    afterPrevious(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("afterPrevious", List([item]))
        });
    }

    beforeNext(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("beforeNext", List([item]))
        });
    }

    setMeta(key: string, value: any): Constituent {
        return this.clone({
            data: this.data.setIn(['meta', key], value)
        });
    }
}



const ArbitraryStringRecord = ConstituentRecordFactory({
    string: ""
});

class ArbitraryString extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types = ["ArbitraryString"];
    }

    static isArbitraryString(obj: any): boolean {
        return typeof obj == "object" && obj instanceof ArbitraryString;
    }

    _clone(...args: any): ArbitraryString {
        return new ArbitraryString(...args);
    }

    _renderSelf(): string {
        return this.data.string;
    }

}

const ArbitraryStringFactory = (string: string): ArbitraryString => {
    return new ArbitraryString(ArbitraryStringRecord({string}));
};



export {
    Constituent,
    ConstituentRecordFactory,
    ArbitraryString,
    ArbitraryStringFactory
};
