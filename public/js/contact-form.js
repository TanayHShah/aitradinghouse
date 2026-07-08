(() => {
  const form = document.getElementById('enquiry-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const requirement = (data.get('requirement') || '').toString().trim();

    if (!name || !email || !requirement) return;

    // Build a mailto link as the delivery mechanism
    const subject = `Enquiry from ${name} — AI Trading House`;
    const body = [
      `Name: ${name}`,
      `Company: ${data.get('company') || '-'}`,
      `Email: ${email}`,
      `Phone: ${data.get('phone') || '-'}`,
      `Product family: ${data.get('family') || '-'}`,
      ``,
      `Requirement:`,
      requirement,
    ].join('\n');

    const mailto = `mailto:info@aitradinghouse.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    success.style.display = 'flex';
    form.reset();

    // Open the user's email client with the pre-filled message
    window.location.href = mailto;

    setTimeout(() => {
      success.style.display = 'none';
    }, 8000);
  });
})();
