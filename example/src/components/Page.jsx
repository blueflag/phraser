import React from 'react';
import Phraser from 'phraser';
import Lexicon from './Lexicon';

const {
    Adjective,
    AdjectivePhrase,
    AdverbClause,
    Clause,
    Noun,
    NounPhrase,
    Preposition,
    PrepositionPhrase,
    Sentence,
    SubordinatingConjunction,
    Verb,
    VerbPhrase,
    WordMeta
} = Phraser(Lexicon);

// const nouns = [
//     {
//     }
// ];

// Noun.lexicon(nouns);


export default (props) => {
    var sentences = [];

    /*sentences.push('<h4>Nouns</h4>');
    sentences.push('<p><em>"Cat", "Cats", "Richmond"</em></p>');

    sentences.push(() => {
        return Noun("Cat")
            .toString();
    });

    sentences.push(() => {
        return Noun("Cat")
            .plural()
            .toString();
    });

    sentences.push(() => {
        return Noun("Richmond")
            .toString();
    });*/



    sentences.push('<h4>Clauses</h4>');
    sentences.push('<p><em>"Richmond ranks 4th for supply and demand metrics when comparing all suburbs in Victoria."</em></p>');

    sentences.push(() => {
        const filter = AdverbClause(
            SubordinatingConjunction("when"),
            null,
            VerbPhrase(Verb("comparing")),
            NounPhrase(Noun("suburbs"))
                .determiner("all")
                .modifier(PrepositionPhrase(
                    Preposition("in"),
                    NounPhrase(Noun(WordMeta("Victoria", {color: "green"})))
                )
            )
        );

        const sentence = Sentence(
            Clause(
                NounPhrase(Noun("Richmond")),
                VerbPhrase(Verb("ranks")), // TODO verb tenses so this can just be "rank"
                AdjectivePhrase(Adjective("4th")) // TODO some kind of helper class that can use numeral and turn numbers to ordered numbers
            )
                .modifier(PrepositionPhrase(
                    Preposition("for"),
                    NounPhrase(Noun("supply and demand metrics"))
                ))
                .modifier(filter)
        ).render();

        return sentence;
    });



    /*

    sentences.push("Nouns and determiners");

    sentences.push(() => {
        return Noun("cat")
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("the"))
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("a"))
            .toString();
    });

    sentences.push(() => {
        return Noun("egg")
            .determiner(Determiner("a"))
            .toString();
    });

    sentences.push("Singular and plural nouns");

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("the"))
            .plural()
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("the"))
            .plural()
            .single()
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .amount(1)
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .amount(5)
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .amount(0.2)
            .toString();
    });

    sentences.push("Adjectives");

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("the"))
            .adjective(Adjective("fat"))
            .toString();
    });

    sentences.push(() => {
        return Noun("cat")
            .determiner(Determiner("the"))
            .adjective(Adjective("fat"))
            .adjective(Adjective("blue"))
            .toString();

        // TODO commas! ordering!
    });

    sentences.push(() => {
        return Noun("Limpopo river")
            .determiner(Determiner("the"))
            .adjective(Adjective("great"))
            .adjective(Adjective("grey"))
            .adjective(Adjective("green"))
            .adjective(Adjective("greasy"))
            .toString();

        // TODO ordering!
    });

    sentences.push("Clauses and predicates");

    sentences.push(() => {
        return Clause(Noun("mr. cat"), Predicate(Verb("sits")))
            .toString();
    });

    sentences.push(() => {
        return Clause(Noun("cat"), Predicate(Verb("is"), Adjective("fat")))
            .toString();
    });

    sentences.push("Prepositional phrases");

    sentences.push(() => {
        var subject = Noun("cat")
            .determiner(Determiner("the"))
            .prepositionalPhrase(PrepositionPhrase(Preposition("on"), Noun("mat").determiner("the")))

        return Clause(subject, Predicate(Verb("ate"), Noun("rocks")))
            .toString();
    });

    sentences.push(() => {
        var subject = Noun("cat")
            .determiner(Determiner("the"));

        return Clause(subject, Predicate(Verb("ate"), Noun("rocks")))
            .prepositionalPhrase(PrepositionPhrase(Preposition("on"), Noun("mat").determiner("the")))
            .toString();
    });

    sentences.push(() => {
        var subject = Noun("cat")
            .determiner(Determiner("the"));

        var object = Noun("snails")
            .prepositionalPhrase(PrepositionPhrase(Preposition("from"), Noun("France")))

        return Clause(subject, Predicate(Verb("ate"), object))
            .toString();
    });

    sentences.push(() => {
        var subject = Noun("cat")
            .determiner(Determiner("the"));

        return Clause(subject, Predicate(Verb("ate"), Noun("rocks")))
            .prepositionalPhrase(PrepositionPhrase(Preposition("on"), Noun("mat").determiner("the")))
            .prepositionalPhrase(PrepositionPhrase(Preposition("with"), Noun("Mum")))
            .prepositionalPhrase(PrepositionPhrase(Preposition("under"), Noun("supervision").determiner("my")))
            .toString();
    });*/



    sentences.forEach(ii => {
        if(typeof ii == "function") {
            console.log(ii());
        }
    });

    return <div>
        <h1>Phraser</h1>
        <p>Hello. This is not an autogenerated sentence. But perhaps someday it will be.</p>
        {sentences.map((ii, kk) => typeof ii == "function"
            ? <p key={kk}>{ii()}</p>
            : <span key={kk} dangerouslySetInnerHTML={{__html: ii}} />
        )}
    </div>;
}

