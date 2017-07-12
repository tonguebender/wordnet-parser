function parse(fileContent) {
  return fileContent
    .split('\n')
    .reduce((res, line) => {
      // skipping empty lines and top comment section
      if (line && !line.match(/^\s\s/)) {
        const data = line.split(' ');
        let i =0;
        const lemma = data[i].replace(/_/g, ' ');

        i = i + 1;
        const pos = data[i];

        i = i + 1;
        const synset_cnt = +data[i];

        i = i + 1;
        const p_cnt = +data[i];

        const ptr_symbol = data.slice(i + 1, i + 1 + p_cnt);

        i = i + p_cnt + 1;
        const sense_cnt = +data[i];

        i = i + 1;
        const tagsense_cnt = +data[i];

        i = i + 1;
        const synset_offset = data.slice(i, i + synset_cnt);

        const parsed = {
          lemma,
          pos,
          synset_cnt,
          p_cnt,
          ptr_symbol,
          sense_cnt,
          tagsense_cnt,
          synset_offset
        };

        if (synset_offset.length === 0) {
          throw new Error('synset_offset is empty for:', line, parsed);
        }
        if (synset_cnt !== synset_offset.length) {
          throw new Error('Wrong length of synset_offset is empty for:', line, parsed);
        }
        if (p_cnt !== ptr_symbol.length) {
          throw new Error('Wrong length of ptr_symbol is empty for:', line, parsed);
        }

        res.push(parsed);
      }

      return res;
    }, []);
}

module.exports = parse;
