/* Browser-local storefront concepts. Requests never leave this page. */
"use strict";
const $ = (s, root = document) => root.querySelector(s);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const asset = name => `${PREFIX}assets/${encodeURIComponent(name)}`;
const href = store => `${PREFIX}${encodeURIComponent(store.slug)}/index.html`;
const main = $("#main");
let saved;
try { saved = new Set(JSON.parse(localStorage.getItem("nnn-storefront-saved-v1") || "[]")); }
catch { saved = new Set(); }
let category = "All businesses", query = "", savedOnly = new URLSearchParams(location.search).get("saved") === "1";
let toastTimer;
const searchIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="m15 15 6 6" stroke="currentColor" stroke-width="1.5"/></svg>';

function toast(text) {
  const box = $("#toast"); box.textContent = text; box.classList.add("on");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove("on"), 2400);
}
function syncSaved() {
  $("#saved-count").textContent = DATA.stores.filter(s => saved.has(s.id)).length;
  document.querySelectorAll("[data-save]").forEach(button => {
    const active = saved.has(button.dataset.save);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", `${active ? "Unsave" : "Save"} ${DATA.stores.find(s => s.id === button.dataset.save)?.name || "business"}`);
    button.innerHTML = button.classList.contains("save-store") ? `<span aria-hidden="true">${active ? "♥" : "♡"}</span> ${active ? "Saved" : "Save this place"}` : `<span aria-hidden="true">${active ? "♥" : "♡"}</span>`;
  });
}
function saveStore(id) {
  if (saved.has(id)) { saved.delete(id); toast("Removed from your saved places"); }
  else { saved.add(id); toast("A good find. Saved for later."); }
  try { localStorage.setItem("nnn-storefront-saved-v1", JSON.stringify([...saved])); } catch { /* memory-only saving remains usable */ }
  if (!DATA.store && savedOnly) renderResults();
  syncSaved();
}
function card(store, eager = false) {
  return `<article class="shop-card" data-store="${esc(store.id)}">
    <div class="card-image"><a href="${href(store)}" tabindex="-1" aria-hidden="true"><img src="${asset(store.image)}" alt="${esc(store.tagline)} — concept imagery" loading="${eager ? "eager" : "lazy"}" decoding="async" width="1536" height="1024"></a><button class="save-button" type="button" data-save="${esc(store.id)}" aria-pressed="false" aria-label="Save ${esc(store.name)}">♡</button></div>
    <p class="card-category">${esc(store.category)}</p><h3><a href="${href(store)}">${esc(store.name)}</a></h3><p class="card-description">${esc(store.tagline)}</p>
    <a class="card-foot" href="${href(store)}" aria-label="Browse ${esc(store.name)} storefront"><span>Explore storefront</span><span aria-hidden="true">↗</span></a>
  </article>`;
}
function renderHome() {
  const feature = DATA.featured.map(id => DATA.stores.find(s => s.id === id));
  const lead = feature[0];
  main.innerHTML = `<section class="home-hero wrap">
    <div class="hero-copy"><p class="eyebrow">A LOCAL KIND OF DISCOVERY</p><h1>Good things.<br><em>Great neighbors.</em></h1><p>Discover the shops, the makers, and the everyday favorites that make this place feel like home.</p>
      <div class="hero-actions"><a class="button primary" href="#discover">Explore the neighborhood <span aria-hidden="true">↗</span></a><a class="text-link" href="#community">Meet the community</a></div>
      <div class="hero-facts"><span><i class="fact-dot"></i>${DATA.stores.length} local storefronts</span><span><i class="fact-dot"></i>Nappanee & nearby</span><span><i class="fact-dot"></i>People first</span></div>
    </div>
    <a class="hero-photo" href="${href(lead)}"><img src="${asset(lead.image)}" alt="Warm bookshop concept with sunlit oak shelves and a reading table" fetchpriority="high" width="1536" height="1024"><span class="photo-chip">THE NEIGHBORHOOD EDIT · 01</span><span class="photo-caption"><span><small>A LITTLE CURIOSITY GOES A LONG WAY</small><strong>${esc(lead.name)}</strong></span><span class="circle-arrow" aria-hidden="true">↗</span></span></a>
  </section>
  <section class="section wrap"><div class="section-title"><div><p class="eyebrow">WORTH A CLOSER LOOK</p><h2>Meet a few neighbors.</h2></div><a class="section-link" href="#discover">View all businesses <span aria-hidden="true">↗</span></a></div><div class="featured-grid">${feature.map(s => card(s)).join("")}</div></section>
  <section class="section discovery wrap" id="discover"><div class="discovery-heading"><div class="section-title"><div><p class="eyebrow">YOUR NEXT LOCAL FAVORITE</p><h2>The neighborhood, at a glance.</h2><p>Find something good. Keep it close to home.</p></div></div><label class="search-wrap">${searchIcon}<input id="search" type="search" placeholder="Find a shop, a service, a little treat…" aria-label="Search businesses"></label></div>
    <div class="filter-row" role="group" aria-label="Business categories">${DATA.categories.map(c => `<button class="filter" type="button" data-category="${esc(c)}" aria-pressed="${c === category}">${esc(c)}</button>`).join("")}</div>
    <div class="results-meta"><span id="result-count" aria-live="polite"></span><button id="clear-filters" type="button" hidden>Clear filters</button><span id="concept-note">A collection of storefront concepts</span></div><div class="directory-grid" id="directory-grid"></div>
  </section>
  <section class="community wrap" id="community"><div><p class="eyebrow">MORE THAN A MARKETPLACE</p><h2>A neighborhood is made<br>of people like you.</h2><p>Discover a local favorite, share a ride, or ask a neighbor who's already out to grab something. That's what neighbors are for.</p><a class="button light" href="https://discord.com/channels/1555522220657483826" target="_blank" rel="noopener">Open the Discord community <span aria-hidden="true">↗</span></a></div><div class="community-points"><div class="community-point"><span>01</span><div><h3>Discover something local</h3><p>Explore the people and places right around you.</p></div></div><div class="community-point"><span>02</span><div><h3>Make a connection</h3><p>Find the business, a ride, or a neighbor who can help.</p></div></div><div class="community-point"><span>03</span><div><h3>Keep the good going</h3><p>Save your favorites and come back for your next find.</p></div></div></div></section>`;
  $("#search").addEventListener("input", e => { query = e.target.value; renderResults(); });
  $("#clear-filters").addEventListener("click", clearFilters);
  renderResults();
}
function clearFilters() { category = "All businesses"; query = ""; savedOnly = false; $("#search").value = ""; renderResults(); }
function renderResults() {
  const needle = query.trim().toLowerCase();
  const filtered = DATA.stores.filter(s => (category === "All businesses" || s.category === category) && (!savedOnly || saved.has(s.id)) && `${s.name} ${s.tagline} ${s.category} ${s.offers.map(o => o.name).join(" ")}`.toLowerCase().includes(needle));
  $("#directory-grid").innerHTML = filtered.length ? filtered.map(s => card(s)).join("") : `<div class="empty-state"><h3>${savedOnly ? "Your next favorite is waiting." : "A little further afield?"}</h3><p>${savedOnly ? "Tap a heart on any business to keep it here for later." : "Try another search or explore all ${DATA.stores.length} neighbors."}</p><button class="button primary" data-clear type="button">Explore all businesses <span>↗</span></button></div>`;
  $("#result-count").textContent = `${filtered.length} ${savedOnly ? "saved " : ""}${filtered.length === 1 ? "business" : "businesses"}`;
  const active = needle || category !== "All businesses" || savedOnly;
  $("#clear-filters").hidden = !active; $("#concept-note").hidden = Boolean(active);
  document.querySelectorAll("[data-category]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.category === category)));
  syncSaved();
}
const dayNames = {mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"};
function timeLabel(value) { const [h,m] = value.split(":").map(Number); return `${h % 12 || 12}${m ? ":" + String(m).padStart(2,"0") : ""} ${h % 24 < 12 ? "AM" : "PM"}`; }
function renderStore(store) {
  document.documentElement.style.setProperty("--accent", store.accent);
  const phone = store.phone.replace(/[^0-9+]/g, "");
  const nearby = DATA.stores.filter(s => s.id !== store.id).sort((a,b) => Number(b.category === store.category) - Number(a.category === store.category)).slice(0,3);
  const front = store.front ? `<section class="store-front"><img src="${asset(store.front)}" alt="${esc(store.name)} storefront, concept art" fetchpriority="high" width="1600" height="900"><span class="image-note">Concept art made from a street photo of the storefront</span></section>` : "";
  main.innerHTML = `${front}<div class="wrap"><div class="breadcrumb"><a href="${PREFIX}index.html#discover">← Back to the neighborhood</a><button class="preview-badge" type="button" data-about>Storefront preview <span aria-hidden="true">↗</span></button></div>
    <div class="store-identity"><div><p class="store-name">${esc(store.name)}</p><p class="store-location"><span aria-hidden="true">⌖</span>${esc(store.address)}</p></div><button class="save-store" type="button" data-save="${esc(store.id)}" aria-pressed="false"><span aria-hidden="true">♡</span> Save this place</button></div>
    <section class="store-hero"><div class="hero-copy"><p class="eyebrow">${esc(store.category)} · ${esc(store.town || "NAPPANEE, INDIANA")}</p><h1>${esc(store.headline).replace(/\n/g,"<br>")}</h1><p>${esc(store.intro)}</p><div class="hero-actions"><a class="button primary" href="#offerings">Explore the offerings <span aria-hidden="true">↗</span></a><a class="text-link" href="#visit">Plan a visit</a></div></div><div class="hero-photo"><img src="${asset(store.image)}" alt="${esc(store.tagline)} — illustrative storefront concept" fetchpriority="high" width="1536" height="1024"><span class="image-note">Concept imagery · not the actual location</span></div></section>
    <div class="store-strip"><div><small>THE PLACE</small>${esc(store.tagline)}</div><div><small>THE CONNECTION</small>A local business, a familiar neighborhood</div><div><small>THE EXPERIENCE</small>Browse here. Connect directly.</div></div>
    <section class="section" id="offerings"><div class="section-title"><div><p class="eyebrow">A LITTLE WINDOW INTO THE SHOP</p><h2>${store.offers.some(o=>o.image) ? "Find something that speaks to you." : "Make a little time for what matters."}</h2><p>${store.real_prices ? "Services and prices as listed by the business. Availability is for the business to confirm." : "Sample offerings to explore. Availability and details are for the business to confirm."}</p></div></div><div class="offer-grid">${store.offers.map((offer,i) => `<article class="offer-card">${offer.image ? `<div class="offer-image"><img src="${asset(offer.image)}" alt="Illustrative ${esc(offer.name)} concept" loading="lazy" width="1536" height="1024"><span class="sample-chip">CONCEPT COLLECTION</span></div>` : `<div class="service-number"><span>${String(i+1).padStart(2,"0")}</span><span aria-hidden="true">↗</span></div>`}<div class="offer-content"><h3>${esc(offer.name)}</h3><p>${esc(offer.note)}</p>${offer.price ? `<div class="offer-price">${esc(offer.price)} <small>· ${store.real_prices ? "listed price" : "sample price"}</small></div>` : ""}<button class="button" type="button" data-offer="${i}">Preview a request <span aria-hidden="true">↗</span></button></div></article>`).join("")}</div></section>
    <section class="section about-store" id="visit"><div><p class="eyebrow">COME SAY HELLO</p><h2>Good to know<br>before you go.</h2><p>Start with a visit, a question, or a conversation. Contact the business directly for current hours, real offerings, and availability.</p><div class="contact-lines"><span>${esc(store.address)}</span><a href="${esc(store.map)}" target="_blank" rel="noopener">Get directions ↗</a>${phone ? `<a href="tel:${esc(phone)}">${esc(store.phone)}</a>` : "<span>Phone number not listed</span>"}</div></div><div class="hours-panel"><h3>Plan your visit</h3><ul class="hours-list">${Object.entries(dayNames).map(([key,name])=>`<li><span>${name}</span><span>${Array.isArray(store.hours[key]) ? store.hours[key].map(timeLabel).join(" – ") : store.hours[key] ? esc(store.hours[key]) : "Closed"}</span></li>`).join("")}</ul><p class="hours-note">${esc(store.hours_note)}</p></div></section>
    ${store.discord ? `<section class="store-community"><div><h3>Keep the conversation local.</h3><p>Find this business's sample channel in Nosey Neighbors Nappanee.</p></div><a class="button primary" href="${esc(store.discord)}" target="_blank" rel="noopener">Explore on Discord <span aria-hidden="true">↗</span></a></section>` : ""}
    ${nearby.length ? "" : "<!--"}<section class="section"><div class="section-title"><div><p class="eyebrow">WHILE YOU'RE IN THE NEIGHBORHOOD</p><h2>A few more good finds.</h2></div><a class="section-link" href="${PREFIX}index.html#discover">See all <span>↗</span></a></div><div class="related-grid">${nearby.map(s=>card(s)).join("")}</div></section>${nearby.length ? "" : "-->"}
  </div>`;
  syncSaved();
}
function dateOptions(store) {
  const result = [], date = new Date(); date.setHours(12,0,0,0);
  const keys = ["sun","mon","tue","wed","thu","fri","sat"];
  for (let i = 0; i < 28 && result.length < 8; i++) {
    date.setDate(date.getDate()+1);
    const hours = store.hours[keys[date.getDay()]];
    if (!Array.isArray(hours)) continue;
    const start = Number(hours[0].slice(0,2))*60+Number(hours[0].slice(3));
    let end = Number(hours[1].slice(0,2))*60+Number(hours[1].slice(3));
    if (end <= start) end += 1440;
    const slots = []; for (let minute = start; minute+60 <= end && minute < 1440; minute+=60) slots.push(`${String(Math.floor(minute/60)).padStart(2,"0")}:${String(minute%60).padStart(2,"0")}`);
    if (!slots.length) continue;
    result.push({key:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`, label:date.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),slots});
  }
  return result;
}
function openRequest(index) {
  const store = DATA.store, offer = store.offers[index], dates = dateOptions(store);
  const dialog = $("#request-dialog");
  $("#dialog-content").innerHTML = `<div class="dialog-body"><p class="eyebrow">TRY THE EXPERIENCE</p><h2 id="dialog-title">Make a little plan.</h2><p>This is a sample request. Nothing is sent to the business.</p><div class="request-item"><img src="${asset(offer.image || store.image)}" alt=""><div><small>${esc(store.name)}</small><strong>${esc(offer.name)}</strong></div></div><form id="request-form"><label>Choose a day<select id="request-day" required><option value="">Pick a sample date</option>${dates.map(d=>`<option value="${d.key}">${d.label}</option>`).join("")}</select></label><label>Choose a time<select id="request-time" required disabled><option value="">Choose a day first</option></select></label><p class="form-note">Times are illustrative, not live availability. No payment or contact information is needed to try the preview.</p><button class="button primary" type="submit" id="confirm-request" disabled>Create sample request <span aria-hidden="true">↗</span></button></form></div>`;
  $("#request-day").addEventListener("change", e => {
    const date = dates.find(d => d.key === e.target.value), time = $("#request-time");
    time.disabled = !date;
    time.innerHTML = '<option value="">Pick a sample time</option>' + (date?.slots || []).map(t=>`<option value="${t}">${timeLabel(t)}</option>`).join("");
    $("#confirm-request").disabled = true;
  });
  $("#request-time").addEventListener("change", e => { $("#confirm-request").disabled = !e.target.value; });
  $("#request-form").addEventListener("submit", e => {
    e.preventDefault();
    const date = dates.find(d => d.key === $("#request-day").value), time = $("#request-time").value;
    if (!date?.slots.includes(time)) return;
    $("#dialog-content").innerHTML = `<div class="dialog-body"><div class="confirmation-mark" aria-hidden="true">✓</div><p class="eyebrow">A PREVIEW OF THE NEXT STEP</p><h2 id="dialog-title">That's how easy<br>local could feel.</h2><p>Your sample request is ready. In a live storefront, this is where the business would receive the details and confirm availability.</p><div class="confirmation-summary"><div><span>Business</span><strong>${esc(store.name)}</strong></div><div><span>Request</span><strong>${esc(offer.name)}</strong></div><div><span>When</span><strong>${esc(date.label)}, ${timeLabel(time)}</strong></div><div><span>Status</span><strong>Preview only · not sent</strong></div></div><button class="button primary" type="button" id="back-to-store">Back to the storefront <span aria-hidden="true">↗</span></button></div>`;
    $("#back-to-store").addEventListener("click", () => dialog.close());
    $("#back-to-store").focus();
  });
  dialog.showModal();
}
document.addEventListener("click", event => {
  const save = event.target.closest("[data-save]"); if (save) { saveStore(save.dataset.save); return; }
  const filter = event.target.closest("[data-category]"); if (filter) { category = filter.dataset.category; renderResults(); return; }
  const offer = event.target.closest("[data-offer]"); if (offer) { openRequest(Number(offer.dataset.offer)); return; }
  if (event.target.closest("[data-clear]")) clearFilters();
  if (event.target.closest("[data-about]")) $("#about-dialog").showModal();
});
$("#saved-link").addEventListener("click", () => {
  if (DATA.store) location.href = `${PREFIX}index.html?saved=1#discover`;
  else { savedOnly = !savedOnly; renderResults(); $("#discover").scrollIntoView({behavior:"smooth"}); }
});
$("#about-preview").addEventListener("click", () => $("#about-dialog").showModal());
document.querySelectorAll(".close-dialog").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
$(".close-about").addEventListener("click", () => $("#about-dialog").close());
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } }));
if (DATA.store) renderStore(DATA.store); else renderHome();
syncSaved();
