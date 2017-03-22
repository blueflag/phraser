import React from 'react';
import {Constituent} from 'phraser';
import Lexicon from './Lexicon';
import {List} from 'immutable';

const {
    Clause,
    Paragraph,
    Sentence,
    NP,
    PP,
    V,
    VP
} = Constituent(Lexicon);



export default () => {
    var sentences = [];

    sentences.push('<h2>Examples and tests</h2>');



    sentences.push('<h2>Punctuation tests</h2>');
    sentences.push(() => {
        return Sentence(
            Clause(
                NP("dog")
                    .quantity(3)
                    .determiner("those"),
                VP("ate", NP("food"))
                    .adverb("quickly", "middle")
            )
                .modifier(
                    PP(
                        "from",
                        NP("trash can")
                            .a()
                            .adjective("huge")
                    )
                )
        );
    });

    sentences.push(() => {
        return Sentence(
            NP("fire")
        );
    });

    sentences.push(() => {
        return Sentence(
            NP("fire")
        ).after("?")
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

            console.log(
                sentence.flatten(),
                sentence.render(),
                sentence.renderString()
            );

            const elems = sentence.render()
                .map(ii => <span style={ii.getIn(['meta', 'style'], {})}>{ii.get('text')}</span>);

            return <h3 style={{margin: '0 0 5rem'}} key={kk}>{elems}</h3>
        }
        return <span key={kk} dangerouslySetInnerHTML={{__html: ii}} />;
    });

    return <div>
        <h1>Phraser</h1>
        <p>Hello. This is not an autogenerated sentence. But perhaps someday it will be.</p>
        {things}
    </div>;
}

