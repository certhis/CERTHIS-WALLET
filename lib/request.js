module.exports = function (api_url) {
  const axios = require("axios").default;
  const api = axios.create({
    baseURL: api_url,
    timeout: 3000,
  });

  return {
    async get(url, params) {
      return new Promise(async (resolve, reject) => {
        try {
          var getResponse = await api
            .get(url, { params: params })
            .then((response) => {
              return resolve(response.data);
            })
            .catch((err) => {
              return resolve(false);
            });
        } catch (e) {
          return resolve(false);
        }
      });
    },
    async post(url, params, baseURL = null) {
      return new Promise(async (resolve, reject) => {
        var current_api = api;

        if (baseURL != null) {
          current_api = axios.create({
            baseURL: baseURL,
            timeout: 3000,
          });
        }

        try {
          var getResponse = await current_api
            .post(url, params)
            .then((response) => {
              return resolve(response.data);
            })
            .catch((err) => {
              return resolve(false);
            });
        } catch (e) {
          return resolve(false);
        }
      });
    },
  };
};
