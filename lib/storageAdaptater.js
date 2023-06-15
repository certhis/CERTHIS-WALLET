var storageSupported = false;
try {
  storageSupported = window.localStorage && true;
} catch (e) {
  storageSupported = false;
}

var localStorageAdaptater = {};
if (storageSupported) {
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
} else {
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
}

module.exports = { localStorageAdaptater };
