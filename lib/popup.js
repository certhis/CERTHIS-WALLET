module.exports = function () {
  var show_popup = function (title = null, message = null, content = null) {
    return new Promise(async (resolve, reject) => {
      var boxPopup = document.getElementById("boxPopupCerthis");

      if (!boxPopup) {
        boxPopup = document.createElement("div");
        boxPopup.id = "boxPopupCerthis";
        boxPopup.style.position = "fixed";
        boxPopup.style.width = "100%";
        boxPopup.style.height = "100%";
        boxPopup.style.top = 0;
        boxPopup.style.background = "#ffffffa3";
        boxPopup.style["text-align"] = "center";
        boxPopup.style.display = "grid";

        var InsertHTMLBOX =
          '<div id="popup-content-certhis" style="position: relative;height: 300px;display: grid;align-content: center;box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;margin: auto;max-width: 95%;background: #fff;width: 300px;border-radius:10px;">' +
          '<div id="closePopupLib" style="position: absolute;width: fit-content;right: 10px;cursor: pointer;top: 10px;">X</div>' +
          '<div style="font-size: 23px;margin-bottom: 20px;">' +
          title +
          "</div>";

        if (message != null) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="margin-bottom: 15px;margin-bottom: 15px;font-size: 17px;">' +
            message +
            "</div>";
        }

        if (content != null) {
          InsertHTMLBOX =
            InsertHTMLBOX +
            '<div style="background: #cccccc4a;padding: 7px;margin: auto;width: fit-content;border: 1px solid #ccc;font-style: italic;">' +
            content +
            "</div>";
        }

        InsertHTMLBOX =
          InsertHTMLBOX +
          '<div style="text-align:center;margin-top: 15px;">' +
          '<button id="closePopupLib2" style="    margin-right: 15px;width: fit-content;padding: 10px;font-size: 20px;background: #fff;cursor: pointer;border: 1px solid #ccc;border-radius: 5px;margin-top: 10px;box-shadow: 1px 1px 3px 2px #d0d0d0;margin-bottom: 10px;">Close</button>' +
          '<button id="confirmPopupLib" style="    width: fit-content;padding: 10px;font-size: 20px;background: #000;color:#fff;cursor: pointer;border: 1px solid #ccc;border-radius: 5px;margin-top: 10px;box-shadow: 1px 1px 3px 2px #d0d0d0;margin-bottom: 10px;">Confirm</button>';
        "</div>" + "</div>";

        boxPopup.innerHTML = InsertHTMLBOX;

        document.body.appendChild(boxPopup);
      } else {
        boxPopup.style.display = "grid";
      }
      let closePopup = document.querySelector("#closePopupLib");
      var closePopupN = closePopup.cloneNode(true);
      closePopup.parentNode.replaceChild(closePopupN, closePopup);

      closePopupN.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(false);
      });

      let closePopup2 = document.querySelector("#closePopupLib2");
      var closePopup2N = closePopup2.cloneNode(true);
      closePopup2.parentNode.replaceChild(closePopup2N, closePopup2);

      closePopup2N.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(false);
      });

      let confirmPopup = document.querySelector("#confirmPopupLib");
      var confirmPopupN = confirmPopup.cloneNode(true);
      confirmPopup.parentNode.replaceChild(confirmPopupN, confirmPopup);

      confirmPopupN.addEventListener("click", function () {
        boxPopup.style.display = "none";
        resolve(true);
      });
    });
  };

  return {
    showSignPopup: async function (message_to_sign) {
      var getConfirmation = await show_popup(
        "Confirm Message Signature",
        "Please confirm that you want to sign the message with your wallet",
        message_to_sign
      );

      return getConfirmation;
    },
  };
};
