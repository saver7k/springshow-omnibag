angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
  .controller('SearchCtrl', function($scope, BLE){
    $scope.sendColor = function(val){
      BLE.sendColor( val );
    }
    $scope.current = 'original';
    $scope.colors = [
      {color: 'beige', label: 'Beige'},
      {color: 'camel', label: 'Camel'},
      {color: 'salmon', label: 'Salmon Pink'},
      {color: 'navajo', label: 'Navajo White'},
      {color: 'niagara', label: 'Niagara'},
      {color: 'primrose', label: 'Primrose'}
    ];
    $scope.setColor = function(color){
      $scope.current = color;
    }
  })
  .controller('BLECtrl', function($scope, BLE) {

    // keep a reference since devices will be added
    $scope.devices = BLE.devices;

    var success = function () {
      if ($scope.devices.length < 1) {
        // a better solution would be to update a status message rather than an alert
        alert("Didn't find any Bluetooth Low Energy devices.");
      }
    };

    var failure = function (error) {
      alert(error);
    };

    // pull to refresh
    $scope.onRefresh = function() {
      BLE.scan().then(
        success, failure
      ).finally(
        function() {
          $scope.$broadcast('scroll.refreshComplete');
        }
      )
    }

    // initial scan
    BLE.scan().then(success, failure);

  })
  .controller('BLEDetailCtrl', function($scope, $stateParams, BLE) {
    // ASCII only
    var stringToBytes = function (string) {
      var array = new Uint8Array(string.length);
      for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
      }
      return array.buffer;
    };

    BLE.connect($stateParams.deviceId).then(
      function(peripheral) {
        $scope.device = peripheral;
      }
    );
    $scope.state = false;
    $scope.sendColor = function(color){
      $scope.state = !$scope.state;
      var data = stringToBytes(color);
      ble.writeWithoutResponse($scope.device.id, 'ffe0', 'ffe1', data, function(){
        console.log('success');
      }, function(){
        console.log('failure');
      });
    };
  })
  .factory('BLE', function($q) {

    var connected;

    return {

      devices: [],

      scan: function() {
        var that = this;
        var deferred = $q.defer();

        that.devices.length = 0;

        // disconnect the connected device (hack, device should disconnect when leaving detail page)
        if (connected) {
          var id = connected.id;
          ble.disconnect(connected.id, function() {
            console.log("Disconnected " + id);
          });
          connected = null;
        }

        ble.startScan([],  /* scan for all services */
          function(peripheral){
            that.devices.push(peripheral);
          },
          function(error){
            deferred.reject(error);
          });

        // stop scan after 5 seconds
        setTimeout(ble.stopScan, 5000,
          function() {
            deferred.resolve();
          },
          function() {
            console.log("stopScan failed");
            deferred.reject("Error stopping scan");
          }
        );

        return deferred.promise;
      },
      connect: function(deviceId) {
        var deferred = $q.defer();

        ble.connect(deviceId,
          function(peripheral) {
            alert('connected');
            connected = peripheral;
            deferred.resolve(peripheral);
          },
          function(reason) {
            alert(reason);
            deferred.reject(reason);
          }
        );

        return deferred.promise;
      }
    };
  })
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

