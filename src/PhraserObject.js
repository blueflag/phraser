import {Map} from 'immutable';

class PhraserObject {
    constructor(data: Map<string, any>) {
        this.data = data;
    }

    toArray(): Array<any> {
        return this.toList().toArray();
    }

    toString(): string {
        return this.toArray().join(" ");
    }
}

export default PhraserObject;
