/* =========================================================================
   Evergreen Surface Solutions - static site generator
   Run:  node build/generate.js
   Edit SITE (phone, email, service area) or PAGES below, then re-run to
   regenerate every .html file with consistent header/footer/estimate form.
   ========================================================================= */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

/* ----------------------------- Site config ----------------------------- */
const SITE = {
  name: "Evergreen Surface Solutions",
  phoneDisplay: "(765) 415-4126",
  phoneTel: "17654154126",
  email: "cameron@evergreensurfaces.com",
  areaShort: "50 mi around Lafayette, IN (47905) - cabin work in multiple states",
  areaLong:
    "Within ~50 miles of Lafayette, Indiana (ZIP 47905) - plus log cabin restoration across multiple states.",
  formAction: "https://formspree.io/f/mykoabwq", // <-- replace YOUR_FORM_ID
  hours: "Mon-Sat, 7:30am-7pm",
  // Google Maps key powers BOTH the Locations radius map and the address
  // autofill on the quote form. Until you paste a real key, the map shows a
  // friendly placeholder and the form falls back to native browser autofill.
  mapsApiKey: "AIzaSyDPbBSthTepbts5bzxDJYT4tW2BOoETBj8", // IMPORTANT: restrict this key by HTTP referrer in Google Cloud Console
  map: { lat: 40.4039, lng: -86.8597, radiusMeters: 80467, cabinRadiusMeters: 482803 }, // Lafayette, IN; 50 mi local + 300 mi cabin
  googleProfile: "https://share.google/kgM0oTnYORPYTkDqb", // Google Business page
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61565006229246",   // <-- replace
    instagram: "https://www.instagram.com/evergreensurfacesolutions", // <-- replace
    nextdoor: "https://nextdoor.com/page/evergreen-surface-solutions-lafayette-in?utm_campaign=1782549915082&share_action_id=4819e77a-9e4a-4254-9c3d-9d0edf2cae1b", // <-- replace
  },
};

/* ------------------------------- Icons --------------------------------- */
const I = {
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>`,
  hex: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 9-9 6-9-6 9-6 9 6Z"/><path d="M3 9v6l9 6 9-6V9"/></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 3 7v6c0 5 3.8 8.5 9 9 5.2-.5 9-4 9-9V7l-9-5Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  chev: `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.98 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"/></svg>`,
  starOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.98 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"/></svg>`,
  googleG: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.05H12v3.88h5.9a5.05 5.05 0 0 1-2.19 3.32v2.76h3.54c2.07-1.91 3.25-4.72 3.25-7.91z"/><path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.54-2.76c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.23v2.85A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.88 14.14a6.6 6.6 0 0 1 0-4.22V7.07H2.23a11 11 0 0 0 0 9.92l3.65-2.85z"/><path fill="#EA4335" d="M12 5.42c1.61 0 3.05.55 4.18 1.64l3.14-3.14C17.43 2.12 14.95 1 12 1A11 11 0 0 0 2.23 7.07l3.65 2.85C6.74 7.34 9.15 5.42 12 5.42z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  nextdoor: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.95 2 2.85 5.86 2.85 10.6c0 3.2 1.9 6 4.74 7.5V22l3.2-1.78c.4.04.8.06 1.21.06 5.05 0 9.15-3.86 9.15-8.68C21.15 5.86 17.05 2 12 2zm3.9 11.86c0 .43-.36.78-.8.78h-1.1c-.44 0-.8-.35-.8-.78v-2.4c0-.78-.5-1.32-1.2-1.32s-1.2.54-1.2 1.34v2.38c0 .43-.36.78-.8.78h-1.1c-.43 0-.79-.35-.79-.78V9.13c0-.43.36-.78.8-.78h1.09c.3 0 .56.16.7.4.5-.35 1.12-.55 1.83-.55 1.82 0 3.37 1.32 3.37 3.3v2.36z"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 11H5.1c.1-2 .9-2.9 2.5-3.3l-.4-1.7C4.5 6.6 3 8.4 3 11.8V17h4.5v-6zm9 0h-2.4c.1-2 .9-2.9 2.5-3.3l-.4-1.7c-2.7.6-4.2 2.4-4.2 5.8V17h4.5v-6z"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  tree: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 7 9h3l-4 6h4l-3 5h10l-3-5h4l-4-6h3z"/></svg>`,
  log: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 21V11"/><path d="M19 21V11"/><path d="M5 13h14"/><path d="M5 17h14"/><path d="M9 21V13"/><path d="M9 9h6"/></svg>`,
  roller: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13v-1a2 2 0 0 1 2-2h11"/><rect x="13" y="6" width="8" height="6" rx="1"/><path d="M9 13v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a6 6 0 0 0 6-6c0-4-6-10-6-10S6 12 6 16a6 6 0 0 0 6 6Z"/></svg>`,
  pineMark: `<svg class="pine-mark" viewBox="0 0 24 24" fill="rgba(255,255,255,.85)" aria-hidden="true"><path d="M12 2 7 9h3l-4 6h4l-3 5h10l-3-5h4l-4-6h3z"/></svg>`,
};

/* ------------------------------ Helpers -------------------------------- */
const checklist = (items) =>
  `<ul class="checklist">${items
    .map((t) => `<li>${I.check}<span>${t}</span></li>`)
    .join("")}</ul>`;

const media = (cls, tag, title, note) =>
  `<div class="media${cls ? " " + cls : ""}" role="img" aria-label="${title}">
        ${I.pineMark}
        <div class="media-content">
          <span class="media-tag">${tag}</span>
          <div class="media-title">${title}</div>
          ${note ? `<div class="media-note">${note}</div>` : ""}
        </div>
      </div>`;

const steps = (arr) =>
  `<div class="steps">${arr
    .map(
      (s, i) =>
        `<div class="step"><div class="step-num">${i + 1}</div><h4>${s.t}</h4><p>${s.d}</p></div>`
    )
    .join("")}</div>`;

/* ------------------------------- Header -------------------------------- */
// Top-level tabs and their dropdown items.
const NAV = [
  { key: "about", href: "about.html", label: "About", items: [
    ["about.html#who-we-are", "Who We Are"],
    ["about.html#estimate", "Contact / Free Estimate"],
  ]},
  { key: "locations", href: "locations.html", label: "Locations", items: [] },
  { key: "log", href: "log-home-services.html", label: "Log Home Services", short: "Log Homes", items: [
    ["log-staining.html", "Staining"],
    ["log-caulking.html", "Caulking"],
    ["log-chinking.html", "Chinking"],
    ["log-restoration.html", "Restoration"],
    ["log-maintenance.html", "Maintenance"],
    ["log-home-services.html#inspection", "Schedule an Inspection"],
  ]},
  { key: "wood", href: "wood-staining.html", label: "Wood Staining", items: [
    ["deck-staining.html", "Deck Staining"],
    ["fence-staining.html", "Fence Staining"],
    ["siding-roof-staining.html", "Siding / Roof Staining"],
  ]},
  { key: "wash", href: "pressure-soft-wash.html", label: "Pressure/Soft Wash", short: "Pressure Wash", items: [
    ["house-wash.html", "House Wash"],
    ["roof-wash.html", "Roof Wash"],
    ["concrete-cleaning.html", "Concrete Cleaning"],
    ["gutter-cleaning.html", "Gutter Cleaning"],
    ["specialty-stain-removal.html", "Specialty Stain Removal"],
  ]},
  { key: "blog", href: "blog.html", label: "Blog", items: [] },
];
function header(active) {
  const navItems = NAV.map((n) => {
    const isActive = active === n.key ? " active" : "";
    const navLabel = n.short || n.label;
    // Tabs with no sub-items render as a plain link (no chevron/dropdown).
    if (!n.items.length) {
      return `          <div class="nav-item">
            <a href="${n.href}" class="nav-top${isActive}">${navLabel}</a>
          </div>`;
    }
    const links = n.items
      .map(([h, l]) => `              <a href="${h}">${l}</a>`)
      .join("\n");
    return `          <div class="nav-item">
            <a href="${n.href}" class="nav-top${isActive}">${navLabel}${I.chev}</a>
            <button class="nav-expand" aria-label="Show ${n.label} submenu" aria-expanded="false">${I.chev}</button>
            <div class="dropdown">
${links}
            </div>
          </div>`;
  }).join("\n");
  return `  <header class="site-header">
    <div class="topbar">
      <div class="container">
        <span class="tag">${I.pin} Serving a 50-mile radius of Lafayette, IN - cabin work in multiple states</span>
        <div class="topbar-links">
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a>
        </div>
      </div>
    </div>
    <nav class="navbar" aria-label="Main navigation">
      <div class="container">
        <a class="brand" href="index.html" aria-label="${SITE.name} home">
          <img src="Photos/evergreen-surface-solutions-logo.png" alt="${SITE.name} logo" />
          <span class="wordmark"><span class="w1">Evergreen</span><span class="w2">Surface Solutions</span></span>
        </a>
        <div class="nav-links" id="navLinks">
${navItems}
        </div>
        <div class="nav-cta">
          <a class="btn btn-primary nav-quote" href="#estimate">Free Quote</a>
          <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">${I.menu}</button>
        </div>
      </div>
    </nav>
  </header>`;
}

