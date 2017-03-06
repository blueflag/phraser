import {Map} from 'immutable';

class Constituent {

    constructor(data: Map<string, any>) {
        this.data = data;
    }

    static isConstituent(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Constituent;
    }

    toArray(): Array<any> {
        return this.toList().toArray();
    }

    toString(): string {
        return this.toArray().join(" ");
    }
}

export default Constituent;
