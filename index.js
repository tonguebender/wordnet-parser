const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const indexParser = require('./lib/index_file_parser');
const dataParser = require('./lib/data_file_parser');

const WORD_NET_POS = ['adj', 'adv', 'noun', 'verb'];

const DATA_DIR = process.env.DATA_DIR || './dict/';


function processPos(pos) {
  return Promise
    .all([
      readFile(path.resolve(DATA_DIR, `index.${pos}`)),
      readFile(path.resolve(DATA_DIR, `data.${pos}`))
    ])
    .then(data => {
      return Promise.all([
        indexParser(data[0].toString()),
        dataParser(data[1].toString())
      ]);
    })
    .then(res => {
      const index = res[0];
      const data = res[1];

      return index.map(lemma => {
        return {
          lemma: lemma.lemma,
          gloss: lemma.synset_offset.map(offset => data[offset].gloss.trim())
        }
      })
    })
    .catch(err => {
      console.log('ERROR:', err);
    });
}

processPos(WORD_NET_POS[0])
  .then(res => {
    console.log('result:', res.slice(10000, 10101))
  }, err => {
    console.log('error:', err);
  });