/* ---------------------------- Estimate form ---------------------------- */
const SERVICE_OPTS = [
  { group: "Log Home", opts: [
    ["log-staining", "Log Home Staining"], ["caulking", "Caulking"], ["chinking", "Chinking"],
    ["restoration", "Log Home Restoration"], ["maintenance", "Log Home Maintenance"], ["inspection", "Log Home Inspection"],
  ]},
  { group: "Wood Staining", opts: [
    ["deck", "Deck Staining"], ["fence", "Fence Staining"], ["siding-roof", "Siding / Roof Staining"],
  ]},
  { group: "Pressure / Soft Wash", opts: [
    ["house-wash", "House Washing"], ["roof-wash", "Roof Washing"], ["concrete", "Concrete Cleaning"],
    ["gutter", "Gutter Cleaning"], ["stain-removal", "Specialty Stain Removal"],
  ]},
];
function serviceSelect(preselect) {
  const sel = (v) => (v === preselect ? " selected" : "");
  const groups = SERVICE_OPTS.map(
    (g) => `<optgroup label="${g.group}">${g.opts
      .map(([v, l]) => `<option value="${v}"${sel(v)}>${l}</option>`)
      .join("")}</optgroup>`
  ).join("\n              ");
  return `<select id="service" name="service">
              <option value=""${preselect ? "" : " selected"}>Select a service…</option>
              ${groups}
              <option value="other"${sel("other")}>Something else</option>
            </select>`;
}
function estimate(preselect) {
  return `  <section class="section bg-cream2 anchor" id="estimate">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Free Estimates</span>
        <h2>Request Your Free Estimate</h2>
        <p class="estimate-intro">Tell us a little about your project and the best way to reach you. We&rsquo;ll follow up with a free, no-pressure quote - usually within a couple of business days.</p>
      </div>
      <div class="contact-grid">
        <div class="contact-info">
          <div class="contact-line">
            <span class="ci-icon">${I.phone}</span>
            <div><div class="ci-label">Call or Text</div><div class="ci-value"><a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a></div></div>
          </div>
          <div class="contact-line">
            <span class="ci-icon">${I.mail}</span>
            <div><div class="ci-label">Email</div><div class="ci-value"><a href="mailto:${SITE.email}">${SITE.email}</a></div></div>
          </div>
          <div class="contact-line">
            <span class="ci-icon">${I.pin}</span>
            <div><div class="ci-label">Service Area</div><div class="ci-value">${SITE.areaLong}</div></div>
          </div>
          <div class="contact-line">
            <span class="ci-icon">${I.clock}</span>
            <div><div class="ci-label">Hours</div><div class="ci-value">${SITE.hours}</div></div>
          </div>
        </div>
        <form class="form-card" action="${SITE.formAction}" method="POST">
          <input type="hidden" name="_subject" value="New quote request - ${SITE.name}" />
          <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div class="form-row">
            <div class="field"><label for="name">Name <span class="req">*</span></label><input id="name" name="name" type="text" autocomplete="name" required /></div>
            <div class="field"><label for="phone">Phone <span class="req">*</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" required /></div>
          </div>
          <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" /></div>
          <div class="field">
            <label for="address">Property Address</label>
            <input id="address" name="address" type="text" autocomplete="street-address" placeholder="Start typing your address&hellip;" />
          </div>
          <div class="form-row-3">
            <div class="field"><label for="city">City</label><input id="city" name="city" type="text" autocomplete="address-level2" /></div>
            <div class="field"><label for="state">State</label><input id="state" name="state" type="text" autocomplete="address-level1" value="IN" /></div>
            <div class="field"><label for="zip">ZIP</label><input id="zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" /></div>
          </div>
          <div class="field">
            <label for="service">What can we help with?</label>
            ${serviceSelect(preselect)}
          </div>
          <div class="field"><label for="message">Project details</label><textarea id="message" name="message" placeholder="Tell us about your home and what you'd like done…"></textarea></div>
          <button type="submit" class="btn btn-primary btn-lg btn-block">Send My Request</button>
          <p class="form-note">Prefer to talk? Call or text <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a> - we&rsquo;re happy to help.</p>
        </form>
      </div>
    </div>
  </section>`;
}

/* ------------------------------- Footer -------------------------------- */
function footer() {
  return `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="wordmark"><span class="w1">Evergreen</span><span class="w2">Surface Solutions</span></div>
          <div class="tagline">Clean. Restore. Protect.</div>
          <p>Expert log home restoration, wood staining, and exterior washing for Lafayette, IN and beyond.</p>
        </div>
        <div class="footer-col">
          <h4>Log Home</h4>
          <ul>
            <li><a href="log-staining.html">Staining</a></li>
            <li><a href="log-caulking.html">Caulking</a></li>
            <li><a href="log-chinking.html">Chinking</a></li>
            <li><a href="log-restoration.html">Restoration</a></li>
            <li><a href="log-maintenance.html">Maintenance</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Staining &amp; Washing</h4>
          <ul>
            <li><a href="deck-staining.html">Deck Staining</a></li>
            <li><a href="fence-staining.html">Fence Staining</a></li>
            <li><a href="siding-roof-staining.html">Siding / Roof Staining</a></li>
            <li><a href="house-wash.html">House Wash</a></li>
            <li><a href="roof-wash.html">Roof Wash</a></li>
            <li><a href="concrete-cleaning.html">Concrete Cleaning</a></li>
            <li><a href="gutter-cleaning.html">Gutter Cleaning</a></li>
            <li><a href="specialty-stain-removal.html">Specialty Stain Removal</a></li>
          </ul>
        </div>
        <div class="footer-col footer-contact">
          <h4>Get In Touch</h4>
          <div class="fc-line">${I.phone}<a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a></div>
          <div class="fc-line">${I.mail}<a href="mailto:${SITE.email}">${SITE.email}</a></div>
          <div class="fc-line">${I.pin}<span>${SITE.areaShort}</span></div>
          <div class="fc-line" style="margin-top:6px;"><a class="btn btn-primary" href="#estimate" style="min-height:46px;">Get a Free Quote</a></div>
        </div>
      </div>
      <nav class="footer-mini" aria-label="More links">
        <a href="about.html">About</a>
        <a href="locations.html">Locations</a>
        <a href="blog.html">Blog</a>
        <a href="about.html#estimate">Free Quote</a>
      </nav>
      <div class="footer-bottom">
        <span>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved.</span>
        <span>Locally owned &amp; fully insured.</span>
      </div>
    </div>
  </footer>`;
}

