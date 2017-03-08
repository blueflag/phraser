import React from 'react';
import {Constituent} from 'phraser';
import Lexicon from './Lexicon';
import {List} from 'immutable';

const {
    Clause,
    Paragraph,
    Sentence,
    AdjP,
    Det,
    NP,
    PP,
    V,
    VP
} = Constituent(Lexicon);


const filters: Object = {
    suburb: {
        exactly: "Richmond"
    },
    postcode: {
        exactly: "3121"
    },
    propertyType: {
        oneOf: ["?", ":("]
    },
    bedrooms: {
        exactly: 2
    }
};

// TODO

// ADD ALL PHRASES!!
// USE FILTERS IN PHRASES!!!
// MAKE WRAPPER COMPONENT TO REPLACE WORDMETA!!!!
// ADD COMMAS!!!!

export default () => {
    var sentences = [];

    sentences.push('<h2>RealDemand examples and tests</h2>');
    sentences.push('<h4>Suburb Ranking</h4>');
    sentences.push('<p>e.g. <em>"Richmond ranks 4th for supply and demand metrics when comparing all suburbs in Victoria."</em></p>');

    sentences.push(() => {
        const comparisonNoun = NP("suburb")
            .plural()
            .det("all") // ALL, BOTH etc
            .modifier(PP("in", "Victoria"));

        return Sentence(
            Clause(
                "Richmond",
                "rank",
                AdjP("4th") // TODO some kind of helper class that can use numeral and turn numbers to ordered numbers
            )
                .present()
                .modifier(PP("for", "supply and demand metrics"))
                .modifier(Clause(comparisonNoun, VP("is"), AdjP("compared")).whAdverb("when"))
        );
    });

    sentences.push('<h4>Supply Trends</h4>');
    sentences.push('<p>e.g. <em>"Hawthorn\'s supply has been trending slightly upward looking at the last 6 months."</em></p>');
    sentences.push(() => {
        return Sentence(
            Clause(
                NP("supply").det("Hawthorn's"), // TODO separate type or method for possessive determiners
                VP("trend").adverb("slightly upward") // TODO add verb dictionary
                // ^ TODO adverb positions
                // ^ TODO add degree as a type for "very" etc.
            )
                .present()
                .perfectContinuous()
                .modifier(PP("looking at", NP("month").det(Det("the last").quantity(6))))
        );
    });

    sentences.push('<p>e.g. <em>"The average number of listings is 22 which is 12% higher than the state average."</em></p>');
    sentences.push(() => {
        return Sentence(
            Clause(
                NP("average number")
                    .the()
                    .modifier(PP("of", "listings")),
                VP("is"),
                NP("34")
            )
                .modifier(PP("looking at", NP("month").det(Det("the last").quantity(6)))) // TODO, fronting
        );
    });

    sentences.push('<h4>Property Type Breakdown</h4>');
    sentences.push('<p>e.g. <em>"The most demanded property type in St. Kilda between $100K and $500K in the past year with 3 bedrooms, 2 bathrooms and 1 garage is house, which has 20% of the total views."</em></p>');
    sentences.push(() => {
        return Sentence(
            Clause(
                NP("property type")
                    .the()
                    .adjective("most demanded")
                    .modifier(PP("in", "St. Kilda 3101"))
                    .modifier(PP("between", "$100K and $500K"))
                    .modifier(PP("in", "the past year"))
                    .modifier(PP("with", "3 bedrooms, 2 bathrooms and 1 garage")), // TODO use a Join / Series / Conjunction thing
                VP("is"),
                NP("house")
            )
                .modifier(
                    Clause( // TODO add a comma
                        null,
                        VP("has"),
                        NP("20%").modifier(PP("of", NP("total views").the()))
                    ).whDeterminer("which")
                )
        );
    });

    sentences.push('<h2>Verb tests</h2>');

    const baseVerb = V('jump');

    List([
        'present',
        'past',
        'future',
        'futurePast'
    ]).forEach(tense => {
        List([
            'simple',
            'continuous',
            'perfect',
            'perfectContinuous'
        ]).forEach(aspect => {
            List([
                'singular',
                'plural'
            ]).forEach(number => {
                sentences.push(`<p>${tense} tense, ${aspect} aspect, ${number} number, all persons.</p>`);
                sentences.push(() => {
                    return Paragraph(
                            Sentence(
                                Clause(NP("cat")
                                    .the()
                                    .person("third")
                                    .number(number),
                                VP(baseVerb)
                            )
                                .tense(tense)
                                .aspect(aspect)
                        ),
                            Sentence(
                                Clause(NP("you")
                                    .person("second")
                                    .number(number),
                                VP(baseVerb)
                            )
                                .tense(tense)
                                .aspect(aspect)
                        ),
                            Sentence(
                                Clause(NP("I")
                                    .person("first")
                                    .number(number),
                                VP(baseVerb)
                            )
                                .tense(tense)
                                .aspect(aspect)
                        )
                    );
                });
            });
        });
    });

    const things = sentences.map((ii, kk) => {
        if(typeof ii == "function") {
            const sentence = ii();
            console.log(sentence.flatten(), sentence.render(), sentence.renderString());
            return <h3 style={{margin: '0 0 5rem'}} key={kk}>{sentence.renderString()}</h3>
        }
        return <span key={kk} dangerouslySetInnerHTML={{__html: ii}} />;
    });

    return <div>
        <h1>Phraser</h1>
        <p>Hello. This is not an autogenerated sentence. But perhaps someday it will be.</p>
        {things}
    </div>;
}

