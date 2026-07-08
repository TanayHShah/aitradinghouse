(() => {
  const root = document.getElementById('product-content');
  if (!root) return;

  const slug = root.getAttribute('data-product-slug');
  const data = window.PRODUCT_DATA && window.PRODUCT_DATA[slug];
  if (!data) return;

  const specsRows = data.specs
    .map(item => `<tr><th>${item[0]}</th><td>${item[1]}</td></tr>`)
    .join('');
  const appItems = data.applications.map(item => `<li>${item}</li>`).join('');
  const advItems = data.advantages.map(item => `<li>${item}</li>`).join('');

  root.innerHTML = `
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-eyebrow">${data.category} · Product Profile</p>
        <h1 class="hero-title">${data.name}</h1>
        <p class="hero-subtitle">${data.intro}</p>
        ${data.image ? `<img class="product-hero-image" src="${data.image}" alt="${data.name}" loading="lazy" />` : ''}
        <div class="hero-actions">
          <a href="../contact.html" class="btn btn-primary">Request Quote</a>
          <a href="../products.html" class="btn btn-ghost">Back to Products</a>
        </div>
      </div>
      <aside class="hero-aside glass">
        <h2 class="aside-title">Quick Highlights</h2>
        <div class="bento-grid">
          <div class="bento-card">
            <h3>Category</h3>
            <p>${data.category}</p>
          </div>
          <div class="bento-card">
            <h3>Use case</h3>
            <p>Thermal insulation for industrial, utility and infrastructure systems.</p>
          </div>
          <div class="bento-card">
            <h3>Supply support</h3>
            <p>Selection guidance based on process and service conditions.</p>
          </div>
          <div class="bento-card">
            <h3>Enquiry</h3>
            <p><a href="mailto:info@aitradinghouse.com">info@aitradinghouse.com</a></p>
          </div>
        </div>
      </aside>
    </section>

    <section class="applications-section">
      <div class="section-header">
        <h2>Technical specifications</h2>
        <p>Representative values from available product references. Final selection can be tuned per project requirement.</p>
      </div>
      <article class="app-card glass-soft" style="grid-column: 1 / -1">
        <table class="spec-table">
          <tbody>
            ${specsRows}
          </tbody>
        </table>
      </article>
    </section>

    <section class="applications-section">
      <div class="section-header">
        <h2>Applications</h2>
        <p>Common use cases for this product family.</p>
      </div>
      <article class="app-card glass-soft" style="grid-column: 1 / -1">
        <ul class="detail-list">${appItems}</ul>
      </article>
    </section>

    <section class="applications-section">
      <div class="section-header">
        <h2>Advantages</h2>
        <p>Why this product is selected in practical industrial insulation systems.</p>
      </div>
      <article class="app-card glass-soft" style="grid-column: 1 / -1">
        <ul class="detail-list">${advItems}</ul>
      </article>
    </section>
  `;
})();

