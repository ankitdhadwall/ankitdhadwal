const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

function applyLayout() {
  const sm = window.innerWidth < 768;
  const lg = window.innerWidth >= 1024;
  document.getElementById('desktop-nav').style.display = sm ? 'none' : 'flex';
  btn.style.display = sm ? 'block' : 'none';
  if (!sm) menu.classList.remove('open');
  const stack = document.getElementById('hero-card-stack');
  const hgrid = document.getElementById('hero-grid');
  stack.style.display = lg ? 'block' : 'none';
  hgrid.style.gridTemplateColumns = lg ? '1fr 1fr' : '1fr';
  document.getElementById('about-grid').style.gridTemplateColumns = lg ? '2fr 1fr' : '1fr';
  // minmax(0,...) rather than 1fr: grid tracks default to min-width:auto, which
  // lets the stat numerals push the row wider than the viewport on phones.
  document.getElementById('about-stats').style.gridTemplateColumns = lg ? '1fr' : 'repeat(3,minmax(0,1fr))';
  document.getElementById('contact-grid').style.gridTemplateColumns = sm ? '1fr' : '1fr 1fr';
  document.getElementById('form-row').style.gridTemplateColumns = sm ? '1fr' : '1fr 1fr';
}
applyLayout();
window.addEventListener('resize', applyLayout);

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.progress-fill[data-width]').forEach(b => { b.style.width = b.dataset.width + '%'; });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.fname.value.trim();
  const email = this.femail.value.trim();
  const subject = this.fsubject.value.trim() || 'Portfolio Inquiry';
  const message = this.fmessage.value.trim();
  const status = document.getElementById('form-status');
  status.style.display = 'block';
  if (!name || !email || !message) {
    status.textContent = 'Please fill in all required fields.';
    status.style.color = '#f87171';
    return;
  }
  if (this._honey.value) return;
  const btn = this.querySelector('button[type=submit]');
  btn.disabled = true;
  status.textContent = 'Sending...';
  status.style.color = 'var(--c-muted)';
  try {
    const res = await fetch('https://formsubmit.co/ajax/ankit.dhadwal90@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: name, email: email, _subject: subject + ' — ' + name + ' (via portfolio)', message: message, _template: 'table' })
    });
    if (!res.ok) throw new Error('Request failed');
    this.reset();
    status.textContent = "Message sent! I'll get back to you within 24 hours. ✓";
    status.style.color = 'var(--c-emerald)';
    if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'contact_form' });
  } catch (err) {
    status.innerHTML = 'Something went wrong — please email me directly at <a href="mailto:ankit.dhadwal90@gmail.com" style="color:var(--c-cyan);">ankit.dhadwal90@gmail.com</a> or use WhatsApp.';
    status.style.color = '#f87171';
  } finally {
    btn.disabled = false;
  }
});
