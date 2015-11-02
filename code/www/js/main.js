// Declare module.
var module = angular.module('myApp', ["module.Services", "module.Controllers", 'ngRoute', 'pascalprecht.translate']);

// Define routes.
module.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'IntroController',
            templateUrl: 'views/intro.html'
        })
        .when('/game/:difficulty?', {
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
        Easy: 'Easy',
        Normal: 'Normal',
        Hard: 'Hard',
        'Go back': 'Go back',
        Finalize: 'Finalize',
        'No scores available': 'No scores available',
        points: 'points',
    });
    $translateProvider.translations('es', {
        Play: 'Jugar',
        Scores: 'Puntajes',
        'How to play': 'Como jugar',
        Easy: 'Fácil',
        Normal: 'Normal',
        Hard: 'Difícil',
        'Go back': 'Regresar',
        Finalize: 'Finalizar',
        'No scores available': 'No hay puntajes disponibles',
        points: 'puntos',
    });
    $translateProvider.translations('fr', {
        Play: 'Jouer',
        Scores: 'Scores',
        'How to play': 'Comment jouer',
        Easy: 'Facile',
        Normal: 'Moyen',
        Hard: 'Difficile',
        'Go back': 'Retourner',
        Finalize: 'Finaliser',
        'No scores available': 'Pas de scores disponibles',
        points: 'points',
    });
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.preferredLanguage('en');
});
