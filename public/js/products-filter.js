(() => {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.product-card');
  const search = document.getElementById('product-search');
  const noResults = document.getElementById('no-results');
  let activeFilter = 'all';
  let searchTerm = '';

  function apply() {
    let visible = 0;
    cards.forEach((card) => {
      const cat = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const matchSearch = !searchTerm || name.includes(searchTerm);
      const show = matchFilter && matchSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      apply();
    });
  });

  // Bento card family links also act as filters
  document.querySelectorAll('.bento-card[data-filter]').forEach((card) => {
    card.addEventListener('click', (e) => {
      const filter = card.dataset.filter;
      const chip = document.querySelector(`.filter-chip[data-filter="${filter}"]`);
      if (chip) {
        e.preventDefault();
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = filter;
        apply();
        document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (search) {
    search.addEventListener('input', () => {
      searchTerm = search.value.trim().toLowerCase();
      apply();
    });
  }
})();
