function parse(fileContent) {
  return fileContent
    .split('\n')
    .reduce((res, line) => {
      // skipping empty lines and top comment section
      if (line && !line.match(/^\s\s/)) {
        const pipePos = line.indexOf('|');
        const dataLine = line.substring(0, pipePos - 1);
        const gloss = line.substring(pipePos + 2);
        const data = dataLine.split(' ');

        let i = 0;
        const synset_offset = data[i];

        i = i + 1;
        const lex_filenum = data[i];

        i = i + 1;
        const ss_type = data[i];

        i = i + 1;
        const w_cnt = parseInt(data[i], 16);

        i = i + 1;
        const word = data.slice(i, i + (w_cnt * 2));

        i = i + (w_cnt * 2);
        const p_cnt = +data[i];

        const parsed = {
          synset_offset,
          lex_filenum,
          ss_type,
          w_cnt,
          word,
          p_cnt,
          gloss
        };
        if (w_cnt !== word.length / 2) {
          console.log('Wrong length of word for:', line, parsed);
        }
        if (!gloss.trim()) {
          console.log('Empty gloss for:', line, parsed);
        }

        res[synset_offset] = parsed;
      }

      return res;
    }, {});
}

module.exports = parse;
