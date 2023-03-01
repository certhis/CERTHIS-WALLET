module.exports = function (api_url) {

  const axios = require('axios').default;
  const api = axios.create({
    baseURL: api_url,
    timeout: 3000,
  });

  return {
    async get(url, params) {
      var getResponse = await api
        .get(url, { params: params })
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          return err;
        });

      return getResponse;
    },
    async post(url, params, baseURL = null) {
      var current_api = api;

      if (baseURL != null) {
        current_api = axios.create({
          baseURL: baseURL,
          timeout: 3000,
        });
      }
      var getResponse = await current_api
        .post(url, params)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          return err;
        });

      return getResponse;
    },
  };
};
