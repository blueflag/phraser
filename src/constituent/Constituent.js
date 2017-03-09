import {Record, Map, List} from 'immutable';

const ConstituentRecordFactory = (initialValues: Object): Record => {
    const defaultValues: Object = {
        text: "",
        prepend: List(),
        append: List(),
        appendPrevious: List(),
        prependNext: List(),
        meta: Map()
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
                    // if first child item, merge this constituents contents of prepend and appendPrevious into the child
                    data = data
                        .update('prepend', ii => this.data.prepend.concat(ii))
                        .update('appendPrevious', ii => this.data.appendPrevious.concat(ii));
                }

                if(hasLast && index + 1 == iter.size) {
                    // if last child item, merge this constituents contents of append and prependNext into the child
                    data = data
                        .update('append', ii => ii.concat(this.data.append))
                        .update('prependNext', ii => ii.concat(this.data.prependNext));
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
            // append and prepend punctuation
            .map((item: Constituent, index: number, iter: List<Constituent>): Constituent => {

                // take appendPrevious from each next item in the list
                // and add it to the end of this item's append
                if(index < iter.size - 1) {
                    const {appendPrevious} = iter.get(index + 1).data;
                    if(appendPrevious.size > 0) {
                        item = item.clone({
                            data: item.data.update('append', ii => ii.concat(appendPrevious))
                        });
                    }
                }

                // take prependNext from each previous item in the list
                // and add it to the beginning of this item's prepend
                if(index > 0) {
                    const {prependNext} = iter.get(index - 1).data;
                    if(prependNext.size > 0) {
                        item = item.clone({
                            data: item.data.update('prepend', ii => prependNext.concat(ii))
                        });
                    }
                }

                return item;
            })
            // add spaces
            .interpose(ArbitraryStringFactory(" ")); // needs to set mets where two neigbours also have the same meta
    }

    render(): List<Object> {
        return this.flatten()
            .map((item: Constituent): List<Object> => {
                const rendered: string|List<string> = item._renderSelf();
                var text: string = List.isList(rendered)
                    ? rendered.join(" ")
                    : rendered;

                text = item.data.prepend.join("") + text + item.data.append.join("");

                return text;
            });
    }

    renderString(): string {
        return this.render()
            //.map(ii => ii.get('text'))
            .join("");
    }

    // TODO check types without causing a dependency loop

    prepend(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("prepend", List([item]))
        });
    }

    append(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("append", List([item]))
        });
    }

    wrap(startOrBoth: Punctuation|string, end: Punctuation|string): Constituent {
        if(!end) {
            return this.clone({
                data: this.data
                    .set("prepend", List([startOrBoth]))
                    .set("append", List([startOrBoth]))
            });
        }
        return this.clone({
            data: this.data
                .set("prepend", startOrBoth)
                .set("append", end)
        });
    }

    appendPrevious(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("appendPrevious", List([item]))
        });
    }

    prependNext(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("prependNext", List([item]))
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
