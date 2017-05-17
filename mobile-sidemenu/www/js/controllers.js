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
    $scope.trending = [
      {color: 'beige', label: 'Beige', RGB: (245,245,220)},
      {color: 'camel', label: 'Camel', RGB: (194,155,104)},
      {color: 'salmon', label: 'Salmon Pink', RGB: (255,152,151)},
      {color: 'navajo', label: 'Navajo White', RGB: (255,223,170)},
      {color: 'niagara', label: 'Niagara', RGB: (82,131,165)},
      {color: 'primrose', label: 'Primrose', RGB: (247,210,72)},
      {color: 'lapis', label: 'Lapis Blue', RGB: (0,73,143)}
    ];

        $scope.newlyadded = [
      {color: 'pale', label: 'Pale Blue', RGB: (173,238,239)},
      {color: 'moss', label: 'Moss Green', RGB: (172,224,171)},
      {color: 'melon', label: 'Melon', RGB: (254,188,179)},
      {color: 'chiffon', label: 'Chiffon', RGB: (255,251,203)},
      {color: 'island', label: 'Island', RGB: (146,222,228)},
      {color: 'dogwood', label: 'Dogwood', RGB: (238,205,193)},
      {color: 'greenery', label: 'Greenery', RGB: (135,177,68)}
    ];

        $scope.allwarm = [
      {color: 'ivory', label: 'Ivory', RGB: (255,255,239)},
      {color: 'honeydew', label: 'Honeydew', RGB: (240,255,239)},
      {color: 'lavender', label: 'Lavender', RGB: (230,230,251)},
      {color: 'canary', label: 'Canary', RGB: (255,255,147)},
      {color: 'hazelnut', label: 'Hazelnut', RGB: (240,214,191)},
      {color: 'kale', label: 'Kale', RGB: (199,222,183)},
      {color: 'sharkskin', label: 'Sharkskin', RGB: (201,205,218)}
    ];

        $scope.bold = [
      {color: 'original', label: 'Red', RGB: (255,0,0)},
      {color: 'lime', label: 'Lime', RGB: (0,255,0)},
      {color: 'blue', label: 'Blue', RGB: (0,0,255)},
      {color: 'yellow', label: 'Yellow', RGB: (255,255,0)},
      {color: 'cyan', label: 'Cyan', RGB: (0,255,255)},
      {color: 'magenta', label: 'Magenta', RGB: (255,0,255)},
      {color: 'maroon', label: 'Maroon', RGB: (128,0,0)},
      {color: 'olive', label: 'Olive', RGB: (128,128,0)},
      {color: 'green', label: 'Green', RGB: (0,128,0)},
      {color: 'purple', label: 'Purple', RGB: (128,0,128)},
      {color: 'teal', label: 'Teal', RGB: (0,128,128)},
      {color: 'navy', label: 'Navy', RGB: (0,0,128)}
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

    $scope.current = 'original';
    $scope.trending = [
      {color: 'beige', label: 'Beige', rgb: 'FFFFAA'},
      {color: 'camel', label: 'Camel', rgb: 'FFDD00'},
      {color: 'salmon', label: 'Salmon Pink', rgb: 'FFB2B2'},
      {color: 'navajo', label: 'Navajo White', rgb: 'FFC800'},
      {color: 'niagara', label: 'Niagara', rgb: '9BD6FF'},
      {color: 'primrose', label: 'Primrose', rgb: 'FFCF00'},
      {color: 'lapis', label: 'Lapis Blue', rgb: 'A4A7FF'}
    ];

    $scope.newlyadded = [
      {color: 'pale', label: 'Pale Blue'},
      {color: 'moss', label: 'Moss Green'},
      {color: 'melon', label: 'Melon'},
      {color: 'chiffon', label: 'Chiffon'},

    ];

    $scope.allwarm = [
      {color: 'ivory', label: 'Ivory'}
    ];

    $scope.setColor = function(color, rgb){
      $scope.current = color;
      $scope.sendColor( rgb );
    }

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

