angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  socket.on('event:led:state', function( val ) {
    console.log('Motion in 21 is ' +(val ? 'ACTIVE' : 'INACTIVE'));
    $scope.$apply( function() {
      $scope.motion = val ? true : false;
    });
  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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
  $scope.toggle = function(){
    $scope.state = !$scope.state;
    var data = stringToBytes($scope.state ? 'ON':'OFF');
    ble.writeWithoutResponse($scope.device.id, 'ffe0', 'ffe1', data, function(){
      console.log('success');
    }, function(){
      console.log('failure');
    });
  };
  $scope.blink = function(){
    var data = stringToBytes('BLINK');
    ble.writeWithoutResponse($scope.device.id, 'ffe0', 'ffe1', data, function(){
      console.log('success');
    }, function(){
      console.log('failure');
    });
  };
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
