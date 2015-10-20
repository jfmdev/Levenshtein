
// Declare module.
var moduleSvc = angular.module('module.Services', ['pascalprecht.translate']);

// Service for store the user settings.
moduleSvc.factory('Settings', function($translate) {
    var settings = {
        /**
         * Set the UI language.
         *
         * @param {string} newlang The new UI lanuage.
         */
        setLang: function(newLang) {
            if(newLang === 'en' || newLang === 'es' || newLang === 'fr') {
                amplify.store("lang", newLang);
                $translate.use(newLang);
            }
        },

        /**
         * Gets the current user language.
         *
         * @returns {Boolean} A boolean indicating if the user is logged.
         */
        getLang: function() {
            var lang = amplify.store("lang");
            if(lang !== 'en' && lang !== 'fr' && lang !== 'es') {
                lang = 'en';
            }
            return lang;
        },
    };

    return settings;
});

// Service for get the list of words to use.
moduleSvc.factory('Words', function(Settings) {
    var list = {
        /**
         * Get the words to use in the game.
         *
         * @param {string} difficulty The difficulty.
         */
        get: function(difficulty) {
            var words = us_normal;
            var lang = Settings.getLang();
console.log(lang + " - " + words);
            if(lang === 'en' && difficulty === 'easy') { words = us_easy; }
            if(lang === 'en' && difficulty === 'normal') { words = us_normal; }
            if(lang === 'en' && difficulty === 'hard') { words = us_hard; }
            if(lang === 'es' && difficulty === 'easy') { words = es_easy; }
            if(lang === 'es' && difficulty === 'normal') { words = es_normal; }
            if(lang === 'es' && difficulty === 'hard') { words = es_hard; }
            if(lang === 'fr' && difficulty === 'easy') { words = fr_easy; }
            if(lang === 'fr' && difficulty === 'normal') { words = fr_normal; }
            if(lang === 'fr' && difficulty === 'hard') { words = fr_hard; }
            return words
        },
    };

    return list;
});
