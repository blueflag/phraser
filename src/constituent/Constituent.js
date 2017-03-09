import {Map, List} from 'immutable';

class Constituent {

    constructor(data: Map<string, any>, lexicon: Object = {}, meta: Object = Map()) {
        this.data = data;
        this.lexicon = lexicon;
        this.meta = meta;
        this.types = [];
    }

    static isConstituent(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Constituent;
    }

    _clone(...args: any): Constituent {
        return new Constituent(...args);
    }

    _flattenChildren(children: Array<Constituent|string|null|List<Constituent|string|null>>, context: Map<string, any> = Map()): List<Constituent|string> {
        return List(children)
            // children are often Lists themselves, flatten them one level
            .flatten(true)
            // remove any empty strings / null values
            .filter(ii => ii)
            // call _flattenSelf() on any items that have it and use the resulting List
            .reduce((list: List<Constituent|string|null>, item: Constituent|string|null): List<Constituent|string> => {
                const flattened: List = typeof item == "object" && item._flattenSelf
                    ? item._flattenSelf(context)
                    : List([item]);

                return list.concat(flattened);
            }, List())
            // again remove any empty strings / null values
            .filter(ii => ii)
            // merge meta into children
            .map((item: Constituent|string): Constituent|string => {
                if(!Constituent.isConstituent(item)) {
                    return item;
                }
                return item.clone({
                    meta: this.meta.merge(item.meta)
                });
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
            override.lexicon || this.lexicon,
            override.meta || this.meta
        );
    }

    flatten(): List<Constituent|string> {
        return this._flattenSelf(Map());
    }

    render(): List<string> {
        return this.flatten()
            .reduce((list: List<string>, item: List<string>|string): List<string> => {
                if(typeof item == "string") {
                    return list.push(item);
                }
                const rendered: List<string>|string = item._renderSelf();
                return List.isList(rendered)
                    ? list.concat(rendered)
                    : list.push(rendered);
            }, List());
    }

    renderString(): string {
        return this.render().join(" ");
    }

    // TODO check types without causing a dependency loop

    prepend(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("prepend", item)
        });
    }

    append(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("append", item)
        });
    }

    wrap(startOrBoth: Punctuation|string, end: Punctuation|string): Constituent {
        if(!end) {
            return this.clone({
                data: this.data
                    .set("prepend", startOrBoth)
                    .set("append", startOrBoth)
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
            data: this.data.set("appendPrevious", item)
        });
    }

    prependNext(item: Punctuation|string): Constituent {
        return this.clone({
            data: this.data.set("prependNext", item)
        });
    }

    setMeta(key: string, value: any): Constituent {
        return this.clone({
            meta: this.meta.set(key, value)
        });
    }
}

export default Constituent;