/* ------------------------------- Layout -------------------------------- */
function layout({ title, description, active, body, includeEstimate = true, preselect = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="alternate icon" href="Photos/evergreen-surface-solutions-logo.png" />
  <link rel="apple-touch-icon" href="Photos/evergreen-surface-solutions-logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body>
${header(active)}
  <main>
${body}
${includeEstimate ? estimate(preselect) : ""}
  </main>
${footer()}
  <script>window.EVG_MAPS_KEY=${JSON.stringify(SITE.mapsApiKey)};window.EVG_MAP=${JSON.stringify(SITE.map)};</script>
  <script src="assets/script.js"></script>
</body>
</html>
`;
}

/* --------------------------- Page hero block --------------------------- */
function pageHero({ crumbs, eyebrow, h1, intro, buttons = true }) {
  const crumbHtml = crumbs
    .map((c) => (c.href ? `<a href="${c.href}">${c.label}</a>` : c.label))
    .join(" &nbsp;/&nbsp; ");
  const btns = buttons
    ? `<div class="btn-row" style="margin-top:28px;">
          <a class="btn btn-light btn-lg" href="#estimate">Get a Free Quote</a>
          <a class="btn btn-outline-light btn-lg" href="tel:${SITE.phoneTel}">Call ${SITE.phoneDisplay}</a>
        </div>`
    : "";
  return `    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb">${crumbHtml}</div>
        <span class="eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        <p>${intro}</p>
        ${btns}
      </div>
    </section>`;
}

/* ----------------------- Sub-page builder (service) -------------------- */
// Maps each sub-page file to its matching estimate-form <select> value.
const FILE_SERVICE = {
  "log-staining.html": "log-staining", "log-caulking.html": "caulking", "log-chinking.html": "chinking",
  "log-restoration.html": "restoration", "log-maintenance.html": "maintenance",
  "deck-staining.html": "deck", "fence-staining.html": "fence", "siding-roof-staining.html": "siding-roof",
  "house-wash.html": "house-wash", "roof-wash.html": "roof-wash", "concrete-cleaning.html": "concrete",
  "gutter-cleaning.html": "gutter", "specialty-stain-removal.html": "stain-removal",
};
function subPage(p) {
  p.service = p.service || FILE_SERVICE[p.file] || "";
  const parentCrumb = { label: p.parentLabel, href: p.parentHref };
  const hero = pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, parentCrumb, { label: p.h1 }],
    eyebrow: p.parentLabel,
    h1: p.h1,
    intro: p.intro,
  });
  const paras = p.body.map((t) => `<p style="margin-bottom:18px;">${t}</p>`).join("");
  const extra = p.steps
    ? steps(p.steps)
    : p.checklist
    ? checklist(p.checklist)
    : "";
  const related = `
    <section class="section bg-cream2">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">More ${p.parentLabel}</span>
          <h2>Related Services</h2>
        </div>
        <div class="grid grid-3">
          ${p.related
            .map(
              (r) => `<a class="card hub-card reveal" href="${r.href}">
            ${media("short", r.tag, r.title)}
            <div class="hub-body"><h3>${r.name}</h3><p>${r.blurb}</p><span class="card-link">Learn more ${I.arrow}</span></div>
          </a>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`;
  const body = `${hero}
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="num" style="font-family:var(--font-display);font-weight:800;color:var(--brass);letter-spacing:.14em;margin-bottom:10px;">${p.parentLabel.toUpperCase()}</div>
            <h2>${p.h1}</h2>
            ${paras}
            ${extra}
          </div>
          <div class="hero-media-wrap">
            ${media("tall", p.mediaTag, p.mediaTitle, "Your project photos will go here - gallery coming soon.")}
          </div>
        </div>
      </div>
    </section>
${related}`;
  return {
    file: p.file,
    html: layout({
      title: `${p.h1} | ${SITE.name} - Lafayette, IN`,
      description: p.meta,
      active: p.active,
      body,
      preselect: p.service || "",
    }),
  };
}

/* ------------------------------ Hub page ------------------------------- */
function hubPage(h) {
  const hero = pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, { label: h.eyebrow }],
    eyebrow: h.eyebrow,
    h1: h.h1,
    intro: h.intro,
  });
  const cards = h.items
    .map(
      (it) => `<a class="card hub-card reveal" href="${it.href}">
            ${media("short", it.tag, it.title)}
            <div class="hub-body"><h3>${it.name}</h3><p>${it.blurb}</p><span class="card-link">Learn more ${I.arrow}</span></div>
          </a>`
    )
    .join("\n          ");
  const inspection = h.inspection
    ? `
    <section class="section cta-band anchor" id="inspection">
      <div class="container">
        <span class="eyebrow center light">Free &amp; No-Pressure</span>
        <h2>Schedule a Log Home Inspection</h2>
        <p>Not sure what your home needs? We&rsquo;ll take a careful look at your stain, seals, chinking, and wood condition - then give you honest recommendations and a clear estimate.</p>
        <div class="btn-row">
          <a class="btn btn-light btn-lg" href="#estimate">Request an Inspection</a>
          <a class="btn btn-outline-light btn-lg" href="tel:${SITE.phoneTel}">Call ${SITE.phoneDisplay}</a>
        </div>
      </div>
    </section>`
    : "";
  const body = `${hero}
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">${h.gridEyebrow}</span>
          <h2>${h.gridTitle}</h2>
          <p>${h.gridIntro}</p>
        </div>
        <div class="grid grid-3">
          ${cards}
        </div>
      </div>
    </section>
${inspection}`;
  return {
    file: h.file,
    html: layout({
      title: h.title,
      description: h.meta,
      active: h.active,
      body,
    }),
  };
}

/* =============================== CONTENT ================================ */

// Related-service mini cards reused on sub-pages
const REL = {
  logStaining: { href: "log-staining.html", tag: "Staining", title: "Rich, Protected Logs", name: "Log Home Staining", blurb: "Premium, breathable stains that seal out moisture and UV." },
  caulking: { href: "log-caulking.html", tag: "Caulking", title: "Sealed & Weather-Tight", name: "Caulking", blurb: "Flexible sealant for checks, seams, and joints." },
  chinking: { href: "log-chinking.html", tag: "Chinking", title: "Classic, Durable Seal", name: "Chinking", blurb: "Weather-tight chinking with that timeless log look." },
  restoration: { href: "log-restoration.html", tag: "Restoration", title: "Like-New, Inside & Out", name: "Restoration", blurb: "Blast back to bare wood, repair, and re-seal completely." },
  maintenance: { href: "log-maintenance.html", tag: "Maintenance", title: "Protected Year After Year", name: "Maintenance", blurb: "Refresh coats and spot repairs on a simple schedule." },
  deck: { href: "deck-staining.html", tag: "Deck Staining", title: "Ready for Summer", name: "Deck Staining", blurb: "Strip, clean, and stain for a deck that lasts." },
  fence: { href: "fence-staining.html", tag: "Fence Staining", title: "Crisp, Even Color", name: "Fence Staining", blurb: "Even color and protection on every picket and post." },
  siding: { href: "siding-roof-staining.html", tag: "Siding / Roof", title: "Protected From the Top Down", name: "Siding / Roof Staining", blurb: "Big surfaces stripped, cleaned, and re-stained right." },
  house: { href: "house-wash.html", tag: "House Wash", title: "Bright, Clean Siding", name: "House Wash", blurb: "Gentle soft washing that lifts mildew and grime." },
  roof: { href: "roof-wash.html", tag: "Roof Wash", title: "No More Black Streaks", name: "Roof Wash", blurb: "Shingle-safe soft washing that kills algae at the root." },
  concrete: { href: "concrete-cleaning.html", tag: "Concrete", title: "Like-New Driveways", name: "Concrete Cleaning", blurb: "Even, streak-free cleaning for drives, walks, and patios." },
  gutter: { href: "gutter-cleaning.html", tag: "Gutter Cleaning", title: "Flowing Freely Again", name: "Gutter Cleaning", blurb: "Clear, free-flowing gutters and a brighter exterior." },
  stain: { href: "specialty-stain-removal.html", tag: "Stain Removal", title: "Tough Stains, Gone", name: "Specialty Stain Removal", blurb: "Targeted treatment for rust, oil, tannin, and more." },
};

const STRIP_CLEAN_STAIN = [
  { t: "Strip", d: "Remove old, failing finish and weathered fibers so the new stain bonds to sound wood." },
  { t: "Clean", d: "Wash and brighten to lift dirt, mildew, and graying - restoring the wood's natural tone." },
  { t: "Stain", d: "Apply a premium, UV- and water-resistant stain, worked into the grain for even, lasting color." },
];

