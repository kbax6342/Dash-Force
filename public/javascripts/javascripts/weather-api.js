var app = angular.module('app', []);
.provider('Weather', function(){
  var apiKey =

  this.setApiKey = function(key){
    if(key) this.apiKey = key;
  }

  this.$get = function($http){
    return{
      //service object
    }
  }
});
