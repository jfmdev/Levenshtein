// Declare module.
var module = angular.module('myApp', ["module.Services", "module.Controllers", 'ngRoute', 'pascalprecht.translate']);

// Define routes.
module.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'IntroController',
            templateUrl: 'views/intro.html'
        })
        .when('/game', {
            controller: 'GameController',
            templateUrl: 'views/game.html'
        })
        .when('/help', {
            controller: 'HelpController',
            templateUrl: 'views/help.html'
        })
        .when('/scores', {
            controller: 'ScoresController',
            templateUrl: 'views/scores.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Define translations.
module.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        Play: 'Play',
        Scores: 'Scores',
        'How to play': 'How to play',
    });
    $translateProvider.translations('es', {
        Play: 'Jugar',
        Scores: 'Puntajes',
        'How to play': 'Como jugar',
    });
    $translateProvider.translations('fr', {
        Play: 'Jouer',
        Scores: 'Scores',
        'How to play': 'Comment jouer',
    });
    $translateProvider.preferredLanguage('en');
});
