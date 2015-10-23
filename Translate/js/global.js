var global=angular.module("global",[]);
global.controller('globalCtrl', function ($scope, $rootScope, $timeout, translationService) {
	//Spanish as default language
	$rootScope.Language='es';
	//Translate de HTML interface
	translationService.getTranslation($scope);
	
	$scope.changeLanguage= function(languageIn){
		$rootScope.Language=languageIn;
		translationService.getTranslation($scope);
		
	};
});
global.service('translationService', function($http, $rootScope, $timeout, $q) {
			 //translate of HTML
               this.getTranslation = function($scope) {
               //get current language
               var language =$rootScope.Language;               
               var languageFilePath = 'translations/translation_' + language + '.json';               
               $http.get(
                         languageFilePath
                         ).
               success(function(data, status) {
                       console.log("Request succeeded");
                       $timeout(function(){
                                $rootScope.$apply(function(){
                                                  $scope.translation = data;
                                                  })
                                }
                                )
                       }).
               error(function(data, status) {
                     console.log("Request failed " + status);
                     });
               };
			  //translate of JS strings
               this.getTranslationString = function(string) {
                   //get current language
                    var language =localStorage.getItem("languageGlobal");
                    var languageFilePath = 'translations/translation_' + language + '.json';
				  //use promises, have to wait till angular get and read de translation file, search the word and return it
                    return $http.get(languageFilePath)
                                        .then(function(response) {
                                            if (typeof response.data === 'object') {
                                                if(!angular.isUndefined(response.data[string])){
                                                    return response.data[string];
                                                }else{
                                                    return string;
                                                }

                                            } else {
                                                // invalid response
                                                return $q.reject(response.data);
                                            }

                                        }, function(response) {
                                            // something went wrong
                                            return $q.reject(response.data);
                                        });
                    };
});