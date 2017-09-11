import {List} from 'immutable';
import {Constituent, ConstituentRecordFactory, ArbitraryStringFactory} from './Constituent';
import {ConjunctionFactory} from './Conjunction';
import {CheckType} from '../decls/TypeErrors';

const SeriesRecord = ConstituentRecordFactory({
    series: List(), // List<Constituent>
    conjunction: null,
    delimiter: ",",
    delimitLast: false
});

class Series extends Constituent {

    constructor(...args: any) {
        super(...args);
        this.types.push("Series");
    }

    static isSeries(obj: any): boolean {
        return typeof obj == "object" && obj instanceof Series;
    }

    _clone(...args: any): Series {
        return new Series(...args);
    }

    _flattenSelf(context: Map<string, any>): List<Constituent|string> {
        const series: List<Constituent> = this.data.series
            .reduce((list: List<Constituent>, item: Constituent, index: number, iter: List<Constituent>): Constituent => {
                const isLast: boolean = index == iter.size - 1;
                if(isLast) {
                    return iter.size > 1 && this.data.conjunction
                        ? list.push(this.data.conjunction, item)
                        : list.push(item);
                }
                const isSecondLast: boolean = index == iter.size - 2;
                if(isSecondLast && !this.data.delimitLast) {
                    return list.push(item);
                }
                const itemWithDelimiter: Constituent = item.after(item.data.after.push(this.data.delimiter));
                return list.push(itemWithDelimiter);
            }, List());

        return this._flattenChildren(series, context);
    }

    //
    // series
    //

    series(series: Series|Array<Constituent>|List<Constituent>): Series {
        CheckType(series, ["Array", "List"]);

        const seriesList: List<Constituent> = List(series)
            .map(ii => typeof ii == "string"
                ? ArbitraryStringFactory(this.config)(ii)
                : ii
            );

        return this.clone({
            data: this.data.set('series', seriesList)
        });
    }

    //
    // conjunction
    //

    conjunction(conjunction: Conjunction|string|null): Series {
        CheckType(conjunction, ["Conjunction", "string", "null"]);
        return this.clone({
            data: this.data.set('conjunction', conjunction
                ? ConjunctionFactory(this.config)(conjunction)
                : null
            )
        });
    }

    and(): Series {
        return this.conjunction("and");
    }

    or(): Series {
        return this.conjunction("or");
    }

    noConjunction(): Series {
        return this
            .conjunction(null)
            .delimitLast();
    }
    //
    // delimiter
    //

    delimiter(delimiter: string): Series {
        CheckType(delimiter, ["string"]);
        return this.clone({
            data: this.data.set('delimiter', delimiter)
        });
    }

    delimitLast(delimitLast: boolean = true): Series {
        CheckType(delimitLast, ["boolean"]);
        return this.clone({
            data: this.data.set('delimitLast', delimitLast)
        });
    }

    oxford(): Series {
        return this.delimitLast();
    }
}

const SeriesFactory = (config: Object) => (series: Series|Array<Constituent>|List<Constituent>): Series => {
    CheckType(series, ["Series", "Array", "List"]);
    if(Series.isSeries(series)) {
        return series;
    }

    const seriesList: List<Constituent> = List(series)
        .map(ii => typeof ii == "string"
            ? ArbitraryStringFactory(config)(ii)
            : ii
        );

    const seriesInstance: Series = new Series(
        SeriesRecord({
            series: seriesList,
            conjunction: ConjunctionFactory(config)("and")
        }),
        config
    );

    return seriesInstance;
};

export {
    Series,
    SeriesFactory
};
