var app = angular.module('myApp', ["ngRoute", "ngMaterial", 'ngAnimate', 'ngCookies']);

app.controller('myCtrl', function ($scope, $http, $mdDialog) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.status = "Good";
    $scope.teamList = [];
    $scope.updateTime = "Updating...";
    $scope.NumState = false;
    $scope.RankState = false;

    $scope.sortByNumber = function () {
        $scope.NumState = !$scope.NumState;
        if ($scope.NumState) {
            $scope.teamList.sort(function (a, b) { return a.NUM - b.NUM });
        }
        else {
            $scope.teamList.sort(function (a, b) { return b.NUM - a.NUM });
        }

        
    };
    $scope.sortByRank = function () {
        $scope.RankState = !$scope.RankState;
        if ($scope.RankState) {
            $scope.teamList.sort(function (a, b) { return a.RANK - b.RANK });
        }
        else {
            $scope.teamList.sort(function (a, b) { return b.RANK - a.RANK });
        }
        
    }
    //var url = 'http://localhost:61505/api/SCOUTING2019';
    var url = 'https://scoutingdataapi.azurewebsites.net/api/SCOUTING2019';
    $scope.loadTeams = function () {
        $scope.updateTime = "Updating...";
        $http({
            method: "GET",
            url: url
        }).then(function mySuccess(response) {
            $scope.teamList = [];
            var teams = response.data;
            for (var i = 0; i < teams.length; i++) {
                //first generate the new object we need with the basic stuff
                var team = $scope.teamConverion(teams[i]);
                $scope.teamList.push(team);
            }
            $scope.teamList.sort(function (a, b) { return a.RANK - b.RANK });
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            $scope.updateTime = date.getMonth() + 1 + "/" + date.getDate() + " " + hours + ":" + minutes + ":" + seconds + " " + ampm;
        }, function myError(response) {
            console.log(response);
            });
       

    }
    $scope.teamConverion = function (teams) {
        var temp = { "ID": teams.Id, "NUM": teams.NUM, "RANK": teams.RANK, "COMMENTS": teams.Comments.substring(0, 10) + "..." };
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
        if (teams.CLIMB3) {
            temp.HAB = "Level 3";
        }
        else if (teams.CLIMB2) {
            temp.HAB = "Level 2";
        }
        else if (teams.CLIMB1) {
            temp.HAB = "Level 1";
        }
        else {
            temp.HAB = "None";
        }
        return temp;
    }
    $scope.sendNew = function (teamData) {
        $http({
            method: "POST",
            url: url,
            data: JSON.stringify(teamData)
        }).then(function mySuccess(response) {
            //console.log(response.data);
            $scope.loadTeams()
        }, function myError(response) {
            console.log(response);
        });
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
                "RCKT_CARGO_H": (document.querySelector('#R_C_High').checked) ? 1 : 0,
                "RCKT_CARGO_M": (document.querySelector('#R_C_Med').checked) ? 1 : 0,
                "RCKT_CARGO_L": (document.querySelector('#R_C_Low').checked) ? 1 : 0,
                "RCKT_HATCH_H": (document.querySelector('#R_H_High').checked) ? 1 : 0,
                "RCKT_HATCH_M": (document.querySelector('#R_H_Med').checked) ? 1 : 0,
                "RCKT_HATCH_L": (document.querySelector('#R_H_Low').checked) ? 1 : 0,
                "CARGO_HATCH": (document.querySelector('#C_Hatchet').checked) ? 1 : 0,
                "CARGO_SCORE": (document.querySelector('#C_Cargo').checked) ? 1 : 0,
                "CARGO_FLOOR": (document.querySelector('#Cargo_floor').checked) ? 1 : 0,
                "HATCH_PASS": (document.querySelector('#Hatchet_passive').checked) ? 1 : 0,
                "CLIMB1": (document.querySelector('#Climb1').checked) ? 1 : 0,
                "CLIMB2": (document.querySelector('#Climb2').checked) ? 1 : 0,
                "CLIMB3": (document.querySelector('#Climb3').checked) ? 1 : 0,
                "Comments": (document.querySelector('#comment').value)                
            }
            $mdDialog.hide(newTeamValues);
        };
    }
    //controller for new team dialog
    function ViewController($scope, $mdDialog, number) {
        $scope.selectedTeam;
        $http(
            {
                method: "GET",
                url: url +"/"+ number
            }).then(function mySuccess(response)
            {
                var team = response.data;
                $scope.selectedTeam = team;
                document.querySelector('#teamId').value = team.NUM;
                document.querySelector('#name').value = team.NAME;
                document.querySelector('#rank').value = team.RANK;
                document.querySelector('#R_C_High').checked = team.RCKT_CARGO_H;
                document.querySelector('#R_C_Med').checked = team.RCKT_CARGO_M;
                document.querySelector('#R_C_Low').checked = team.RCKT_CARGO_L;
                document.querySelector('#R_H_High').checked = team.RCKT_CARGO_H;
                document.querySelector('#R_H_Med').checked = team.RCKT_HATCH_M;
                document.querySelector('#R_H_Low').checked = team.RCKT_HATCH_L;
                document.querySelector('#C_Hatchet').checked = team.CARGO_SCORE;
                document.querySelector('#C_Cargo').checked = team.CARGO_HATCH;
                document.querySelector('#Cargo_floor').checked = team.CARGO_FLOOR;
                document.querySelector('#Hatchet_passive').checked = team.HATCH_PASS;
                document.querySelector('#Climb1').checked = team.CLIMB1,
                document.querySelector('#Climb2').checked = team.CLIMB2,
                document.querySelector('#Climb3').checked = team.CLIMB3,
                document.querySelector('#comment').value = team.Comments;
            }, function myError(response)
            {
                console.log(response);
            });
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.delete = function () {
            $http(
                {
                    method: "DELETE",
                    url: url + "/" + $scope.selectedTeam.Id
                }).then(function mySuccess(response) {
                    console.log("Team Deleted");
                }, function myError(response) {
                        console.log(response);
                });
            $mdDialog.hide("Deleted");
        }
        $scope.answer = function () {
            var newTeamValues = {
                "Id": $scope.selectedTeam.Id,
                "NUM": document.querySelector('#teamId').value,
                "NAME": document.querySelector('#name').value,
                "RCKT_CARGO_H": (document.querySelector('#R_C_High').checked) ? 1 : 0,
                "RCKT_CARGO_M": (document.querySelector('#R_C_Med'). checked) ? 1 : 0,
                "RCKT_CARGO_L": (document.querySelector('#R_C_Low'). checked) ? 1 : 0,
                "RCKT_HATCH_H": (document.querySelector('#R_H_High'). checked) ? 1 : 0,
                "RCKT_HATCH_M": (document.querySelector('#R_H_Med'). checked) ? 1 : 0,
                "RCKT_HATCH_L": (document.querySelector('#R_H_Low'). checked) ? 1 : 0,
                "CARGO_HATCH": (document.querySelector('#C_Hatchet'). checked) ? 1 : 0,
                "CARGO_SCORE": (document.querySelector('#C_Cargo'). checked) ? 1 : 0,
                "CARGO_FLOOR": (document.querySelector('#Cargo_floor'). checked) ? 1 : 0,
                "HATCH_PASS": (document.querySelector('#Hatchet_passive').checked) ? 1 : 0,
                "CLIMB1": (document.querySelector('#Climb1').checked) ? 1 : 0,
                "CLIMB2": (document.querySelector('#Climb2').checked) ? 1 : 0,
                "CLIMB3": (document.querySelector('#Climb3').checked) ? 1 : 0,
                "Comments": (document.querySelector('#comment').value)
            }
            $http({
                method: "PUT",
                url: url + "/" + newTeamValues.Id,
                data: JSON.stringify(newTeamValues)
            }).then(function mySuccess(response) {
                console.log("updated");
            }, function myError(response) {
                console.log(response);
            });
            $mdDialog.hide("update", newTeamValues);
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
    $scope.view = function (ev, num) {
        $mdDialog.show({
            locals: { number: num },
            controller: ViewController,
            templateUrl: '/pages/ViewTeam.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function (answer, teamData) {
                if (answer === "Deleted") {
                    $scope.loadTeams();
                }
                else if (answer === "update") {
                    $scope.loadTeams()
                }

            }, function () {
                // $scope.status = 'You cancelled the dialog.';
            });
    }

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