const SUBPAGES = [
  // ----- Log Home -----
  {
    file: "log-staining.html", active: "log", parentLabel: "Log Home Services", parentHref: "log-home-services.html",
    h1: "Log Home Staining", meta: "Premium log home staining in Lafayette, IN and beyond - breathable, weather-rated stains that protect your logs and restore natural beauty.",
    intro: "A fresh, properly applied stain is your log home&rsquo;s first and best defense against the elements.",
    body: [
      "Over time, sun and rain break down even the best finish, leaving logs gray, dry, and vulnerable. We restore that protection with premium, breathable stains formulated specifically for log homes - sealing out moisture and blocking UV while letting the natural wood grain show through.",
      "Every staining project begins with proper preparation: thorough cleaning and, where needed, light media blasting or sanding, so the new finish bonds and lasts. We then apply even, hand-worked coats for a rich, consistent color across every log - no lap marks, no missed spots.",
    ],
    checklist: ["Breathable, weather-rated log stains", "Color matching or a full color change", "Even, hand-applied coats with no lap marks", "Proper prep for maximum adhesion & lifespan"],
    mediaTag: "Log Home Staining", mediaTitle: "Rich, Protected Logs",
    related: [REL.caulking, REL.chinking, REL.restoration],
  },
  {
    file: "log-caulking.html", active: "log", parentLabel: "Log Home Services", parentHref: "log-home-services.html",
    h1: "Log Home Caulking", meta: "Log home caulking and energy sealing in Lafayette, IN - flexible, log-rated sealant for checks, seams, and joints.",
    intro: "Sealing the small gaps that let weather, drafts, and pests inside.",
    body: [
      "Logs naturally check, crack, and shift as they age and settle. Those small gaps may look minor, but they invite water, drafts, insects, and energy loss. Our caulking seals checks, seams, and joints with flexible, log-rated sealant that moves with your home instead of cracking and pulling away.",
      "We pay special attention to high-exposure areas - around windows, doors, and corners - to keep your interior dry, comfortable, and efficient through every Indiana season.",
    ],
    checklist: ["Flexible, long-life log-grade caulk", "Seals checks, seams & joints", "Tight sealing around windows & doors", "Improves comfort & lowers energy loss"],
    mediaTag: "Caulking", mediaTitle: "Sealed & Weather-Tight",
    related: [REL.chinking, REL.logStaining, REL.maintenance],
  },
  {
    file: "log-chinking.html", active: "log", parentLabel: "Log Home Services", parentHref: "log-home-services.html",
    h1: "Log Home Chinking", meta: "Professional log home chinking and repair in Lafayette, IN - durable, weather-tight seals with the classic log look.",
    intro: "The classic, durable seal that protects the wider gaps between your logs.",
    body: [
      "For homes with wider gaps between log courses, chinking provides a thick, flexible, weather-tight seal - and that timeless log-home look. Whether you need fresh chinking or repairs to failing, cracked lines, we apply it over proper backing so it bonds correctly and flexes with the logs.",
      "We match color and texture to your home for clean, consistent lines that protect against the elements and beautify your home for years to come.",
    ],
    checklist: ["New chinking and repair of failing lines", "Proper backer rod for correct adhesion", "Color & texture matched to your home", "Clean, consistent, professional lines"],
    mediaTag: "Chinking", mediaTitle: "Classic, Durable Seal",
    related: [REL.caulking, REL.restoration, REL.logStaining],
  },
  {
    file: "log-restoration.html", active: "log", parentLabel: "Log Home Services", parentHref: "log-home-services.html",
    h1: "Log Home Restoration", meta: "Full log home restoration in Lafayette, IN and across multiple states - media blasting, wood repair, borate treatment, and complete re-sealing.",
    intro: "A complete reset for a log home that&rsquo;s been weathered or neglected.",
    body: [
      "When a finish has failed and the wood has grayed, spotted, or started to rot, a surface coat isn&rsquo;t enough. Our full restoration strips the home back to sound, bare wood with media blasting or sanding, then treats and repairs the logs - including borate treatment and rot remediation where needed.",
      "From there we rebuild the protection from the ground up: seal, caulk, chink, and apply a premium stain. The result is a home that looks new again and is protected for years to come. We travel for log cabin restoration across multiple states - just ask.",
    ],
    checklist: ["Media blasting / sanding to bare, sound wood", "Wood repair & borate treatment", "Rot remediation where needed", "Full re-seal: caulk, chink & premium stain"],
    mediaTag: "Restoration", mediaTitle: "Like-New, Inside & Out",
    related: [REL.logStaining, REL.chinking, REL.maintenance],
  },
  {
    file: "log-maintenance.html", active: "log", parentLabel: "Log Home Services", parentHref: "log-home-services.html",
    h1: "Log Home Maintenance", meta: "Log home maintenance plans in Lafayette, IN - refresh coats, spot repairs, and inspections that protect your investment.",
    intro: "Simple, routine upkeep that protects your investment and prevents costly repairs.",
    body: [
      "A log home is a major investment, and a little routine care keeps it looking great while preventing expensive surprises. Our maintenance visits include a gentle wash and refresh coats to extend the life of your stain, plus spot repairs to caulking and chinking before small issues become big ones.",
      "We&rsquo;ll help you set a simple, recurring schedule tailored to your home&rsquo;s exposure and finish, so it always stays protected and beautiful.",
    ],
    checklist: ["Gentle wash & stain refresh coats", "Spot caulk & chink repairs", "Finish & seal condition inspection", "Custom recurring care plans"],
    mediaTag: "Maintenance", mediaTitle: "Protected, Year After Year",
    related: [REL.logStaining, REL.caulking, REL.restoration],
  },
  // ----- Wood Staining -----
  {
    file: "deck-staining.html", active: "wood", parentLabel: "Wood Staining", parentHref: "wood-staining.html",
    h1: "Deck Staining", meta: "Professional deck staining in Lafayette, IN - strip, clean, and stain for a beautiful, long-lasting, foot-traffic-rated finish.",
    intro: "Restore and protect the deck where you spend your summers.",
    body: [
      "Your deck endures sun, rain, snow, and constant foot traffic. We bring it back to life and seal it against the elements - boards, railings, and steps included - with a durable, foot-traffic-rated stain in the color you love.",
      "Following our proven strip, clean, and stain process means the finish bonds properly and lasts far longer than a quick recoat.",
    ],
    steps: STRIP_CLEAN_STAIN,
    mediaTag: "Deck Staining", mediaTitle: "Ready for Summer",
    related: [REL.fence, REL.siding, REL.house],
  },
  {
    file: "fence-staining.html", active: "wood", parentLabel: "Wood Staining", parentHref: "wood-staining.html",
    h1: "Fence Staining", meta: "Fence staining in Lafayette, IN - even, protective color that resists rot, warping, and graying for years.",
    intro: "Sharp, even color that helps your fence resist rot, warping, and graying.",
    body: [
      "A stained fence looks sharp and lasts years longer than bare wood, resisting rot, warping, and graying. We treat every picket, rail, and post for even, consistent color from end to end.",
      "Our strip, clean, and stain process ensures the protection soaks in and holds up to the weather, season after season.",
    ],
    steps: STRIP_CLEAN_STAIN,
    mediaTag: "Fence Staining", mediaTitle: "Crisp, Even Color",
    related: [REL.deck, REL.siding, REL.house],
  },
  {
    file: "siding-roof-staining.html", active: "wood", parentLabel: "Wood Staining", parentHref: "wood-staining.html",
    h1: "Siding & Roof Staining", meta: "Wood siding and cedar shake roof staining in Lafayette, IN - strip, clean, and re-stain large surfaces for lasting protection.",
    intro: "Protect and refresh large wood surfaces - wood siding and cedar shake roofs.",
    body: [
      "Wood siding and cedar shake roofs need protection from moisture and sun just like any other wood - and because these are large, high-exposure surfaces, doing it right matters even more. We carefully strip, clean, and re-stain to restore curb appeal and extend the life of the wood.",
      "Whether it&rsquo;s full wood siding or a cedar shake roof, we use products and methods built for big vertical and overhead surfaces.",
    ],
    steps: STRIP_CLEAN_STAIN,
    mediaTag: "Siding / Roof Staining", mediaTitle: "Protected From the Top Down",
    related: [REL.deck, REL.fence, REL.house],
  },
  // ----- Pressure / Soft Wash -----
  {
    file: "house-wash.html", active: "wash", parentLabel: "Pressure/Soft Wash", parentHref: "pressure-soft-wash.html",
    h1: "House Washing", meta: "Soft wash house washing in Lafayette, IN - safely remove mildew, algae, and grime from siding without damage.",
    intro: "Gentle soft washing that restores your home&rsquo;s color - without the damage.",
    body: [
      "Shaded and north-facing walls collect mildew, algae, dust, and cobwebs that dull your home&rsquo;s appearance. Our soft wash method uses low pressure and specialized cleansers to safely lift that buildup - restoring your home&rsquo;s true color without forcing water behind the siding or harming your finishes.",
      "It&rsquo;s safe for vinyl, wood, brick, stucco, and more, and gentle on your landscaping.",
    ],
    checklist: ["Safe for vinyl, wood, brick, stucco & more", "Removes mildew, algae, cobwebs & grime", "Low-pressure, no-damage soft washing", "Gentle on landscaping and finishes"],
    mediaTag: "House Wash", mediaTitle: "Bright, Clean Siding",
    related: [REL.roof, REL.concrete, REL.gutter],
  },
  {
    file: "roof-wash.html", active: "wash", parentLabel: "Pressure/Soft Wash", parentHref: "pressure-soft-wash.html",
    h1: "Roof Washing", meta: "Shingle-safe roof soft washing in Lafayette, IN - remove black algae streaks, moss, and lichen without damaging your roof.",
    intro: "Shingle-safe soft washing that removes black streaks and protects your roof.",
    body: [
      "Those dark streaks on your roof are algae feeding on your shingles. We never blast a roof - instead, our soft wash treatment kills the algae, moss, and lichen at the root and gently rinses it away.",
      "The result restores your roof&rsquo;s appearance and helps protect its lifespan and warranty - all without the damage high pressure can cause.",
    ],
    checklist: ["Low-pressure, shingle-safe soft washing", "Kills algae, moss & lichen at the source", "Removes black streaks & restores appearance", "Helps protect roof lifespan & warranty"],
    mediaTag: "Roof Wash", mediaTitle: "No More Black Streaks",
    related: [REL.house, REL.gutter, REL.concrete],
  },
  {
    file: "concrete-cleaning.html", active: "wash", parentLabel: "Pressure/Soft Wash", parentHref: "pressure-soft-wash.html",
    h1: "Concrete Cleaning", meta: "Concrete and driveway cleaning in Lafayette, IN - even, streak-free surface cleaning for drives, walks, and patios.",
    intro: "Even, streak-free cleaning that makes driveways and patios look new again.",
    body: [
      "Driveways, sidewalks, patios, and pool decks collect dirt, mildew, oil, and tire marks. Using a professional surface cleaner, we lift years of buildup for an even, refreshed finish - no streaks or zebra stripes.",
      "Ask about sealing afterward to help your concrete stay cleaner and resist stains longer.",
    ],
    checklist: ["Driveways, walkways, patios & pool decks", "Even surface-cleaner finish, no stripes", "Oil & tire-mark treatment", "Optional sealing to stay cleaner longer"],
    mediaTag: "Concrete", mediaTitle: "Like-New Driveways",
    related: [REL.house, REL.roof, REL.stain],
  },
  {
    file: "gutter-cleaning.html", active: "wash", parentLabel: "Pressure/Soft Wash", parentHref: "pressure-soft-wash.html",
    h1: "Gutter Cleaning", meta: "Gutter cleaning and brightening in Lafayette, IN - clear, free-flowing gutters and a streak-free exterior face.",
    intro: "Clear, free-flowing gutters - plus a brighter, streak-free exterior face.",
    body: [
      "Clogged gutters lead to overflow, fascia damage, and foundation problems. We clear out leaves and debris so water flows where it should, check your downspouts, and confirm everything drains properly.",
      "We can also brighten the exterior face of your gutters to remove those ugly black &lsquo;tiger stripes&rsquo; for cleaner curb appeal.",
    ],
    checklist: ["Full debris removal & downspout flow check", "Exterior gutter brightening (removes streaks)", "Protects fascia, soffits & foundation", "Helps prevent overflow & water damage"],
    mediaTag: "Gutter Cleaning", mediaTitle: "Flowing Freely Again",
    related: [REL.house, REL.roof, REL.concrete],
  },
  {
    file: "specialty-stain-removal.html", active: "wash", parentLabel: "Pressure/Soft Wash", parentHref: "pressure-soft-wash.html",
    h1: "Specialty Stain Removal", meta: "Specialty stain removal in Lafayette, IN - rust, oil, tannin, organic, and mineral stains treated with the right methods.",
    intro: "Targeted treatment for the stubborn stains general washing leaves behind.",
    body: [
      "Some stains need more than a rinse. Rust, battery acid, oil, irrigation mineral marks, tannin bleed, artillery fungus, and organic staining each call for the right treatment.",
      "We identify the type of stain and use targeted, surface-appropriate methods to remove what general washing can&rsquo;t - safely and effectively.",
    ],
    checklist: ["Rust, irrigation & mineral stain treatment", "Oil, grease & tire-mark removal on concrete", "Tannin, organic & artillery-fungus spotting", "Surface-appropriate, no-damage methods"],
    mediaTag: "Stain Removal", mediaTitle: "Tough Stains, Gone",
    related: [REL.house, REL.concrete, REL.roof],
  },
];

