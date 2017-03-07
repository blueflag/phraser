import {Map, List} from 'immutable';

class Constituent {

    constructor(data: Map<string, any>) {
        this.data = data;
    }

    static isConstituent(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Constituent;
    }

    _flattenChildren(children: Array<Constituent|string|null|List<Constituent|string|null>>): List {
        return List(children)
            .flatten(true)
            .filter(ii => ii)
            .reduce((list: List<Constituent|string|null>, item: Constituent|string|null): List<Constituent|string> => {
                const flattened: List = typeof item == "object" && item.flatten
                    ? item.flatten()
                    : List([item]);

                return list.concat(flattened);
            }, List())
            .filter(ii => ii);
    }

    _flattenAndRenderSelf(): List {
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

    _renderSelf(): string {
        return "...";
    }

    flatten(): List {
        return this;
    }

    render(): List {
        return this._flattenAndRenderSelf()
            .map(ii => typeof ii == "object" && ii._postRenderSelf
                ? ii._postRenderSelf()
                : ii
            );
    }

    renderString(): string {
        return this._flattenAndRenderSelf()
            .map(ii => typeof ii == "object" && ii._stringRenderSelf
                ? ii._stringRenderSelf()
                : ii
            )
            .join(" ");
    }
}

export default Constituent;
