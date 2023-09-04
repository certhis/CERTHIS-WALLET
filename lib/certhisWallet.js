module.exports = function (request) {
  var wallet = async function (email) {
    return new Promise(async (resolve, reject) => {
      var get_wallet = await request.get("wallet", { email: email });

      if (get_wallet == false) {
        //wait 1 sec
        await new Promise((r) => setTimeout(r, 1000));

        var walletdata = await wallet(email);

        return resolve(walletdata);
      } else {
        return resolve(get_wallet);
      }
    });
  };
  return {
    wallet,
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
