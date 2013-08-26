(function() {
  var app, draftPickerCtrl;

  app = angular.module("DraftPickerApp", ['firebase']);

  app.value('fbURL', 'https://brilliance.firebaseio.com/').factory('Fantasy', function(angularFireCollection, fbURL) {
    return angularFireCollection(fbURL);
  });

  draftPickerCtrl = function($scope, angularFire) {
    var playersHandlers;
    $scope.current_needs = {};
    $scope.playerVal = function(item) {
      var val;
      val = item['2012_points'];
      if (item.AdjRating && item.AdjRating > 0) {
        val *= item.AdjRating;
      }
      if (item.Injury && item.Injury !== "0") {
        val *= item.Injury;
      }
      if (item.TeamChange && item.TeamChange !== "0") {
        val *= item.TeamChange;
      }
      return val.toFixed(2);
    };
    $scope.fixNumbers = function() {
      var player, _i, _len, _ref, _results;
      _ref = $scope.players;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        _results.push(player['2012_points'] = parseFloat(player['2012_points']));
      }
      return _results;
    };
    angularFire("https://brilliance.firebaseio.com/roster", $scope, 'roster', {}).then(function() {
      return angularFire("https://brilliance.firebaseio.com/all_players", $scope, 'all_players', {}).then(function() {
        return angularFire("https://brilliance.firebaseio.com/players", $scope, 'players', []).then(function() {
          return angularFire("https://brilliance.firebaseio.com/byes", $scope, 'byes', {}).then(playersHandlers);
        });
      });
    });
    return playersHandlers = function() {
      var position, resetByes;
      $scope.getBye = function(player) {
        return $scope.byes[$scope.all_players[player].Team];
      };
      (resetByes = function() {
        var bye, week, _ref, _results;
        if (!$scope.bye_counts) {
          $scope.bye_counts = {};
        }
        _ref = $scope.byes;
        _results = [];
        for (bye in _ref) {
          week = _ref[bye];
          _results.push($scope.bye_counts[week] = 0);
        }
        return _results;
      })();
      $scope.positionNeeds = function(position) {
        var have, need, req, sel, _i, _len, _ref;
        resetByes();
        need = $scope.roster.required[position];
        if ($scope.roster.selections.length === 0) {
          return need;
        }
        have = 0;
        _ref = $scope.roster.selections;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sel = _ref[_i];
          $scope.bye_counts[$scope.getBye(sel)] += 1;
          if ($scope.all_players[sel].Position === position) {
            have += 1;
          }
        }
        req = need - have;
        if (req < -1) {
          $scope.players = $scope.players.filter(function(elem) {
            return $scope.all_players[elem].Position !== position;
          });
        }
        return req;
      };
      if (!$scope.roster.selections) {
        $scope.roster.selections = [];
      }
      for (position in $scope.roster.required) {
        $scope.current_needs[position] = $scope.positionNeeds(position);
      }
      $scope.doReSort = function() {
        return $scope.players.sort(function(a, b) {
          return $scope.playerVal($scope.all_players[b]) - $scope.playerVal($scope.all_players[a]);
        });
      };
      $scope.byeWarnings = function(player) {
        var bye;
        bye = $scope.getBye(player);
        if ($scope.bye_counts[bye] > 4) {
          return 'text-danger';
        }
        if ($scope.bye_counts[bye] > 2) {
          return 'text-warning';
        }
        return '';
      };
      $scope.reset = function() {
        var player;
        $scope.players = [];
        for (player in $scope.all_players) {
          $scope.players.push(player);
        }
        $scope.roster.selections = [];
        $scope.roster.bye_warnings = {};
        for (position in $scope.roster.required) {
          $scope.current_needs[position] = $scope.positionNeeds(position);
        }
        resetByes();
        return $scope.doReSort();
      };
      $scope.selectPlayer = function(index) {
        var playerData, playerName;
        playerName = $scope.players.splice(index, 1);
        playerData = $scope.all_players[playerName];
        if (!$scope.roster.selections) {
          $scope.roster.selections = [];
        }
        $scope.roster.selections.push(playerName);
        return $scope.current_needs[playerData.Position] = $scope.positionNeeds(playerData.Position);
      };
      $scope.otherPicked = function(index) {
        var playerName;
        return playerName = $scope.players.splice(index, 1);
      };
      return $scope.removePlayer = function(playerName) {
        $scope.roster.selections = $scope.roster.selections.filter(function(elem) {
          return elem !== playerName;
        });
        $scope.players.push(playerName[0]);
        for (position in $scope.roster.required) {
          $scope.current_needs[position] = $scope.positionNeeds(position);
        }
        return $scope.doReSort();
      };
    };
  };

  app.controller('draftPickerCtrl', ['$scope', 'angularFire', draftPickerCtrl]);

}).call(this);
