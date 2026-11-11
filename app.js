(() => {
  const cfg = window.KIN4_CONFIG, translations = window.KIN4_TRANSLATIONS;
  let lang = localStorage.getItem('kin4-language') || 'en';
  if (!translations[lang]) lang = 'en';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function setLanguage(next) {
    lang = next; localStorage.setItem('kin4-language', lang); document.documentElement.lang = lang;
    const t = translations[lang];
    $$('[data-i]').forEach(el => { const value=t[el.dataset.i]; if(value) el.innerHTML=value; });
    const nextLanguage={en:'FR',fr:'عربي',ar:'EN'}[lang];
    $('.lang').innerHTML = `${nextLanguage} <span>↗</span>`;
    $('.lang').setAttribute('aria-label', ({en:'Passer en français',fr:'التبديل إلى العربية',ar:'Switch to English'})[lang]);
    toggle.setAttribute('aria-label',t.menuToggle);
    $('.nav').setAttribute('aria-label',t.navAria);
    $$('.meadow-column').forEach((el,i)=>el.setAttribute('aria-label',[t.footerExploreAria,t.footerWorkAria,t.footerContactAria][i]));
    document.title = ({en:'KIN4® — Independent Web Design & Development',fr:'KIN4® — Design et développement web indépendant',ar:'KIN4® — تصميم وتطوير المواقع'})[lang];
    document.documentElement.dir = lang==='ar'?'rtl':'ltr';
    document.querySelector('meta[name="description"]').content = lang === 'en'
      ? 'KIN4 is the independent web design and development studio of Youssef El Heddari. Modern websites and digital experiences for ambitious businesses.'
      : lang==='fr' ? 'KIN4 est le studio indépendant de design et développement web de Youssef El Heddari. Des sites modernes pour les entreprises ambitieuses.'
      : 'كين4 استوديو يوسف الهداري المستقل لتصميم وتطوير المواقع. مواقع عصرية وتجارب رقمية للشركات الطموحة.';
    document.querySelector('meta[property="og:title"]').content=document.title;
    document.querySelector('meta[property="og:description"]').content=document.querySelector('meta[name="description"]').content;
    renderProjects(); renderServices(); renderProcess(); renderSkills();
  }
  function renderProjects() {
    const t=translations[lang];
    $('#project-grid').innerHTML = window.KIN4_PROJECTS.map((p,i)=>{
      const initials=p.name.split(/\s+/).filter(Boolean).map(s=>s[0]).join('').slice(0,2).toUpperCase(),category=lang==='ar'?(p.categoryAr||t.projectCategory[i]||p.category):lang==='fr'?p.categoryFr:p.category,description=lang==='ar'?(p.descriptionAr||t.projectDescriptions[i]||p.description):lang==='fr'?p.descriptionFr:p.description;
      return `<article class="project-card ${i===0?'project-featured':''} ${p.published?'':'project-unpublished'}" data-theme="${esc(p.previewTheme||'digital')}"><div class="project-image project-scene" tabindex="0" aria-label="${esc(t.projectPreview)}: ${esc(p.name)}"><span class="project-number">0${i+1}</span>${p.published?'':'<span class="soon-tag">'+t.projectSoon+'</span>'}<div class="scene-shadow"></div><div class="scene-device"><div class="screen-top"><span>● ● ●</span><span>${esc(p.name)}</span><span>☰</span></div><div class="screen-page ${p.published?'':'screen-coming'}"><small>${esc(category)}</small><strong>${p.published?esc(p.name):'KIN4'}</strong><span>${p.published?t.projectLive:t.projectSoon}</span><div class="screen-cta">{ ${p.published?t.projectVisit:t.projectSoon} ↗ }</div><div class="screen-circles"><i></i><i></i><i></i></div></div></div><div class="scene-phone"><div class="phone-notch"></div><div class="phone-display"><b>${esc(initials)}</b><span>✦ ✦ ✦</span><i></i><i></i><i></i></div></div><div class="scene-chip">${p.published?t.projectLive:t.projectSoon}</div></div><div class="project-meta"><span>${esc(category)}</span><span>${String(i+1).padStart(2,'0')}</span></div><h3>${esc(p.name)}</h3><p>${esc(description)}</p><div class="project-bottom"><div class="project-tech"><small>${t.projectTech}</small>${(p.technologies||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>${p.published?`<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${t.projectVisit} <b>↗</b></a>`:''}</div></article>`;
    }).join('');
  }
  function renderServices(){ const t=translations[lang]; $('#service-list').innerHTML=t.services.map((s,i)=>`<article class="service-row"><span class="service-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(s)}</h3><p>${esc(t.serviceDesc[i])}</p></div><span class="service-arrow">↗</span></article>`).join(''); }
  function renderProcess(){ const t=translations[lang]; $('#process-list').innerHTML=t.process.map((s,i)=>`<article class="process-item"><span class="process-number">0${i+1}</span><h3>${esc(s)}</h3><p>${esc(t.processDesc[i])}</p></article>`).join(''); }
  function renderSkills(){ const skills=translations[lang].technologies; $('#skill-list').innerHTML=skills.map(s=>`<span>${esc(s)}</span>`).join(''); }
  function enableProjectTilt(){
    const grid=$('#project-grid');
    if(grid.dataset.tiltReady) return;
    grid.dataset.tiltReady='true';
    grid.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const scene=e.target.closest('.project-scene');if(!scene||!grid.contains(scene))return;
      const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      scene.style.setProperty('--tilt-x',`${-y*3}deg`);scene.style.setProperty('--tilt-y',`${x*4}deg`);
    });
    grid.addEventListener('pointerout',e=>{const scene=e.target.closest('.project-scene');if(scene&&!scene.contains(e.relatedTarget)){scene.style.removeProperty('--tilt-x');scene.style.removeProperty('--tilt-y')}});
  }
  $('.lang').addEventListener('click',()=>setLanguage(({en:'fr',fr:'ar',ar:'en'})[lang]));
  const toggle=$('.menu-toggle'), nav=$('.nav'); toggle.addEventListener('click',()=>{ const open=toggle.getAttribute('aria-expanded')!=='true'; toggle.setAttribute('aria-expanded',open); nav.classList.toggle('is-open',open); document.body.classList.toggle('menu-open',open); });
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));
  const phone=cfg.whatsapp.replace(/\D/g,'');
  const primaryWa=$('#whatsapp-link'), contactActions=document.createElement('div');
  contactActions.className='contact-actions'; primaryWa.parentNode.insertBefore(contactActions,primaryWa); contactActions.append(primaryWa);
  const secondaryWa=document.createElement('a'); secondaryWa.id='whatsapp-link-secondary'; secondaryWa.className='button button-light whatsapp'; secondaryWa.target='_blank'; secondaryWa.rel='noopener noreferrer'; contactActions.append(secondaryWa);
  function updateWhatsAppLinks(){
    const msg=({en:'Hi Youssef, I would like to discuss a project.',fr:'Bonjour Youssef, j’aimerais discuter d’un projet.',ar:'السلام عليكم يوسف، بغيت نهضر معاك على مشروع.'})[lang];
    $('#whatsapp-link').href=`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const secondDigits=(cfg.whatsappSecondary||'').replace(/\D/g,'');
    secondaryWa.href=`https://wa.me/${secondDigits}?text=${encodeURIComponent(msg)}`;
    secondaryWa.innerHTML=`<span>${translations[lang].whatsappSecondary}</span><b>↗</b>`;
    if(cfg.email)$('#email-link').textContent=translations[lang].email+' ↗';
  }
  updateWhatsAppLinks(); $('.lang').addEventListener('click',updateWhatsAppLinks);
  if(cfg.email){const a=$('#email-link');a.href=`mailto:${cfg.email}`;a.textContent=translations[lang].email+' ↗';} else $('#email-link').hidden=true;
  if(cfg.instagram){const a=$('#instagram-link');a.href=cfg.instagram;a.target='_blank';a.rel='noopener noreferrer';const handle=cfg.instagram.replace(/\/+$/,'').split('/').pop();a.textContent=`INSTAGRAM @${handle} ↗`;a.hidden=false;}
  if(cfg.instagram){const instagramLink=$('#instagram-link');instagramLink.classList.add('insta-contact');contactActions.append(instagramLink);}
  $('#year').textContent=new Date().getFullYear();
  const meadowVideo=$('.meadow-video'); if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){meadowVideo.autoplay=false;meadowVideo.pause();}
  const starCanvas=$('.star-canvas'), starCtx=starCanvas.getContext('2d');
  function paintStars(){const rect=starCanvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);starCanvas.width=rect.width*dpr;starCanvas.height=rect.height*dpr;starCtx.setTransform(dpr,0,0,dpr,0,0);starCtx.clearRect(0,0,rect.width,rect.height);let seed=240701;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<150;i++){const x=rand()*rect.width,y=rand()*rect.height*.65,r=rand()*1.15+.25,a=rand()*.55+.2;starCtx.beginPath();starCtx.arc(x,y,r,0,Math.PI*2);starCtx.fillStyle=`rgba(224,220,255,${a})`;starCtx.fill();}}
  paintStars();window.addEventListener('resize',paintStars,{passive:true});
  const planetVideo=$('.planet-video');planetVideo.addEventListener('loadeddata',()=>planetVideo.dataset.ready='true',{once:true});if(planetVideo.readyState>=2)planetVideo.dataset.ready='true';if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){planetVideo.pause();planetVideo.removeAttribute('autoplay');}
  const schema={'@context':'https://schema.org','@type':'Person',name:cfg.owner,jobTitle:'Freelance Web Developer & Website Designer',knowsAbout:['Web development','Website design','Responsive web design','SEO optimization'],sameAs:cfg.instagram?[cfg.instagram]:[]};
  if(cfg.canonicalUrl){schema.url=cfg.canonicalUrl;const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=cfg.canonicalUrl;document.head.append(canonical);const og=document.createElement('meta');og.setAttribute('property','og:url');og.content=cfg.canonicalUrl;document.head.append(og);}
  document.querySelector('#schema').textContent=JSON.stringify(schema);
  const sections=$$('main section[id],footer[id]'), links=$$('.nav a[href^="#"]');
  if('IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));entry.target.classList.add('seen')}}),{rootMargin:'-25% 0px -58% 0px'});sections.forEach(s=>observer.observe(s));}
  enableProjectTilt(); setLanguage(lang);
})();
