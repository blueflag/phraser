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
    VP,
    Series
} = Constituent({
    lexicon: Lexicon,
    numberRenderer: ii => `${ii}`
});



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
            NP("fire").setMeta("ppp", "ooo").adj("big")
        );
    });

    sentences.push(() => {
        return Sentence(
            NP("fire")
        ).after("?")
    });

    sentences.push('<h2>Quantity tests</h2>');
    sentences.push('<p>if quantity() is given a variable of type number, the noun number will be set automatically. In all other circumstances the noun number must be set independently</p>');

    sentences.push(() => {
        return Sentence(
            Series([
                NP("hat").quantity(0),
                NP("hat").quantity(1),
                NP("hat").quantity(2),
                NP("hat").quantity(2).single() // single() is ignored because quantity() is given a variable of type number
            ])
                .noConjunction()
        );
    });

    sentences.push(() => {
        return Sentence(
            Series([
                NP("boot").quantity("ONE").singular(),
                NP("boot").quantity("a bajillion").plural(),
                NP("boot").quantity("zero").numberFromQuantity(0),
                NP("boot").quantity("one").numberFromQuantity(1),
                NP("boot").quantity("myriad").numberFromQuantity(2)
            ])
                .noConjunction()
        );
    });

    sentences.push('<h2>Number noun tests</h2>');

    sentences.push(() => {
        return Sentence(
            Clause(
                NP("age").possessor("my"),
                VP("is", NP("twelve"))
            )
        );
    });

    sentences.push(() => {
        return Sentence(
            Clause(
                NP("age").possessor("my"),
                VP("is", NP(123456))
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

