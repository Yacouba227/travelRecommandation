let travelData = null;

// Étape 1 : récupérer les données du fichier JSON via fetch API
fetch('travel_recommendation_api.json')
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
    console.log('Données de voyage chargées :', travelData);
  })
  .catch((error) => {
    console.error('Erreur lors du chargement des données :', error);
  });

// Étape 2 : normaliser le mot-clé saisi par l'utilisateur
// Accepte "plage", "plages", "Plage", "PLAGE", "beach", "beaches", etc.
function matchCategory(rawKeyword) {
  const keyword = rawKeyword.trim().toLowerCase();

  const beachTerms = ['plage', 'plages', 'beach', 'beaches'];
  const templeTerms = ['temple', 'temples'];
  const countryTerms = ['pays', 'country', 'countries'];

  if (beachTerms.includes(keyword)) return 'beaches';
  if (templeTerms.includes(keyword)) return 'temples';
  if (countryTerms.includes(keyword)) return 'countries';
  return null;
}

// Étape 3 : construire la liste plate de résultats pour une catégorie
function getResultsForCategory(category) {
  if (!travelData) return [];

  if (category === 'countries') {
    // On aplati toutes les villes de tous les pays en une seule liste
    const cities = [];
    travelData.countries.forEach((country) => {
      country.cities.forEach((city) => cities.push(city));
    });
    return cities;
  }

  return travelData[category] || [];
}

// Étape 4 : afficher les résultats dans la grille
function renderResults(items) {
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = '<p class="empty-state">Aucun résultat trouvé. Essayez « plage », « temple » ou « pays ».</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="card-cta">Réserver maintenant</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Étape 5 : gérer le clic sur le bouton Rechercher
document.getElementById('searchBtn').addEventListener('click', () => {
  const input = document.getElementById('searchInput').value;
  const category = matchCategory(input);

  if (!category) {
    renderResults([]);
    return;
  }

  const results = getResultsForCategory(category);
  renderResults(results);
});

// Permettre la recherche avec la touche Entrée
document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

// Étape 6 : gérer le clic sur le bouton Effacer
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '<p class="empty-state">Tapez « plage », « temple » ou « pays » dans la barre de recherche, puis cliquez sur Rechercher.</p>';
});

// Tâche 10 (optionnelle) : afficher l'heure locale d'une destination
function getLocalTime(timeZone) {
  const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}