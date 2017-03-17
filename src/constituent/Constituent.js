import {Record, Map, List} from 'immutable';
import {CheckType, CheckEnum} from '../decls/TypeErrors';
import {FirstToUpper} from '../utils/String';
import {CreateList} from '../utils/List';

const MODIFIER_POSITION_ENUM = [
    "front",
    "end"
];

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
        this.types = ["Constituent"];
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

    _modifier(modifier: Modifier, position: string = "end"): Constituent {
        CheckType(modifier, ["Modifier"]);
        CheckEnum(position, MODIFIER_POSITION_ENUM);

        if(position == "front") {
            modifier = modifier.after(",");
        }

        return this.clone({
            data: this.data.updateIn(['modifiers', position], modifiers => modifiers.push(modifier))
        });
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
            .reduce((list: List<Object>, item: Constituent): List<Object> => {
                const rendered: string|List<string> = item._renderSelf();
                var text: string = List.isList(rendered)
                    ? rendered.join(" ")
                    : rendered;

                if(item.data.first) {
                    text = FirstToUpper(text);
                }

                const {meta} = item.data;
                const before: string = item.data.before.join("");
                const after: string = item.data.after.join("");

                var add: List<Object> = List();
                if(before) {
                    add = add.push(Map({
                        text: before
                    }));
                }

                add = add.push(Map({
                    text,
                    meta
                }));

                if(after) {
                    add = add.push(Map({
                        text: after
                    }));
                }

                return list.concat(add);
            }, List());
    }

    renderString(): string {
        return this.render()
            .map(ii => ii.get('text'))
            .join("");
    }

    get(key: string): any {
        return this.data.get(key);
    }

    before(item: Array<Constituent|string>|List<Constituent|string>|Constituent|string): Constituent {
        return this.clone({
            data: this.data.set("before", CreateList(item))
        });
    }

    after(item: Array<Constituent|string>|List<Constituent|string>|Constituent|string): Constituent {
        return this.clone({
            data: this.data.set("after", CreateList(item))
        });
    }

    wrap(startOrBoth: Constituent|string, end: Constituent|string): Constituent {
        if(!end) {
            return this.clone({
                data: this.data
                    .set("before", CreateList(startOrBoth))
                    .set("after", CreateList(startOrBoth))
            });
        }
        return this.clone({
            data: this.data
                .set("before", startOrBoth)
                .set("after", end)
        });
    }

    afterPrevious(item: Array<Constituent|string>|List<Constituent|string>|Constituent|string): Constituent {
        return this.clone({
            data: this.data.set("afterPrevious", CreateList(item))
        });
    }

    beforeNext(item: Array<Constituent|string>|List<Constituent|string>|Constituent|string): Constituent {
        return this.clone({
            data: this.data.set("beforeNext", CreateList(item))
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
        this.types.push("ArbitraryString");
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
    ArbitraryStringFactory,
    MODIFIER_POSITION_ENUM
};
