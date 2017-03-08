import React from 'react';
import {Constituent} from 'phraser';
import Lexicon from './Lexicon';
import {List} from 'immutable';

const {
    Adjective,
    AdjectivePhrase,
    Clause,
    Noun,
    NounPhrase,
    Paragraph,
    Preposition,
    PrepositionPhrase,
    Sentence,
    Verb,
    VerbPhrase,
    AdjP,
    Det,
    NP,
    PP,
    V,
    VP
} = Constituent(Lexicon);


export default () => {
    var sentences = [];

    sentences.push('<h2>RealDemand examples and tests</h2>');
    sentences.push('<h4>Suburb Ranking</h4>');
    sentences.push('<p>e.g. <em>"Richmond ranks 4th for supply and demand metrics when comparing all suburbs in Victoria."</em></p>');
    sentences.push(() => {
        const filter = Clause(
            null,
            VerbPhrase(Verb("comparing")),
            NounPhrase(Noun("suburbs"))
                .determiner("all")
                .modifier(PrepositionPhrase(
                    Preposition("in"),
                    NounPhrase(Noun("Victoria")) // EXAMPLE passing objects through as a word to facilitate word meta data and rich rendering on front end
                ))
        ).whAdverb("when");

        return Sentence(
            Clause(
                NounPhrase(Noun("Richmond")),
                VerbPhrase(Verb("ranks")), // TODO verb tenses so this can just be "rank"
                AdjectivePhrase(Adjective("4th")) // TODO some kind of helper class that can use numeral and turn numbers to ordered numbers
            )
                .modifier(PrepositionPhrase(
                    Preposition("for"),
                    NounPhrase(Noun("supply and demand metrics")) // TODO noun adjuncts to describe SUPPLY AND DEMAND metrics
                ))
                .modifier(filter)
        );
    });

    sentences.push('<p>...the same thing written shorthand...</p>');
    sentences.push(() => {
        const comparisonNoun = NP("suburbs")
            .det("all")
            .modifier(PP("in", "Victoria"));

        return Sentence(
            Clause(
                "Richmond",
                "ranks", // TODO verb tenses so this can just be "rank"
                AdjP("4th") // TODO some kind of helper class that can use numeral and turn numbers to ordered numbers
            )
                .modifier(PP("for", "supply and demand metrics"))
                .modifier(Clause(null, "comparing", comparisonNoun).whAdverb("when"))
        );
    });

    sentences.push('<h4>Supply Trends</h4>');
    sentences.push('<p>e.g. <em>"Hawthorn\'s supply has been trending slightly upward looking at the last 6 months."</em></p>');
    sentences.push(() => {
        return Sentence(
            Clause(
                NP("supply").det("Hawthorn's"), // TODO separate type or method for possessive determiners
                VP("trending").adverb("slightly upward") // TODO add verb dictionary and "has been"
                // ^ TODO add degree as a type for "very" etc.
            )
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
                VP("is")
            )
                .modifier(PP("looking at", NP("month").det(Det("the last").quantity(6))))
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

