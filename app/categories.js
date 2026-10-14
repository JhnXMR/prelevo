/* Classement des opérations. Aucune dépendance : tourne dans la page et sous node --test. */
(function (global) {
  'use strict';

  var LIST = [
    { id: 'logement', l: 'Logement', ic: 'home', color: '#4E5966' },
    { id: 'courses', l: 'Courses', ic: 'cart', color: '#2F6B52' },
    { id: 'transport', l: 'Transport', ic: 'train', color: '#2F5680' },
    { id: 'energie', l: 'Énergie', ic: 'bolt', color: '#8A5E16' },
    { id: 'telecom', l: 'Télécom', ic: 'wifi', color: '#4A5870' },
    { id: 'abo', l: 'Abonnements', ic: 'repeat', color: '#5C5180' },
    { id: 'loisirs', l: 'Loisirs', ic: 'ticket', color: '#7A4464' },
    { id: 'resto', l: 'Restos', ic: 'cup', color: '#8A4E34' },
    { id: 'sante', l: 'Santé', ic: 'heart', color: '#8E3E4A' },
    { id: 'revenu', l: 'Revenus', ic: 'income', color: '#1F6B40' },
    { id: 'autre', l: 'Autre', ic: 'dot', color: '#5C6570' }
  ];

  var BY = {};
  LIST.forEach(function (c) { BY[c.id] = c; });

  /* Phrases longues avant les mots courts : « uber eats » avant « uber ». */
  var RULES = [
    [/uber ?eats|deliveroo/, 'resto'],
    [/loyer|agence fictive|\bagence\b|syndic/, 'logement'],
    [/supermarch|superette|\bmarche\b|primeur|boulang|epicerie|carrefour|monoprix|lidl|franprix|auchan|leclerc|intermarch|picard/, 'courses'],
    [/restaurant|\bcafe\b|brasserie|cantine|\bbar\b|pizz|sushi|burger|bistrot/, 'resto'],
    [/pharmacie|medecin|docteur|dentiste|mutuelle|\bsante\b|optic/, 'sante'],
    [/sncf|ratp|navigo|metro|transport|taxi|\buber\b|essence|carburant|peage|parking|\bvelo\b|station du canal/, 'transport'],
    [/musee|museum|\bcine\b|concert|theatre|spectacle|librairie/, 'loisirs'],
    [/electricit|\bedf\b|engie|\bgaz\b|\beau\b|energie/, 'energie'],
    [/mobile|forfait|\bbox\b|internet|fibre|telecom/, 'telecom'],
    [/flixo|sonora|wavely|fitclub|shopprime|photoedit|meteoplus|quizmania|\bcloud\b|assurhabitat|salle de sport/, 'abo'],
    [/salaire|\bprime\b|exemple sas/, 'revenu']
  ];

  function strip(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function norm(s) {
    return strip(s).toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function merchantKey(name) {
    var s = strip(name).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
    return s || 'operation';
  }

  function canonicalHint(hint) {
    if (!hint) return '';
    if (hint === 'sub') return 'abo';
    if (hint === 'rent') return 'logement';
    if (hint === 'in') return 'revenu';
    if (hint === 'xfer' || hint === 'virement') return 'virement';
    if (BY[hint]) return hint;
    if (hint === 'shopping' || hint === 'voyage' || hint === 'retrait' || hint === 'pret') return 'autre';
    return '';
  }

  function fold(id) {
    if (id === 'virement') return 'virement';
    if (BY[id]) return id;
    return 'autre';
  }

  function classify(input, overrides) {
    var src = input || {};
    var name = src.name == null ? '' : String(src.name);
    var wording = src.wording == null ? name : String(src.wording);
    var key = merchantKey(name || wording);
    if (overrides && typeof overrides === 'object' && Object.prototype.hasOwnProperty.call(overrides, key)) {
      var chosen = overrides[key];
      if (chosen === 'virement' || BY[chosen]) return chosen;
    }
    var blob = norm(wording + ' ' + name);
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(blob)) return RULES[i][1];
    }
    var hint = canonicalHint(src.hint);
    if (hint) return hint;
    var type = src.type == null ? '' : String(src.type);
    var amt = Number(src.amount);
    if (type === 'withdrawal' || /\bretrait\b|\bdab\b/.test(blob)) return 'autre';
    if (amt > 0) return 'revenu';
    if (type === 'loan_repayment' || /\bpret\b/.test(blob)) return 'autre';
    if (type === 'transfer' || /\bvir(?:ement)?\b/.test(blob)) return 'virement';
    return 'autre';
  }

  global.PrelevoCategories = {
    LIST: LIST,
    IDS: LIST.map(function (c) { return c.id; }),
    SPEND: LIST.filter(function (c) { return c.id !== 'revenu'; }).map(function (c) { return c.id; }),
    BY: BY,
    fold: fold,
    merchantKey: merchantKey,
    classify: classify,
    label: function (id) { return (BY[fold(id)] || BY.autre).l; },
    color: function (id) { return (BY[fold(id)] || BY.autre).color; },
    icon: function (id) { return (BY[id] || BY[fold(id)] || BY.autre).ic; }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
