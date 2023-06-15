var localstorageSupported = false;
var sessionstorageSupported = false;
try {
  localstorageSupported = window.localStorage && true;
} catch (e) {
  localstorageSupported = false;
  try {
    sessionstorageSupported = window.sessionStorage && true;
  } catch (e) {
    sessionstorageSupported = false;
  }
}
var storage = {};
var localStorageAdaptater = {};
if (localstorageSupported) {
  localStorageAdaptater = {
    setItem: function (key, value) {
      return localStorage.setItem(key, value);
    },
    getItem: function (key) {
      return localStorage.getItem(key);
    },
    removeItem: function (key) {
      return localStorage.removeItem(key);
    },
    clear: function () {
      return localStorage.clear();
    },
  };
} else if (sessionstorageSupported) {
  localStorageAdaptater = {
    setItem: function (key, value) {
      return sessionStorage.setItem(key, value);
    },
    getItem: function (key) {
      return sessionStorage.getItem(key);
    },
    removeItem: function (key) {
      return sessionStorage.removeItem(key);
    },
    clear: function () {
      return sessionStorage.clear();
    },
  };
} else {
  localStorageAdaptater = {
    setItem: function (key, value) {
      return (storage[key] = value);
    },
    getItem: function (key) {
      return storage[key];
    },
    removeItem: function (key) {
      delete storage[key];
    },
    clear: function () {
      storage = {};
    },
  };
}

module.exports = { localStorageAdaptater };
