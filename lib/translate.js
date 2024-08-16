var translations = {};
translations["fr"] = {
  "Connect": "Connexion",
  "with Certhis": "avec Certhis",
  "Log in": "Connectez-vous",
  "Sign Up": "Inscrivez-vous",
  "or": "ou",
  "with Google": "avec Google",
  "Or connect with": "Ou se connectez avec",
  "By connecting your wallet, you accept our":
    "En connectant votre portefeuille, vous acceptez notre",
  "Terms of Use": "Termes d'utilisation",
  "Privacy Policy": "Politique de Confidentialité",
  "You have received a code via email": "Vous avez reçu un code par email",
  "Connect Now": "Se connecter maintenant",
  "Back": "Retour",
  "Didn't received the code": "Vous n'avez pas reçu le code",
  "Resend": "Renvoyer",
  "Connected with": "Connecté avec",
  "Success": "Succès",
  "Invalid Email Address": "Adresse email invalide",
  "Invalid Code": "Code invalide",
  "Close": "Fermer",
  "and acknowledge that you have read our": "et reconnaissez avoir lu notre",
  "Your email": "Votre email",
};



function replacePlaceholders(htmlContent, lang) {
    for (let [key, value] of Object.entries(translations[lang])) {
      const regex = new RegExp(`placeholder="${key}"`, 'g');
      htmlContent = htmlContent.replace(regex, `placeholder="${value}"`);
    }
    return htmlContent;
  }
  
  module.exports.applyTranslations = function (htmlContent) {
    try {
      // Detect language
      var lang = "en";
  
      // Detect browser language
      if (navigator.language !== undefined) {
        lang = navigator.language.split("-")[0];
      }
  
      // Translate placeholders first
      
      htmlContent = replacePlaceholders(htmlContent, lang);
  
      // Convert the HTML string to a DOM object
      var parser = new DOMParser();
      var doc = parser.parseFromString(htmlContent, "text/html");
  
      // Recursive function to replace text nodes
      function replaceTextNodes(node) {
        if (node.nodeType === 3) { // Text node
          let nodeValue = node.nodeValue;
          if (translations[lang]) {
            for (let [key, value] of Object.entries(translations[lang])) {
              nodeValue = nodeValue.replace(new RegExp(`\\b${key}\\b`, "g"), value);
            }
            node.nodeValue = nodeValue;
          }
        } else {
          for (let child of node.childNodes) {
            replaceTextNodes(child);
          }
        }
      }
  
      replaceTextNodes(doc.body);
  
      // Convert the DOM object back to an HTML string
      htmlContent = new XMLSerializer().serializeToString(doc);
  
    } catch (e) {
      console.log(e);
    }
  
    return htmlContent;
  };