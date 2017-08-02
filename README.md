# phraser
[![phraser npm](https://img.shields.io/npm/v/phraser.svg?style=flat-square)](https://www.npmjs.com/package/phraser)


## Early stages of development, please prepare for large amounts of changes until version 1.0.0.

A small natural language generator. Makes words reads goods.

- [API Documentation](https://blueflag.github.io/phraser/docs)

Phraser allows you to construct sentences using a syntax similar to sentence syntax trees, and render these to arrays of strings. Right now the development focus is on the lowest layer of language generation, which allows sentences to be defined by their sentence structure. This enforces basic grammar rules about valid word orders, pluralisation, verb tense / aspect / person / number and simple punctuation.

Use [Foxtype](https://foxtype.com/sentence-tree) to help visualise sentences in terms of their structure.

Over time this will be supported by lexicons so irregular verbs and pluralisations don't have to be manually provided. Then all this will form a solid base for a second layer of opinionated sentence constructors that will be able to take data and output sentence structures.

### Example usage

```
import {Constituent} from 'phraser';
const {Sentence, Clause, NP, PP, VP} = Constituent(Lexicon);

const sentence = Sentence(
    Clause(
        NP("dog").quantity(3).determiner("those"),
        VP("ate", NP("food")).adverb("quickly", "middle")
    ).modifier(
        PP("from", NP("trash can").a().adjective("huge"))
    )
);

console.log(sentence.renderString());

// outputs "Those 3 dogs quickly ate food from a huge trash can."

```
