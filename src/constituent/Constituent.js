import {Map, List} from 'immutable';

class Constituent {

    constructor(data: Map<string, any>, lexicon: Object = {}) {
        this.data = data;
        this.lexicon = lexicon;
    }

    static isConstituent(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Constituent;
    }

    _flattenChildren(children: Array<Constituent|string|null|List<Constituent|string|null>>, context: Map<string, any> = Map()): List {
        return List(children)
            .flatten(true)
            .filter(ii => ii)
            .reduce((list: List<Constituent|string|null>, item: Constituent|string|null): List<Constituent|string> => {
                const flattened: List = typeof item == "object" && item.flatten
                    ? item._flattenSelf(context)
                    : List([item]);

                return list.concat(flattened);
            }, List())
            .filter(ii => ii);
    }

    _flattenSelf(context: Map<string, any>): List {
        return this;
    }

    _renderSelf(): string {
        return "...";
    }

    flatten(): List {
        return this._flattenSelf(Map());
    }

    render(): List {
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


            /*.map(ii => typeof ii == "object" && ii._postRenderSelf
                ? ii._postRenderSelf()
                : ii
            );*/
    }

    renderString(): string {
        return this.render().join(" ");
    }
}

export default Constituent;