const HUBS = [
  {
    file: "log-home-services.html", active: "log",
    title: "Log Home Services | Staining, Caulking, Chinking & Restoration - " + SITE.name,
    meta: "Expert log home staining, caulking, chinking, restoration, and maintenance in Lafayette, IN and across multiple states. Free inspections.",
    eyebrow: "Log Home Services", h1: "Specialists in Log Home Care &amp; Restoration",
    intro: "From a fresh coat of stain to a full restoration, we protect log homes the right way - sealing out moisture, blocking UV, and bringing back that warm, natural beauty. We even travel for log cabin work across multiple states.",
    gridEyebrow: "What We Do", gridTitle: "Complete Log Home Care", gridIntro: "Choose a service below to learn more, or request a free inspection and we&rsquo;ll recommend exactly what your home needs.",
    items: [REL.logStaining, REL.caulking, REL.chinking, REL.restoration, REL.maintenance,
      { href: "#estimate", tag: "Inspection", title: "Honest Recommendations", name: "Schedule an Inspection", blurb: "A careful, no-pressure look at your home - then a clear estimate." }],
    inspection: true,
  },
  {
    file: "wood-staining.html", active: "wood",
    title: "Wood Staining | Deck, Fence & Siding Staining - " + SITE.name,
    meta: "Professional deck, fence, and siding/roof staining in Lafayette, IN. Our strip, clean, and stain process delivers a finish that lasts.",
    eyebrow: "Wood Staining", h1: "Decks, Fences &amp; Siding That Look Brand New",
    intro: "Beautiful, long-lasting wood finishes start with proper prep. For every project we follow the same proven process - strip, clean, and stain - so your wood is protected and the color stays rich for years.",
    gridEyebrow: "What We Stain", gridTitle: "Wood Staining Services", gridIntro: "Every project follows our 3-step strip, clean, and stain process. Pick a surface to learn more.",
    items: [REL.deck, REL.fence, REL.siding],
    inspection: false,
  },
  {
    file: "pressure-soft-wash.html", active: "wash",
    title: "Pressure & Soft Washing | House, Roof, Concrete & Gutters - " + SITE.name,
    meta: "Professional pressure and soft washing in Lafayette, IN - house washing, roof washing, concrete cleaning, gutter cleaning, and specialty stain removal.",
    eyebrow: "Pressure / Soft Wash", h1: "The Right Pressure for Every Surface",
    intro: "Some surfaces need power; others need a gentle touch. We use soft washing for delicate areas like siding and roofs, and controlled pressure where it&rsquo;s safe - so your home gets clean without the damage.",
    gridEyebrow: "What We Clean", gridTitle: "Exterior Cleaning, Done Safely", gridIntro: "From your roofline to your driveway, we match the method to the surface. Choose a service to learn more.",
    items: [REL.house, REL.roof, REL.concrete, REL.gutter, REL.stain],
    inspection: false,
  },
];

