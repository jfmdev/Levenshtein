
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

// Service for get the settings of a game.
moduleSvc.factory('Game', function(Settings) {
    var list = {
        /**
         * Get the words to use in the game.
         *
         * @param {string} difficulty The difficulty.
         */
        getWords: function(difficulty) {
            var words = us_normal;
            var lang = Settings.getLang();
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

        getSeconds: function(difficulty) {
            if(difficulty == 'easy') return 6;
            if(difficulty == 'normal') return 5;
            if(difficulty == 'hard') return 4;
            return 5;
        },

        getMaxDistance: function(difficulty) {
            if(difficulty == 'easy') return 3;
            if(difficulty == 'normal') return 4;
            if(difficulty == 'hard') return 5;
            return 4;
        },
    };

    return list;
});
