
// Declare module.
var moduleCtrl = angular.module('module.Controllers', ['pascalprecht.translate']);

// Controller for the home view.
moduleCtrl.controller('IntroController', function ($scope, $translate, Settings) {
    // Initialize language.
    $scope.lang = Settings.getLang();

    // Listen for changes in the language.
    $scope.$watch('lang', function() {
        Settings.setLang($scope.lang);
    });
});

moduleCtrl.controller('GameController', function ($scope, Words) {
    // Initialize variables.
    var words = Words.get('normal');
    $scope.word1 = "";
    $scope.word2 = "";
    $scope.distance = 0;
    $scope.timer = 0;
    $scope.points = 0;
    $scope.message = null;
    var intervalCode = null;
    var start = null;
    var scores = amplify.store("scores");
    if(scores === null || !Array.isArray(scores)) scores = [];

    // Initialize a round.
    $scope.round = function() {
        // Stop timer.
        if(intervalCode !== null) {
            clearTimeout(intervalCode);
        }

        // Select first word.
        var index = parseInt(Math.random() * (words.length-1), 10);
        $scope.word1 = words[index];

        // Select the distance.
        $scope.distance = parseInt(Math.random() * 4, 10) + 1;

        // Search for a word that satisfy that distance.
        index = parseInt(Math.random() * (words.length-1), 10);
        var indexAux = index + 1;
        do{
            // Verify the case in which such word do not exists.
             if(index === indexAux) {
                 $scope.distance = ($scope.distance + 1)%5 + 1;
             }

            // Calculate the distance for the candidate word.
            indexAux = (indexAux + 1)%words.length;
            var lev = new Levenshtein($scope.word1, words[indexAux]);
        }while(lev.distance !== $scope.distance)
        $scope.word2 = words[indexAux];

        // Reset timer.
        $scope.timer = 6;
        start = new Date();
        intervalCode = setTimeout(function() { $scope.timeout(); }, 250);
    };
    $scope.round();

    $scope.timeout = function() {
        // Verify if the timeout as passed or if only the timer must be updated.
        var now = new Date();
        if(now.getTime() - start.getTime() > 6000) {
            // A timeout is like an incorrect answer.
            $scope.answer(-1);
        } else {
            // Decrease timer.
            $scope.timer = 6 - parseInt((now.getTime() - start.getTime())/1000, 10);

            // Set timeout again.
            intervalCode = setTimeout(function() { $scope.timeout(); }, 250);
        }

        // Update UI.
        $scope.$apply();
    };

    // Select an answer.
    $scope.answer = function(number) {
        // Stop timeout.
        clearTimeout(intervalCode);

        // Verify if the answer was correct.
        if(number === $scope.distance) {
            // Increase points.
            $scope.points += 5;

            // Show success message.
            $scope.message = "Good!";
            jQuery("#message").stop().css('color', 'green').css('opacity', 1).animate({opacity:0}, 800);
        } else {
            // Show error message.
            $scope.message = "Wrong... it was " + $scope.distance;
            jQuery("#message").stop().css('color', 'red').css('opacity', 1).animate({opacity:0}, 800);

            // Verify if points must be added to score.
            if($scope.points > 0 && (scores.length < 10 || scores[9].value < $scope.points)) {
                scores.push({value: $scope.points, date: new Date().getTime()});
                scores.sort(function(a,b) { return - (a.value - b.value); });
                if(scores.length > 10) scores = scores.slice(0, 10);
                amplify.store("scores", scores);
            }

            // Clear points.
            $scope.points = 0;
        }

        // Start a new round.
        $scope.round();
    };

    // Hide error and success messages.
    jQuery("#message").css('opacity', 0);
});

// Controller for the view for display scores.
moduleCtrl.controller('ScoresController', function ($scope) {
    $scope.scores = amplify.store("scores");

    $scope.niceDate = function(milliseconds) {
        return moment(milliseconds).format("LLL");
    };
});

// Controller for the help view.
moduleCtrl.controller('HelpController', function ($scope) {
    // Do nothing.
});