/* ----------------------------- Landing page ---------------------------- */
function landingPage() {
  const body = `    <section class="hero">
      <div class="container">
        <div class="hero-copy">
          <span class="eyebrow">Clean. Restore. Protect.</span>
          <h1>Log Home Care <span class="accent">Done Right.</span></h1>
          <p class="lead">Indiana&rsquo;s trusted specialists in log home restoration, wood staining, and pressure &amp; soft washing - protecting the homes you love with craftsmanship built to last.</p>
          <div class="btn-row">
            <a class="btn btn-primary btn-lg" href="#estimate">Get a Free Quote</a>
            <a class="btn btn-ghost btn-lg" href="tel:${SITE.phoneTel}">${I.phone} ${SITE.phoneDisplay}</a>
          </div>
          <div class="hero-badges">
            <span class="hero-badge">${I.shield} Fully Insured</span>
            <span class="hero-badge">${I.check} Free Estimates</span>
            <span class="hero-badge">${I.tree} Locally Owned</span>
          </div>
        </div>
        <div class="hero-media-wrap">
          ${media("tall", "Lafayette, Indiana", "Restoring & Protecting Log Homes", "Your project photos will live here - gallery coming soon.")}
        </div>
      </div>
    </section>

    <section class="trust-bar">
      <div class="container">
        <div class="trust-item">${I.shield}<div><div class="t-title">Fully Insured</div><div class="t-sub">Protected &amp; professional</div></div></div>
        <div class="trust-item">${I.hex}<div><div class="t-title">Premium Materials</div><div class="t-sub">Built for Indiana weather</div></div></div>
        <div class="trust-item">${I.shieldCheck}<div><div class="t-title">Free Estimates</div><div class="t-sub">No-pressure, honest quotes</div></div></div>
        <div class="trust-item">${I.check}<div><div class="t-title">50-Mile Service Area</div><div class="t-sub">Cabin work multi-state</div></div></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">What We Do</span>
          <h2>Complete Exterior Wood &amp; Surface Care</h2>
          <p>From hand-crafted log home restoration to everyday exterior cleaning, we keep your investment beautiful and protected, season after season.</p>
        </div>
        <div class="grid grid-3">
          <article class="card service-card reveal">
            <div class="icon">${I.log}</div>
            <h3>Log Home Services</h3>
            <p>Staining, caulking, chinking, restoration, and maintenance to seal out moisture and bring back that rich, natural glow.</p>
            <a class="card-link" href="log-home-services.html">Explore log home care ${I.arrow}</a>
          </article>
          <article class="card service-card reveal">
            <div class="icon">${I.roller}</div>
            <h3>Wood Staining</h3>
            <p>Deck, fence, and siding/roof staining done the right way - strip, clean, and stain - for a finish that lasts.</p>
            <a class="card-link" href="wood-staining.html">Explore wood staining ${I.arrow}</a>
          </article>
          <article class="card service-card reveal">
            <div class="icon">${I.drop}</div>
            <h3>Pressure/Soft Wash</h3>
            <p>House washing, roof washing, concrete, gutters, and specialty stain removal - the right pressure for every surface.</p>
            <a class="card-link" href="pressure-soft-wash.html">Explore washing services ${I.arrow}</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section bg-green">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center light">Our Promise</span>
          <h2 style="color:#fff;">Clean. Restore. Protect.</h2>
          <p style="color:#cfe3d4;">Three simple words guide every job we take on - and they&rsquo;re the reason your home looks better and lasts longer.</p>
        </div>
        <div class="value-grid">
          <div class="value-card reveal">
            <div class="vc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
            <div class="vc-word" style="color:#fff;">Clean</div>
            <p style="color:#cfe3d4;">We remove years of dirt, mildew, and old finish - using the correct pressure and proven techniques for each surface.</p>
          </div>
          <div class="value-card reveal">
            <div class="vc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div>
            <div class="vc-word" style="color:#fff;">Restore</div>
            <p style="color:#cfe3d4;">From media blasting and sanding to caulking, chinking, and staining, we bring weathered wood back to life.</p>
          </div>
          <div class="value-card reveal">
            <div class="vc-icon">${I.shield}</div>
            <div class="vc-word" style="color:#fff;">Protect</div>
            <p style="color:#cfe3d4;">Premium stains and sealants lock out moisture and UV damage, defending your investment through every season.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div class="hero-media-wrap">
            ${media("tall", "About Us", "Craftsmanship You Can Trust")}
          </div>
          <div>
            <span class="eyebrow">Who We Are</span>
            <h2>A Local Team That Treats Your Home Like Our Own</h2>
            <p class="lead" style="margin-bottom:22px;">Evergreen Surface Solutions is a Lafayette, Indiana company built on honest work, careful preparation, and finishes that hold up. We specialize in the demanding work of log home care - and bring that same attention to every deck, fence, and exterior we touch.</p>
            <ul class="checklist" style="margin-bottom:28px;">
              <li>${I.check}<span><strong>Log home specialists</strong> Staining, caulking, chinking &amp; full restoration.</span></li>
              <li>${I.check}<span><strong>Prep done properly</strong> Strip, clean, and protect - never shortcuts.</span></li>
              <li>${I.check}<span><strong>Clear communication</strong> Honest quotes and tidy, respectful crews.</span></li>
            </ul>
            <a class="btn btn-primary" href="about.html">Learn More About Us</a>
          </div>
        </div>
      </div>
    </section>`;
  return {
    file: "index.html",
    html: layout({
      title: `${SITE.name} | Log Home Restoration & Exterior Care - Lafayette, IN`,
      description: "Evergreen Surface Solutions provides expert log home staining & restoration, deck and fence staining, and pressure/soft washing in Lafayette, Indiana. Clean. Restore. Protect.",
      active: "home",
      body,
    }),
  };
}

/* ------------------------------ About page ----------------------------- */
function aboutPage() {
  const body = `${pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, { label: "About" }],
    eyebrow: "Who We Are",
    h1: "Local Roots. Lasting Finishes.",
    intro: "Evergreen Surface Solutions is Lafayette&rsquo;s specialist in log home restoration and exterior wood care - built on honest work and a finish we&rsquo;d be proud to put on our own home.",
  })}
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <span class="eyebrow">Our Story</span>
            <h2>A Company Built on Care &amp; Craftsmanship</h2>
            <p class="lead" style="margin-bottom:22px;">We started Evergreen Surface Solutions with a simple goal: give homeowners a team they can trust with the surfaces that matter most. Log homes especially demand patience, the right products, and proper preparation - and that&rsquo;s exactly the work we love.</p>
            <p style="margin-bottom:22px;">Whether we&rsquo;re re-staining a full log home, restoring a weathered deck, or soft washing years of grime off your siding, we treat every property with the same respect: careful prep, premium materials, tidy work, and a finish designed to protect for years to come. We&rsquo;re based in Lafayette and travel for log cabin work across multiple states.</p>
            <div class="stats" style="margin-top:34px;">
              <div class="stat"><div class="num">100%</div><div class="label">Locally Owned</div></div>
              <div class="stat"><div class="num">Free</div><div class="label">Honest Estimates</div></div>
              <div class="stat"><div class="num">Fully</div><div class="label">Insured</div></div>
            </div>
          </div>
          <div class="hero-media-wrap">
            ${media("tall", "Lafayette, IN", "Proudly Serving the Region", "A photo of the team or a finished project will go here.")}
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-cream2">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">What We Stand For</span>
          <h2>The Evergreen Difference</h2>
        </div>
        <div class="grid grid-3">
          <article class="card reveal"><div class="service-card">
            <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></div>
            <h3>Honesty First</h3>
            <p>Straightforward quotes and clear recommendations. We&rsquo;ll tell you what your home actually needs - nothing more.</p>
          </div></article>
          <article class="card reveal"><div class="service-card">
            <div class="icon">${I.roller}</div>
            <h3>Proper Preparation</h3>
            <p>The finish is only as good as the prep. We strip, clean, and repair correctly before a drop of stain goes on.</p>
          </div></article>
          <article class="card reveal"><div class="service-card">
            <div class="icon">${I.shield}</div>
            <h3>Lasting Protection</h3>
            <p>Premium, weather-rated products and meticulous application that defend your investment season after season.</p>
          </div></article>
        </div>
      </div>
    </section>`;
  return {
    file: "about.html",
    html: layout({
      title: `About & Contact | ${SITE.name} - Lafayette, IN`,
      description: "Meet Evergreen Surface Solutions - Lafayette, Indiana's log home and exterior care specialists. Get in touch for a free, no-pressure estimate.",
      active: "about",
      body,
    }),
  };
}

/* ============================ LOCATIONS =============================== */
// Major towns within ~50 miles of Lafayette. Edit freely — each gets a page.
const TOWNS = [
  { slug: "west-lafayette", name: "West Lafayette", mi: 4 },
  { slug: "dayton", name: "Dayton", mi: 6 },
  { slug: "battle-ground", name: "Battle Ground", mi: 8 },
  { slug: "brookston", name: "Brookston", mi: 15 },
  { slug: "delphi", name: "Delphi", mi: 18 },
  { slug: "rossville", name: "Rossville", mi: 20 },
  { slug: "fowler", name: "Fowler", mi: 22 },
  { slug: "frankfort", name: "Frankfort", mi: 22 },
  { slug: "monticello", name: "Monticello", mi: 25 },
  { slug: "crawfordsville", name: "Crawfordsville", mi: 27 },
  { slug: "attica", name: "Attica", mi: 28 },
  { slug: "flora", name: "Flora", mi: 28 },
  { slug: "oxford", name: "Oxford", mi: 28 },
  { slug: "williamsport", name: "Williamsport", mi: 30 },
  { slug: "logansport", name: "Logansport", mi: 35 },
  { slug: "kokomo", name: "Kokomo", mi: 35 },
  { slug: "rensselaer", name: "Rensselaer", mi: 38 },
  { slug: "lebanon", name: "Lebanon", mi: 38 },
];

// The three service categories (reused from NAV) for the on-page service menu.
const SVC_CATS = NAV.filter((n) => ["log", "wood", "wash"].includes(n.key)).map((n) => ({
  key: n.key, label: n.label, href: n.href, items: n.items,
  icon: { log: I.log, wood: I.roller, wash: I.drop }[n.key],
}));

