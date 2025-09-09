const express = require('express');
const path = require('path');

let nlp;
(async () => {
nlp = (await import('compromise')).default;
})();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function posTagger(sentence) {
if (!nlp) return [];
const doc = nlp(sentence);
const terms = doc.terms().json();

return terms.map(termObj => {
    const word = termObj.text || '';
    const tags = termObj.terms && termObj.terms[0] && Array.isArray(termObj.terms[0].tags)
        ? termObj.terms[0].tags
        : [];

    let pos = 'other';
    if (tags.includes('Verb')) pos = 'verb';
    else if (tags.includes('Noun')) pos = 'noun';
    else if (tags.includes('Adjective')) pos = 'adjective';
    else if (tags.includes('Adverb')) pos = 'adverb';
    else if (tags.includes('Pronoun')) pos = 'pronoun';
    else if (tags.includes('Preposition')) pos = 'preposition';
    else if (tags.includes('Conjunction')) pos = 'conjunction';
    else if (tags.includes('Determiner')) pos = 'determiner';
    else if (tags.includes('Value')) pos = 'numeral';
    else if (tags.includes('Expression')) pos = 'interjection';
    else if (tags.includes('Punctuation')) pos = 'punctuation';

    return { word, pos, tags };
});
}

app.post('/analyze', (req, res) => {
const { sentence } = req.body;
if (!sentence) {
    return res.status(400).json({ error: 'Hiányzó mondat.' });
}
const analysis = posTagger(sentence);
res.json(analysis);
});

app.listen(PORT, () => {
console.log(`✅ Offline szerver fut: http://localhost:${PORT}`);
});