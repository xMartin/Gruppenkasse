define(function () {
  'use strict';

  var TabStore = function (db, changeCallback) {
    this.db = db;
    this._dbChangeCallback = changeCallback;
    this._cache = {};
  };

  TabStore.prototype.init = function () {
    return (
      this.db.init()
      .then(function () {
        this.db.setupChangesListener(this._handleDbChange.bind(this));
        this.db.sync();
      }.bind(this))
      .then(this._refreshFromDb.bind(this))
    );
  };

  TabStore.prototype._refreshFromDb = function () {
    return (
      this.db.getInfo()
      .then(function (info) {
        this._cache.info = info;
      }.bind(this))
      .then(this.db.getTransactions.bind(this.db))
      .then(function (transactions) {
        this._cache.transactions = this._sortTransactions(transactions);
        this._cache.accounts = this._transactions2Accounts(transactions);
        this._cache.participants = this._accounts2Participants(this._cache.accounts);
      }.bind(this))
    );
  };

  TabStore.prototype.getInfo = function () {
    return this._cache.info;
  };

  TabStore.prototype.getTransactions = function () {
    return this._cache.transactions;
  };

  TabStore.prototype.getAccounts = function () {
    return this._cache.accounts;
  };

  TabStore.prototype.getParticipants = function () {
    return this._cache.participants;
  };

  TabStore.prototype.saveInfo = function (info) {
    return this.db.saveInfo(info);
  };

  TabStore.prototype.saveTransaction = function (data) {
    return this.db.saveTransaction(data);
  };

  TabStore.prototype.removeTransaction = function (data) {
    return this.db.removeTransaction(data);
  };

  TabStore.prototype._handleDbChange = function () {
    this._refreshFromDb()
    .then(this._dbChangeCallback)
    .catch(console.error.bind(console));
  };

  TabStore.prototype._sortTransactions = function (transactions) {
    // order transactions by date and timestamp descending
    return transactions.sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      } else {  // ===
        if (a.timestamp > b.timestamp) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  };

  TabStore.prototype._transactions2Accounts = function (transactions) {
    var participants = {};
    transactions.forEach(function (transaction) {
      var total = 0;
      transaction.participants.forEach(function (participant) {
        total += participant.amount || 0;
      });
      var share = total / transaction.participants.length;
      transaction.participants.forEach(function (participant) {
        var amount = participant.amount || 0;
        var participantName = participant.participant;
        var storedAmount = participants[participantName] || 0;
        var newAmount = storedAmount - share + amount;
        participants[participantName] = newAmount;
      });
    });
    var result = [];
    for (var participant in participants) {
      var resultObj = {};
      resultObj.participant = participant;
      resultObj.amount = participants[participant];
      result.push(resultObj);
    }
    result.sort(function (a, b) {
      return a.amount < b.amount ? -1 : 1;
    });
    return result;
  };

  TabStore.prototype._accounts2Participants = function (accounts) {
    return accounts.map(function (account) {
      return account.participant;
    });
  };

  TabStore.prototype.destroy = function () {
    this.db.destroy();
  };

  return TabStore;

});