// Category definitions for the per-town category landing pages.
// Each lists its services as cards that link to the MAIN service pages.
const CATS = [
  { key: "log", name: "Log Home Services", slug: "log-homes", icon: I.log,
    blurb: "Staining, caulking, chinking, restoration &amp; maintenance.",
    items: [REL.logStaining, REL.caulking, REL.chinking, REL.restoration, REL.maintenance] },
  { key: "wood", name: "Wood Staining", slug: "wood-staining", icon: I.roller,
    blurb: "Deck, fence, and siding / roof staining done right.",
    items: [REL.deck, REL.fence, REL.siding] },
  { key: "wash", name: "Pressure &amp; Soft Washing", slug: "pressure-wash", icon: I.drop,
    blurb: "House, roof, concrete, gutters &amp; specialty stain removal.",
    items: [REL.house, REL.roof, REL.concrete, REL.gutter, REL.stain] },
];
const LOG_CAT = CATS[0]; // the Log Home Services category

// Major cities within ~300 miles for LOG CABIN work only (we travel for these).
// Each gets a log-homes-<slug>.html page in the same format as the town pages.
const CABIN_CITIES = [
  { slug: "lafayette", name: "Lafayette", state: "IN", mi: 0 },
  { slug: "indianapolis", name: "Indianapolis", state: "IN", mi: 65 },
  { slug: "terre-haute", name: "Terre Haute", state: "IN", mi: 75 },
  { slug: "champaign", name: "Champaign", state: "IL", mi: 90 },
  { slug: "bloomington", name: "Bloomington", state: "IN", mi: 95 },
  { slug: "fort-wayne", name: "Fort Wayne", state: "IN", mi: 100 },
  { slug: "south-bend", name: "South Bend", state: "IN", mi: 110 },
  { slug: "chicago", name: "Chicago", state: "IL", mi: 125 },
  { slug: "cincinnati", name: "Cincinnati", state: "OH", mi: 160 },
  { slug: "louisville", name: "Louisville", state: "KY", mi: 170 },
  { slug: "columbus-oh", name: "Columbus", state: "OH", mi: 175 },
  { slug: "grand-rapids", name: "Grand Rapids", state: "MI", mi: 200 },
  { slug: "st-louis", name: "St. Louis", state: "MO", mi: 230 },
  { slug: "detroit", name: "Detroit", state: "MI", mi: 270 },
];
const cityLabel = (t) => (t.state ? `${t.name}, ${t.state}` : t.name);

// Hover (desktop) / tap (mobile) service menus that link to the main service pages.
function serviceMenu() {
  return `<div class="svc-menu">
          ${SVC_CATS.map((c) => `<div class="svc-cat">
            <button class="svc-cat-top" aria-expanded="false"><span class="svc-cat-ic">${c.icon}</span><span class="svc-cat-label">${c.label}</span>${I.chev}</button>
            <div class="svc-cat-list">
              <a class="svc-cat-all" href="${c.href}">All ${c.label} ${I.arrow}</a>
              ${c.items.map(([h, l]) => `<a href="${h}">${l}</a>`).join("\n              ")}
            </div>
          </div>`).join("\n          ")}
        </div>`;
}

function locationsPage() {
  const sorted = [...TOWNS].sort((a, b) => a.mi - b.mi);
  const buttons = sorted
    .map((t) => `<a class="town-btn" href="${t.slug}.html"><span>${t.name}</span><small>${t.mi} mi</small></a>`)
    .join("\n          ");
  const cabinButtons = CABIN_CITIES
    .map((t) => `<a class="town-btn" href="log-homes-${t.slug}.html"><span>${cityLabel(t)}</span><small>${t.mi === 0 ? "Home base" : t.mi + " mi"}</small></a>`)
    .join("\n          ");
  const body = `${pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, { label: "Locations" }],
    eyebrow: "Service Area",
    h1: "Areas We Serve",
    intro: "Based in Lafayette, we cover a 50-mile radius for everyday pressure washing, staining, and log home care - and we travel up to 300 miles across the Midwest for log cabin work and restoration.",
  })}
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">Two Service Radiuses</span>
          <h2>Right Around Lafayette - and Across the Midwest</h2>
          <p>The inner ring is our ~50-mile zone for everyday pressure washing, deck &amp; fence staining, and log home care. The outer ring is our ~300-mile reach for log cabin staining and restoration - we travel across Indiana, Illinois, Ohio, Michigan, Kentucky, and beyond.</p>
        </div>
        <div class="map-wrap">
          <div id="radius-map" class="radius-map" data-needs-maps>
            <div class="map-fallback">${I.pin}<span>Interactive service-radius map loads here once a Google Maps API key is added in <code>build/generate.js</code>.</span></div>
          </div>
        </div>
        <div class="map-legend">
          <span class="legend-item"><span class="legend-dot legend-green"></span> ~50 mi - all services</span>
          <span class="legend-item"><span class="legend-dot legend-blue"></span> ~300 mi - log cabin work</span>
        </div>
      </div>
    </section>

    <section class="section bg-cream2">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">Pick Your Town</span>
          <h2>Local Service, Close to Home</h2>
          <p>Within ~50 miles of Lafayette - choose your area to see every service we offer there. Don&rsquo;t see your town? If you&rsquo;re near Lafayette, we very likely cover you - just <a href="#estimate">ask for a free quote</a>.</p>
        </div>
        <div class="town-grid">
          ${buttons}
        </div>
      </div>
    </section>

    <section class="section anchor" id="cabins">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">Log Cabin Work - 300-Mile Radius</span>
          <h2>Log Cabin Restoration Across the Midwest</h2>
          <p>Cabins are our specialty, and we travel for them. Pick a city to see our log home &amp; cabin services there - staining, caulking, chinking, restoration, and maintenance.</p>
        </div>
        <div class="town-grid">
          ${cabinButtons}
        </div>
      </div>
    </section>`;
  return {
    file: "locations.html",
    html: layout({
      title: `Service Areas Near Lafayette, IN | ${SITE.name}`,
      description: "Evergreen Surface Solutions serves Lafayette, West Lafayette, and towns within ~50 miles for pressure washing, staining, and log home care - plus Midwest cabin restoration.",
      active: "locations",
      body,
    }),
  };
}

function townPage(t) {
  const cards = CATS.map((c) => `<a class="card hub-card reveal" href="${c.slug}-${t.slug}.html">
            ${media("short", c.name, `${c.name} in ${t.name}`)}
            <div class="hub-body"><h3>${c.name}</h3><p>${c.blurb}</p><span class="card-link">View services ${I.arrow}</span></div>
          </a>`).join("\n          ");
  const body = `${pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, { label: "Locations", href: "locations.html" }, { label: t.name }],
    eyebrow: "Service Area",
    h1: `Home Services in ${t.name}, IN`,
    intro: `Just ${t.mi} miles from our Lafayette home base, ${t.name} is right in our service area for pressure &amp; soft washing, deck and fence staining, and log home care.`,
  })}
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">${t.name} Services</span>
          <h2>What We Offer in ${t.name}</h2>
          <p>Pick a service category to see everything we do in ${t.name}, then click any service for full details.</p>
        </div>
        <div class="grid grid-3">
          ${cards}
        </div>
        <p class="text-center muted" style="margin-top:30px;max-width:60ch;margin-left:auto;margin-right:auto;">Have a log cabin outside the area? We travel across the Midwest for cabin restoration - <a href="#estimate">tell us about your project</a>.</p>
      </div>
    </section>`;
  return {
    file: `${t.slug}.html`,
    html: layout({
      title: `${t.name}, IN Pressure Washing, Staining &amp; Log Home Care | ${SITE.name}`,
      description: `Pressure washing, deck &amp; fence staining, and log home services in ${t.name}, Indiana. Free estimates from Evergreen Surface Solutions, based in nearby Lafayette.`,
      active: "locations",
      body,
    }),
  };
}

