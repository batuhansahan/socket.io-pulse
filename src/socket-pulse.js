function Pulse(adapter) {
  this.adapter = adapter;
  this.adapter.items = adapter.rooms_props || {};
}

Pulse.prototype.setItem = function (roomID, key, val, callback) {
  this.adapter.items[roomID] = this.adapter.items[roomID] || {};
  this.adapter.items[roomID][key] = val;
  callback(this.adapter.items[roomID]);
};

Pulse.prototype.getItem = function (roomID, key, callback) {
  if (this.adapter.items[roomID]) {
    callback(this.adapter.items[roomID][key]);
    return;
  }
  callback(null);
};

Pulse.prototype.removeItem = function (roomID, key, callback) {
  delete this.adapter.items[roomID][key];
  callback(this.adapter.items[roomID]);
};

Pulse.prototype.getAllItems = function (roomID, callback) {
  if (this.adapter.items[roomID]) {
    callback(this.adapter.items[roomID]);
    return;
  }
  callback(null);
};

Pulse.prototype.listRooms = function (callback) {
  callback(this.adapter.rooms);
};

Pulse.prototype.getRoom = function (roomID, callback) {
  callback(this.adapter.rooms[roomID]);
};

Pulse.prototype.removeEmptyRoom = function (roomID, callback) {
  if (!this.adapter.rooms[roomID][roomID]) {
    delete this.adapter.rooms[roomID];
    delete this.adapter.items[roomID];
    callback(true);
    return;
  }
  callback(false);
};

Pulse.prototype.isRoomExist = function (roomID, callback) {
  callback(typeof this.adapter.rooms[roomID] == 'undefined' ? false : true);
};

module.exports = Pulse;
