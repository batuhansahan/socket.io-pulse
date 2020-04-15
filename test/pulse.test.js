var test = require('tape'),
  _ = require('underscore'),
  Pulse = require('../src/socket-pulse');

var adapter_mockup = {
  nsp: {
    name: '/',
    server: {name: 'mock_server'},
    sockets: [],
    connected: {},
    fns: [],
    ids: 0,
    acks: {},
    adapter: NaN,
  },
  rooms: {
    room1: {room1: {room1: true}},
    room2: {room2: {room2: true}, room1: {room1: true}},
    emptyRoom: [],
  },
  rooms_props: {
    room1: {size: 'Large', name: 'Grand Room', color: 'Green'},
    room2: {size: 'Small', name: 'Mini room'},
    emptyRoom: {size: 'Medium'},
  },
  sids: {
    user1: {room1: true, room2: true},
    user2: {room1: true},
  },
  encoder: {},
};

var pulse = new Pulse(adapter_mockup);

test('all general', function (t) {
  //List all the rooms
  pulse.listRooms(function (rooms) {
    t.equal(_.size(rooms), 3, 'there are 3 rooms');
  });
  //Get users in room2
  pulse.getRoom('room2', function (users) {
    t.equal(_.size(users), 2, 'there are 2 users in room2');
  });

  //Check if room exists
  pulse.isRoomExist('room1', function (res) {
    t.equal(res, true, 'room1 exists');
  });

  //Get the room Properties
  pulse.getAllItems('room1', function (properties) {
    t.equal(_.size(properties), 3, 'room 1 has 3 properties');
  });

  pulse.removeItem('room1', 'color', function (properties) {
    t.equal(properties.color, undefined, 'color was removed from room 1');
    t.equal(_.size(properties), 2, 'room 1 has 2 properties');
  });
  //Check if ghostRoom exists
  pulse.isRoomExist('ghostRoom', function (res) {
    t.equal(res, false, 'ghost room doesnt exist (yet... .AHAHAH)');
  });
  //Delete empty room
  pulse.removeEmptyRoom('room1', function (res) {
    t.equal(res, false, 'room1 is not empty do not delete it');
  });
  //Get the room1 Properties
  pulse.getAllItems('room1', function (properties) {
    t.equal(
      _.size(properties),
      2,
      'room 1 is not empty so still has properties'
    );
  });
  //Get the emptyroom Properties
  pulse.getAllItems('emptyRoom', function (properties) {
    t.equal(_.size(properties), 1, 'emptyroom has 1 property');
  });
  pulse.removeEmptyRoom('emptyRoom', function (res) {
    t.equal(res, true, 'emptyRoom is empty (!), delete it!');

    pulse.isRoomExist('emptyRoom', function (res) {
      t.equal(res, false, 'empty room does not exist anymore');
    });

    pulse.getAllItems('emptyRoom', function (properties) {
      t.equal(properties, null, 'emptyRoom has no properties anymore');
    });
  });

  t.end();
});

test('properties', function (t) {
  pulse.setItem('room1', 'size', 'Small', function (_notUsed) {
    pulse.getAllItems('room1', function (props) {
      t.equal(props.size, 'Small', 'room has new properties');

      pulse.setItem('room1', 'size', 'Large', function (_notUsed) {
        pulse.getAllItems('room1', function (props) {
          t.equal(props.size, 'Large', 'property updated');
        });
      });
    });
  });

  t.end();
});
