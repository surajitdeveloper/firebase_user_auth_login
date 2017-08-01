var config = {
		apiKey: "AIzaSyBHOmWqfKAvzGM4a5kfV2fhaRXh3Zl5sCw",
	    authDomain: "testsecureproject.firebaseapp.com",
	    databaseURL: "https://testsecureproject.firebaseio.com",
	    projectId: "testsecureproject",
	    storageBucket: "",
	    messagingSenderId: "848981853689"
};
firebase.initializeApp(config);
var firebaseDataBase = firebase.database();
var app = angular.module("business", ["ngRoute","ngSanitize","ngMaterial"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "template/landing.html"
    })
    .when("/login",
    {
        templateUrl : "template/login.html"
    })
    .when("/register",
    {
        templateUrl : "template/register.html"
    })
    .when("/tab",
    {
        templateUrl : "template/tabs.html"
    });
});

app.controller("tabs",function($scope,$location,$http,$timeout, $mdSidenav)
{
	$scope.loading=true;
	$scope.logout = function()
	{
		firebase.auth().signOut().then(function() 
			{
				localStorage.uid = "";
				$location.path("/login");
				$scope.$apply();
			}).catch(function(error) {
			  	swal("Alert","error in signout");
			});
	}
    $scope.get_user_data = function()
    {
    	if(localStorage.uid == undefined || localStorage.uid  == "" || localStorage.uid == null)
    		{
    			$location.path("/login");
    		}
    	else
    		{
    		var user_ref = firebaseDataBase.ref('users/' + localStorage.uid);
    		user_ref.on("value", function(snapshot)
    				{
    					$scope.loading=false;
    		      		var get_firebase_data = snapshot.val();
    		      		$scope.fullname = get_firebase_data.name;
    		      		$scope.$apply();
    				});
    		}
    	
    } 
});
app.controller("register", function($scope,$http,$location)
{
    $scope.loading=false;
    $scope.register = function(username,email,password)
    {
        if(username != undefined && email != undefined && password != undefined)
        {
            var data = {"todo":"register","fullname": username,"email":email,"password":password};
            $scope.loading=true;
            //reg sec
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user)
            		{
            			
            			$scope.loading=false;
            			firebaseDataBase.ref('users/' + user.uid).set({
            		        email: user.email,
            		        uid : user.uid,
            		        name: username,
            		        data: data
            		    });
            			localStorage.uid = user.uid;
            			$location.path("/tab"); 
            			$scope.$apply();
            		}).catch(function(error) 
            		{
            			$scope.loading=false;
            			var errorCode = error.code;
            			var errorMessage = error.message;
            			var full_error = JSON.stringify(error);
            			swal("Alert",errorMessage);
            			$scope.$apply();
            		});
        }
        else
        {
            swal("Error","All Data required");
        }
    }
});
app.controller('login', function($scope,$http,$location) 
{
    $scope.loading=false;
    $scope.login = function(username,password)
    {
        if(username != undefined && password != undefined)
        {
            $scope.loading=true;
            var data = {"todo": "login","username": username,"password": password};
            //login sec
            firebase.auth().signInWithEmailAndPassword(username, password).then(function(user)
            		{
            			$scope.loading=false;
            			localStorage.uid = user.uid;
            			$location.path("/tab"); 
            			$scope.$apply();
            		}).catch(function(error) {
            			$scope.loading=false;
            	  var errorCode = error.code;
            	  var errorMessage = error.message;
            	  var full_error = JSON.stringify(error);
            	  swal("Alert",errorMessage);
            	  $scope.$apply();
            	});
        }
        else
        {
            swal("Error","All Data required");
        }
    }
});