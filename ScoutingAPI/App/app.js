var app = angular.module('myApp', ["ngRoute", "ngMaterial", 'ngAnimate', 'ngCookies']);

app.controller('myCtrl', function ($scope, $http, $mdDialog) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.status = "Good";
    //var url = 'http://localhost:61505/api/SCOUTING2019';
    var url = 'https://scoutingdataapi.azurewebsites.net/api/SCOUTING2019';
    $scope.loadTeams = function () {
        $http({
            method: "GET",
            url: url
        }).then(function mySuccess(response) {
            $scope.teamList = [];
            console.log(response.data[0]);
            var teams = response.data;
            for (var i = 0; i < teams.length; i++) {
                //first generate the new object we need with the basic stuff
                var team = $scope.teamConverion(teams[i]);
                $scope.teamList.push(team);
            }

        }, function myError(response) {
            console.log(response.statusText);
        });
    }
    $scope.teamConverion = function (teams) {
        var temp = { "NUM": teams.NUM, "NAME": teams.NAME, "COMMENTS": teams.Comments.substring(0, 10) + "..." };
        //check if we can do the rocket at all
        if (teams.RCKT_HATCH_H ||
            teams.RCKT_HATCH_M ||
            teams.RCKT_HATCH_L ||
            teams.RCKT_CARGO_H ||
            teams.RCKT_CARGO_M ||
            teams.RCKT_CARGO_L) {
            temp.ROCKET = "Yes";
        }
        else {
            temp.ROCKET = "No";
        }
        //check if we can do the cargo ship
        if (teams.CARGO_SCORE ||
            teams.CARGO_HATCH) {
            temp.SHIP = "Yes";
        }
        else {
            temp.SHIP = "No";
        }
        //check what level we can climb
        if (teams.CLIMB1) {
            temp.HAB = "Level 1";
        }
        else if (teams.CLIMB2) {
            temp.HAB = "Level 2";
        }
        else if (teams.CLIMB3) {
            temp.HAB = "Level 3";
        }
        else {
            temp.HAB = "None";
        }
        return temp;
    }
    $scope.sendNew = function (teamData) {
        $http.post(url, JSON.stringify(teamData));
        $scope.teamList.push($scope.teamConverion(teamData));
    }
    //controller for new team dialog
    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function () {
            var newTeamValues = {
                "NUM": document.querySelector('#teamId').value,
                "NAME": document.querySelector('#name').value,
                "RCKT_CARGO_H": (document.querySelector('#R_C_High').value) ? "1" : "0",
                "RCKT_CARGO_M": (document.querySelector('#R_C_Med').value) ? "1" : "0",
                "RCKT_CARGO_L": (document.querySelector('#R_C_Low').value) ? "1" : "0",
                "RCKT_HATCH_H": (document.querySelector('#R_H_High').value) ? "1" : "0",
                "RCKT_HATCH_M": (document.querySelector('#R_H_Med').value) ? "1" : "0",
                "RCKT_HATCH_L": (document.querySelector('#R_H_Low').value) ? "1" : "0",
                "CARGO_HATCH": (document.querySelector('#C_Hatchet').value) ? "1" : "0",
                "CARGO_SCORE": (document.querySelector('#C_Cargo').value) ? "1" : "0",
                "CARGO_FLOOR": (document.querySelector('#Cargo_floor').value) ? "1" : "0",
                "HATCH_PASS": (document.querySelector('#Hatchet_passive').value) ? "1" : "0",
                "Comments": (document.querySelector('#comment').value)                
            }
            $mdDialog.hide(newTeamValues);
        };
    }
    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/pages/NewTeam.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function (answer) {
                $scope.sendNew(answer);

            }, function () {
                // $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.loadTeams();
});

/*
This directive allows us to pass a function in on an enter key to do what we want.
 */
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