// One page per town/city per category, e.g. log-homes-flora.html or
// log-homes-chicago.html ("Log Home Services in Flora" / "... in Chicago, IL").
// Cabin cities (t.cabin) only get the Log Home Services page.
function townCategoryPage(t, c) {
  const disp = cityLabel(t);
  const isCabin = !!t.cabin;
  const dist = t.mi === 0 ? "right here in Lafayette" : `about ${t.mi} miles from our Lafayette base`;
  const cards = c.items.map((r) => `<a class="card hub-card reveal" href="${r.href}">
            ${media("short", r.tag, r.title)}
            <div class="hub-body"><h3>${r.name}</h3><p>${r.blurb}</p><span class="card-link">Learn more ${I.arrow}</span></div>
          </a>`).join("\n          ");
  const intro = isCabin
    ? `We travel to ${disp} - ${dist} - for log home and log cabin staining, restoration, caulking, chinking, and maintenance. Choose a service below for full details and a free quote.`
    : `${c.name} for ${t.name} homeowners, ${dist}. Choose a service below for full details and a free quote.`;
  const townCrumb = isCabin ? { label: disp } : { label: t.name, href: `${t.slug}.html` };
  // Regular towns show the other two categories; cabin cities link back to all areas.
  const siblings = isCabin
    ? `<div class="section-head center" style="margin-top:54px;margin-bottom:20px;"><h3>More Cabin &amp; Service Areas</h3></div>
        <div class="town-grid-center">
          <a class="town-btn" href="locations.html#cabins"><span>All Cabin Areas</span><small>300-mi radius</small></a>
          <a class="town-btn" href="log-home-services.html"><span>Log Home Services</span><small>Overview</small></a>
        </div>`
    : `<div class="section-head center" style="margin-top:54px;margin-bottom:20px;"><h3>Also in ${t.name}</h3></div>
        <div class="town-grid-center">
          ${CATS.filter((x) => x.key !== c.key).map((x) => `<a class="town-btn" href="${x.slug}-${t.slug}.html"><span>${x.name}</span><small>${t.name}</small></a>`).join("\n          ")}
        </div>`;
  const body = `${pageHero({
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "Locations", href: "locations.html" },
      townCrumb,
      { label: c.name },
    ],
    eyebrow: disp,
    h1: `${c.name} in ${disp}`,
    intro,
  })}
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">${disp}</span>
          <h2>Our ${c.name} in ${t.name}</h2>
          <p>${c.blurb} Click any service for details - we bring the same premium prep and lasting finish to every ${disp} project.</p>
        </div>
        <div class="grid grid-3">
          ${cards}
        </div>
        ${siblings}
      </div>
    </section>`;
  return {
    file: `${c.slug}-${t.slug}.html`,
    html: layout({
      title: `${c.name} in ${disp} | ${SITE.name}`,
      description: `${c.name} in ${disp} - ${c.blurb} Free estimates from Evergreen Surface Solutions, based near Lafayette.`,
      active: "locations",
      body,
    }),
  };
}

function blogPage() {
  const body = `${pageHero({
    crumbs: [{ label: "Home", href: "index.html" }, { label: "Blog" }],
    eyebrow: "Blog",
    h1: "Tips, Stories &amp; Seasonal Advice",
    intro: "Project write-ups, before-and-afters, and care tips for log homes, decks, and exteriors. New posts coming soon.",
  })}
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow center">Coming Soon</span>
          <h2>Our First Posts Are On the Way</h2>
          <p>We&rsquo;re putting together helpful guides and project stories. Check back soon - or <a href="#estimate">get a free quote</a> in the meantime.</p>
        </div>
        <!-- ADD BLOG POSTS HERE: drop an .html file in the /blog folder, then
             copy a card below and point the href at it.
        <div class="grid grid-3">
          <a class="card hub-card reveal" href="blog/my-first-post.html">
            ${media("short", "Blog", "Post Title")}
            <div class="hub-body"><h3>Post Title</h3><p>One-line summary of the post.</p><span class="card-link">Read more ${I.arrow}</span></div>
          </a>
        </div>
        -->
        <div class="blog-empty">
          ${I.tree}
          <p>No posts yet - check back shortly!</p>
        </div>
      </div>
    </section>`;
  return {
    file: "blog.html",
    html: layout({
      title: `Blog | ${SITE.name}`,
      description: "Tips, project stories, and seasonal exterior-care advice from Evergreen Surface Solutions in Lafayette, IN.",
      active: "blog",
      body,
    }),
  };
}

/* ============================== QR PAGE =============================== */
// Linktree-style door-hanger landing page (residential neighborhoods).
// Sample reviews — REPLACE with real ones from your Google page.
const REVIEWS = [
  { name: "Alin M.", rating: 5, text: "Our house hasn't been cleaned in 10 years and now it looks like new again. Vey happy that we found Evergreen and I recommend it to anyone for their professionalism, punctuality and value for the money.", url: SITE.googleProfile },
  { name: "Dustin M.", rating: 5, text: "If you are looking for a power washing company that delivers outstanding results, fair pricing, exceptional customer service, and meticulous attention to detail, I highly recommend Cameron. We are extremely satisfied and will absolutely use his services again in the future.", url: SITE.googleProfile },
  { name: "Tristan C.", rating: 5, text: "Extremely easy to work with. Was able to work around my difficult schedule, and not only got the job done in a timely matter, but also did a fantastic job!", url: SITE.googleProfile },
];
function qrPage() {
  const btn = (href, label, icon, ext) =>
    `<a class="qr-btn" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="qr-btn-ic">${icon}</span><span>${label}</span></a>`;
  const social = (href, label, icon) =>
    `<a class="qr-social" href="${href}" target="_blank" rel="noopener" aria-label="${label}">${icon}</a>`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${SITE.name} | Pressure Washing &amp; Staining - Lafayette, IN</title>
  <meta name="description" content="Pressure washing, soft washing, and deck &amp; fence staining in Greater Lafayette, IN. Get a free quote, see reviews, and follow us." />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="alternate icon" href="Photos/evergreen-surface-solutions-logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body class="qr-body">
  <main class="qr-wrap">
    <div class="qr-card">
      <a href="index.html" class="qr-logo" aria-label="${SITE.name} home"><img src="Photos/evergreen-surface-solutions-logo.png" alt="${SITE.name} logo" /></a>
      <h1 class="qr-name"><span class="w1">Evergreen</span><span class="w2">Surface Solutions</span></h1>
      <p class="qr-tagline">Clean. Restore. Protect.</p>
      <p class="qr-sub">Pressure washing &amp; staining for Greater Lafayette homes</p>

      <div class="qr-stack">
        ${btn("#estimate", "Get a Free Quote", I.mail)}
        ${btn("pressure-soft-wash.html", "Pressure Washing", I.drop)}
        ${btn("wood-staining.html", "Fence &amp; Deck Staining", I.roller)}
        ${btn("#reviews", "Read Our Reviews", I.star)}
        ${btn(SITE.googleProfile, "View Us on Google", I.googleG, true)}
      </div>

      <div class="qr-socials">
        ${social(SITE.social.facebook, "Facebook", I.facebook)}
        ${social(SITE.social.instagram, "Instagram", I.instagram)}
        ${social(SITE.social.nextdoor, "Nextdoor", I.nextdoor)}
      </div>
    </div>

    <section class="qr-section" id="reviews">
      <div class="qr-reviews">
        <div class="review-head"><span class="eyebrow center light">${I.googleG} Google Reviews</span></div>
        <div class="review-card" id="review-card" aria-live="polite"></div>
        <div class="review-dots" id="review-dots"></div>
        <a class="btn btn-outline-light" href="${SITE.googleProfile}" target="_blank" rel="noopener" style="margin-top:18px;">See all reviews ${I.arrow}</a>
      </div>
    </section>

${estimate("house-wash")}

    <footer class="qr-foot">
      <div class="fc-line">${I.phone}<a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a></div>
      <div class="fc-line">${I.mail}<a href="mailto:${SITE.email}">${SITE.email}</a></div>
      <p>&copy; <span data-year>2026</span> ${SITE.name}</p>
    </footer>
  </main>

  <script type="application/json" id="reviews-data">${JSON.stringify(REVIEWS)}</script>
  <script>window.EVG_MAPS_KEY=${JSON.stringify(SITE.mapsApiKey)};window.EVG_MAP=${JSON.stringify(SITE.map)};</script>
  <script src="assets/script.js"></script>
</body>
</html>
`;
  return { file: "qr.html", html };
}

/* ------------------------------- Build --------------------------------- */
const pages = [
  landingPage(), aboutPage(), ...HUBS.map(hubPage), ...SUBPAGES.map(subPage),
  locationsPage(), ...TOWNS.map(townPage),
  ...TOWNS.flatMap((t) => CATS.map((c) => townCategoryPage(t, c))),
  ...CABIN_CITIES.map((city) => townCategoryPage({ ...city, cabin: true }, LOG_CAT)),
  blogPage(), qrPage(),
];
let count = 0;
for (const pg of pages) {
  fs.writeFileSync(path.join(ROOT, pg.file), pg.html, "utf8");
  count++;
  console.log("wrote", pg.file);
}
console.log(`\nDone - ${count} pages generated.`);
