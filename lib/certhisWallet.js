module.exports = function (request) {
  return {
    async wallet(email) {
      return await request.get("wallet", { email: email });
    },
    async auth(email) {
      return await request.post("auth", { email: email });
    },
    async check(wallet_address, code) {
      return await request.post("check", {
        wallet: wallet_address,
        code: code,
      });
    },
    async check2(wallet_address, encrypted_key) {
      return await request.post("check_2", {
        wallet: wallet_address,
        encrypted_key: encrypted_key,
      });
    },
  };
};
