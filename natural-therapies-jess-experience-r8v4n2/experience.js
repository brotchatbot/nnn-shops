'use strict';
const posters = {
  bungee: {image:'jess-bungee.jpg', title:'A little bungee energy.', note:'The MIX fitness artwork from the supplied posts. View the separate announcement for the original “coming soon” details.'},
  announcement: {image:'bungee-announcement.jpg', title:'The bungee announcement.', note:'This shared announcement names The MIX in Goshen, Indiana. Its morning, afternoon and evening choices are a preference poll, not a live class schedule. Opening date, prices and eligibility need confirmation.'},
  celestial: {image:'celestial-crafts.jpg', title:'A little moon magic.', note:'The supplied promotion lists $17 for a take-home kit and $20 for an in-person class, with supplies included. Current availability, class date and location need confirmation.'},
  pumpkin: {image:'pumpkin-crafts.jpg', title:'Cozy little creations.', note:'The supplied flyer lists Saturday, November 7, noon–4 pm, $30 per person and 18 pumpkins. The year is not shown. This gallery does not verify the event date or remaining places.'},
  bottles: {image:'mix-bottles.jpg', title:'A bottle with personality.', note:'The MIX bungee collection. The shared artwork lists $14.99. Confirm current pricing, designs, stock, pickup and shipping before ordering.'},
  activewear: {image:'mix-activewear.jpg', title:'Sparkle & fly.', note:'Activewear shown in the supplied The MIX post. Prices, sizes, materials and availability have not been confirmed.'},
  tank: {image:'mix-tank.jpg', title:'Good energy, worn.', note:'The MIX tank shown in the supplied post. Prices, sizes, materials and availability have not been confirmed.'},
  acorns: {image:'jess-acorns.jpg', title:'A little glimpse of her world.', note:'Playful autumn artwork supplied from Jess’s social posts. Shown here as a little piece of her personality.'}
};
const experiences = {
  move:{image:'jess-bungee.jpg',alt:'The MIX bungee fitness promotional artwork',tag:'THE MIX · FROM THE SHARED POSTS',eyebrow:'A LITTLE LIFT. A LOT OF LAUGHTER.',heading:'Find your<br><em>flying spirit.</em>',description:'The MIX’s bungee posts bring the energy: a new way to move, try something different, and have a little fun with it.',action:'Explore bungee ↗',attribute:'data-bungee',value:'',poster:'bungee',note:'The shared announcement says Goshen, Indiana and “coming soon.” Class dates and prices need confirmation.'},
  make:{image:'celestial-crafts.jpg',alt:'The MIX celestial moon and star craft promotion',tag:'THE MIX · FROM THE SHARED POSTS',eyebrow:'A LITTLE CREATIVITY GOES A LONG WAY.',heading:'Make a little<br><em>moon magic.</em>',description:'A crescent moon, a few little stars, and something lovely you made yourself. Discover the Celestial Treasure Creations promotion.',action:'Explore the craft ↗',attribute:'data-poster',value:'celestial',poster:'celestial',note:'Posted prices: $17 for a take-home kit or $20 for an in-person class. Confirm current details and availability.'},
  unwind:{image:'massage.jpg',alt:'A relaxing massage at the heart of the bodywork experience',tag:'NATURAL THERAPIES · ELKHART',eyebrow:'LESS RUSH. MORE ROOM FOR YOU.',heading:'Come back<br><em>to yourself.</em>',description:'Thoughtful bodywork with Jess, shaped around your session. Take a quiet hour to slow down and make a little space for yourself.',action:'Find your session ↗',attribute:'data-book',value:'Massage & bodywork',poster:null,note:'60-minute massage: $80 published new-client rate. Existing clients retain their current rates.'}
};
function selectExperience(id, focus=false){
  const item=experiences[id]; if(!item)return;
  $$('[data-experience]').forEach(button=>{const active=button.dataset.experience===id;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();});
  const panel=$('#experience-panel');panel.className=`experience-panel ${id}`;panel.setAttribute('aria-labelledby',`tab-${id}`);
  $('#experience-image').src=`assets/${item.image}`;$('#experience-image').alt=item.alt;
  $('#experience-tag').textContent=item.tag;$('#experience-eyebrow').textContent=item.eyebrow;
  $('#experience-heading').innerHTML=item.heading;$('#experience-description').textContent=item.description;
  $('#experience-note').textContent=item.note;
  const action=$('#experience-action');['data-book','data-bungee','data-poster'].forEach(a=>action.removeAttribute(a));action.setAttribute(item.attribute,item.value);action.textContent=item.action;
  const poster=$('#experience-poster');poster.hidden=!item.poster;if(item.poster)poster.dataset.poster=item.poster;
}
function showPoster(id){
  const poster=posters[id];if(!poster)return;
  showModal(`<p class="eyebrow">FROM THE SUPPLIED SOCIAL POSTS</p><h2 class="modal-heading poster-heading" id="modal-title">${poster.title}</h2><img class="full-poster" src="assets/${poster.image}" alt="${escape(poster.title)}"><p class="modal-copy">${poster.note}</p><div class="modal-actions"><a class="text-link" href="assets/${poster.image}" target="_blank" rel="noopener">Open original image ↗</a>${id==='bungee'?'<button class="text-link" data-poster="announcement">See the class announcement ↗</button>':''}</div>`);
}
function showClassInterest(){
  showModal(`<p class="eyebrow">THE MIX · GOSHEN, INDIANA</p><h2 class="modal-heading" id="modal-title">When’s your<br>kind of good?</h2><p class="modal-copy">The shared bungee announcement asks which part of the day people prefer. Try the idea below.</p><form id="interest-form"><div class="interest-options"><label><input type="radio" name="class-time" value="Morning" checked>Morning<span>9 am–noon</span></label><label><input type="radio" name="class-time" value="Afternoon">Afternoon<span>Noon–4 pm</span></label><label><input type="radio" name="class-time" value="Evening">Evening<span>4–8 pm</span></label></div><p class="modal-note">Sample preference poll, not a class schedule. No bookable classes or live waitlist are connected. Your selection will not be sent or saved.</p><button class="button dark" type="submit">Preview my preference ↗</button></form><div class="modal-actions"><button class="text-link" data-poster="announcement">Read the original announcement ↗</button></div>`);
}
function answerExperience(question){
  const q=question.toLowerCase();
  if(/bungee|fitness|exercise/.test(q))return 'The supplied announcement says The MIX in Goshen, Indiana is starting bungee classes. Its morning, afternoon and evening options are a preference poll, not a confirmed schedule. Opening date, prices, address and participation requirements need confirmation. This preview cannot reserve a class.';
  if(/craft|celestial|pumpkin|workshop|creative/.test(q))return 'The shared Celestial Treasure Creations post lists a $17 take-home kit or $20 in-person class, with supplies included. The fabric pumpkin post lists $30 per person. These are promotional-post prices: confirm current dates, location and availability. The pumpkin flyer does not show a year, and this preview cannot book a place.';
  if(/bottle|boutique|cloth|fashion|tank|activewear/.test(q))return 'The supplied The MIX posts show bungee-themed bottles at a posted price of $14.99, plus tanks and activewear without confirmed prices. Explore the collection and open the original artwork. Current prices, sizes and availability need confirmation; these pieces cannot be ordered in this preview.';
  if(/where|address|locat|goshen|elkhart|the mix/.test(q))return 'Natural Therapies lists 1650 W Beardsley Ave, Elkhart, IN 46514 for bodywork and skincare. The MIX bungee announcement names Goshen, Indiana but does not give a street address. These locations are shown separately; ask Jess for the current location of your appointment or event.';
  if(/class/.test(q))return 'You can explore bungee and creative-class promotions from The MIX in the shared posts. They are not a live schedule. Ask about bungee, celestial crafts or pumpkins, and I can explain what the artwork lists.';
  return null;
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.matches('[data-experience]'))selectExperience(button.dataset.experience);
  if(button.matches('[data-poster]'))showPoster(button.dataset.poster);
  if(button.matches('[data-filter]')){
    const category=button.dataset.filter;let count=0;
    $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $$('[data-category]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)count++;});
    $('#shop-count').textContent=`${count} ${count===1?'discovery':'discoveries'}`;
  }
});
$('.experience-tabs').addEventListener('keydown',event=>{
  const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(event.key))return;
  const tabs=$$('[data-experience]');const current=tabs.indexOf(document.activeElement);if(current<0)return;
  event.preventDefault();let next=current;
  if(event.key==='ArrowRight')next=(current+1)%tabs.length;
  if(event.key==='ArrowLeft')next=(current+tabs.length-1)%tabs.length;
  if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
  selectExperience(tabs[next].dataset.experience,true);
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='interest-form')return;event.preventDefault();
  const preference=new FormData(event.target).get('class-time');
  showModal(`<p class="eyebrow">YOUR PREFERENCE PREVIEW</p><h2 class="modal-heading" id="modal-title">A little ${String(preference).toLowerCase()}<br>energy.</h2><p class="modal-copy">Your sample choice: <strong>${escape(preference)}</strong>.</p><p class="modal-note">Nothing has been sent or saved. You have not joined a waitlist or reserved a class. Confirm the launch details directly with Jess.</p><button class="button dark" data-poster="announcement">See the shared announcement ↗</button>`);
});
