Levenshtein Challenge - Words
=============================

The current folders contains the dictionaries filtered for generate the list of words used by the application.

These dictionaries were downloaded from the website of [WinEdt](http://www.winedt.com/) and then processed using the scripts `stats.js` and `parse.js`.

In order to regenerate the list of words, the following sentences must be executed in the console (after unzipping the files `en-us.7z`, `es.7z` and `fr.7z`):

```
node parse.js us.dic
node parse.js es.dic
node parse.js fr.dic
```
