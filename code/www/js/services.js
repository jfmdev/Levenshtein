
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
                moment.locale(newLang);
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
         * @param {String} difficulty The difficulty.
         * @returns {Array} An array of strings.
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


        /**
         * Gets the duration of a game's round for a given difficulty.
         *
         * @param {String} difficulty The difficulty.
         * @returns {Number} The number of seconds.
         */
        getSeconds: function(difficulty) {
            if(difficulty == 'easy') return 6;
            if(difficulty == 'normal') return 5;
            if(difficulty == 'hard') return 4;
            return 5;
        },

        /**
         * Gets the maximum distance for a given difficulty.
         *
         * @param {String} difficulty The difficulty.
         * @returns {Number} A number.
         */
        getMaxDistance: function(difficulty) {
            if(difficulty == 'easy') return 3;
            if(difficulty == 'normal') return 4;
            if(difficulty == 'hard') return 5;
            return 4;
        },
    };

    return list;
});

// Service for get the settings of a game.
moduleSvc.factory('Scores', function() {
    // Initialize score list.
    var scores = amplify.store("scores");
    if(scores == null || (typeof scores !== 'object')) scores = {};

    // Create service's object.
    var scoresSvc = {
        /**
         * Get the top 10 scores for a given difficulty.
         *
         * @param {String} difficulty The difficulty.
         * @returns {Array} An associative array with the scores.
         */
        getScores: function(difficulty) {
            var someScores = scores[difficulty];
            if(someScores == null || !Array.isArray(someScores)) someScores = [];
            return someScores;
        },

        /**
         * Get the highest score for a given difficulty.
         *
         * @param {String} difficulty The difficulty.
         * @returns {Number} The points of the higher score.
         */
        getHighestScore: function(difficulty) {
            var someScores = scoresSvc.getScores(difficulty);
            return someScores.length > 0? someScores[0].value : 0;
        },

        /**
         * Submits an score.
         *
         * @param {String} difficulty The difficulty in which the score was achieved
         * @param.{Number} points The score value.
         * @returns {Boolean} A boolean indicating if the score is within the top list.
         */
        submitScore: function(difficulty, points) {
            var res = false;

            // Check that the score's list if not empty.
            if(scores[difficulty] == null) {
                scores[difficulty] = [];
            }

            // Verify if the new score must be added to the list.
            if(points > 0 && (scores[difficulty].length < 10 || scores[difficulty][9].value < points)) {
                // Add new score and sort list.
                scores[difficulty].push({value: points, date: new Date().getTime()});
                scores[difficulty].sort(function(a,b) { return - (a.value - b.value); });

                // Keep only the first 10 scores.
                if(scores[difficulty].length > 10) scores[difficulty] = scores[difficulty].slice(0, 10);

                // Store new score list and update flag.
                amplify.store("scores", scores);
                res = true;
            }

            return res;
        },
    };

    return scoresSvc;
});
