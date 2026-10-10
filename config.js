/* Prelevo – réglages de la page de lancement (à modifier ici, sans toucher au reste). */
window.PRELEVO_LANDING = {
  /* Offre de lancement : texte affiché sous le formulaire. Mettre enabled:false pour la masquer.
     ⚠️ À VALIDER PAR JHN avant publication (nombre d'inscrits, durée offerte). */
  incentive: { enabled: true, text: 'Les 500 premiers inscrits : 3 mois de Premium offerts' },

  /* Où envoyer les inscriptions. provider :
     - 'none'        : rien n'est envoyé (aperçu). L'e-mail est seulement gardé dans ce navigateur.
     - 'formsubmit'  : endpoint = https://formsubmit.co/ajax/<alias>  (aucun compte ; les inscriptions arrivent par e-mail)
     - 'google-form' : endpoint = https://docs.google.com/forms/d/e/<ID>/formResponse, field = 'entry.123456789'
     - 'formspree'   : endpoint = https://formspree.io/f/<ID>
     - 'apps-script' : endpoint = URL /exec d'un script Google Apps Script (web app) relié à une Google Sheet
     - 'json'        : n'importe quel endpoint qui accepte un POST JSON { email, source, date } */
  waitlist: { provider: 'formsubmit', endpoint: 'https://formsubmit.co/ajax/a1ca38f8d891211a55ddf55b3329f250', field: 'email' },

  /* Éditeur et contact affichés dans les mentions / la confidentialité. */
  publisher: 'Jhn Dlt',
  contactEmail: 'jhn.dlt@mail.grokbot.com'
};
