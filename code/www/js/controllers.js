
// Declare module.
var moduleCtrl = angular.module('module.Controllers', ['pascalprecht.translate']);

// Controller for the navigation bar.
moduleCtrl.controller('NavBarController', function ($scope, Settings) {
    // Restore previously selected language.
    $scope.start = function() {
        Settings.setLang(Settings.getLang());
    };
});

// Controller for the home view.
moduleCtrl.controller('IntroController', function ($scope, $translate, Settings) {
    // Initialize language.
    $scope.lang = Settings.getLang();

    // Listen for changes in the language.
    $scope.$watch('lang', function() {
        Settings.setLang($scope.lang);
    });
});

moduleCtrl.controller('GameController', function ($scope, $routeParams, $timeout, Game, Scores) {
    // Initialize variables.
    var words = Game.getWords($routeParams.difficulty);
    var roundTime = Game.getSeconds($routeParams.difficulty)*1000;
    $scope.maxDistance = Game.getMaxDistance($routeParams.difficulty);
    $scope.word1 = "";
    $scope.word2 = "";
    $scope.distance = 0;
    $scope.timer = 0;
    $scope.points = 0;
    $scope.message = null;
    $scope.successRate = 0;
    $scope.record = Scores.getHighestScore($routeParams.difficulty);
    var intervalCode = null;
    var start = null;
    var stats_total = 0;
    var stats_correct = 0;

    // Function to update countdown.
    $scope.updateCountDown = function() {
        // Verify if the timeout as passed or if only the timer must be updated.
        var now = new Date();
        if(now.getTime() - start.getTime() > roundTime) {
            // A timeout is like an incorrect answer.
            $scope.selectAnswer(-1);
        } else {
            // Decrease timer.
            $scope.timer = parseFloat((roundTime - (now.getTime() - start.getTime()))/1000).toFixed(2);

            // Set timeout again.
            intervalCode = $timeout(function() { $scope.updateCountDown(); }, 110);
        }

        // Update UI.
        if(!$scope.$$phase) $scope.$apply();
    };

    // Initialize a round.
    $scope.startRound = function() {
        // Stop timer if need.
        if(intervalCode !== null) $timeout.cancel(intervalCode);

        // Select first word.
        var index = parseInt(Math.random() * (words.length-1), 10);
        $scope.word1 = words[index];

        // Select the distance.
        $scope.distance = Math.round(Math.random() * ($scope.maxDistance-1)) + 1;

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
        $scope.updateCountDown();
    };
    $scope.startRound();

    // Select an answer.
    $scope.selectAnswer = function(number) {
        // Update stat count.
        stats_total++;

        // Verify if the answer was correct.
        if(number === $scope.distance) {
            // Increase points and stats.
            $scope.points += 5;
            stats_correct++;

            // Verify if the record must be increased.
            if($scope.points > $scope.record) $scope.record = $scope.points;

            // Show success message.
            $scope.message = "Good!";
            jQuery("#message").stop().css('color', 'green').css('opacity', 1).animate({opacity:0}, 800);
        } else {
            // Show error message.
            $scope.message = "Wrong... it was " + $scope.distance;
            jQuery("#message").stop().css('color', 'red').css('opacity', 1).animate({opacity:0}, 800);

            // Verify if points must be added to score.
            Scores.submitScore($routeParams.difficulty, $scope.points);
            $scope.record = Scores.getHighestScore($routeParams.difficulty);

            // Clear points.
            $scope.points = 0;
        }

        // Update success rate.
        $scope.successRate = parseInt(100*stats_correct/stats_total);

        // Start a new round.
        $scope.startRound();
    };

    $scope.$on("$destroy", function(){
        // Stop timer if need.
        if(intervalCode !== null) $timeout.cancel(intervalCode);
    });

    // Hide error and success messages.
    jQuery("#message").css('opacity', 0);
});

// Controller for the view for display scores.
moduleCtrl.controller('ScoresController', function ($scope, Scores) {
    $scope.easyScores = Scores.getScores('easy');
    $scope.normalScores = Scores.getScores('normal');
    $scope.hardScores = Scores.getScores('hard');

    $scope.niceDate = function(milliseconds) {
        return moment(milliseconds).format("LLL");
    };
});

// Controller for the help view.
moduleCtrl.controller('HelpController', function ($scope, Settings) {
    // Get language.
    $scope.lang = Settings.getLang();
});
