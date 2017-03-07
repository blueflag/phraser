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
                return list.concat(item.flatten());
            }, List())
            .filter(ii => ii);
    }

    _renderSelf(): string {
        return "...";
    }

    flatten(): List {
        return this;
    }

    render(): List {
        return this.flatten()
            .map(ii => ii._renderSelf());
    }

    renderString(): string {
        return this.render().join(" ");
    }

    data(): Record {
        return this.data;
    }

}

export default Constituent;
