// script.js — defensive with page transitions + lightbox + starfield (performance tuned)

let canvas, ctx, width, height, stars = [];
const MAX_STARS = 120;
const STAR_DENSITY = 10000; // larger -> fewer stars
const TRANSITION_DURATION = 320; // ms

function log(...args){ if(window && window.console) console.log('[site]', ...args); }

// --- starfield (performance improvements) ---
function resizeCanvas(){
  if(!canvas) return;
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width; canvas.height = height;
}

function initStars(){
  if(!ctx) return;
  stars = [];
  const count = Math.min(MAX_STARS, Math.max(30, Math.floor((width * height) / STAR_DENSITY)));
  for(let i=0;i<count;i++){
    stars.push({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1.6+0.2 });
  }
  log('initStars:', stars.length);
}

let rafId = null;
function drawStars(){
  if(!ctx) return;
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = '#ffffff';
  for (let i=0;i<stars.length;i++){
    const s = stars[i];
    ctx.fillRect(Math.round(s.x), Math.round(s.y), Math.max(1, s.z), Math.max(1, s.z));
    s.y += s.z*0.6;
    if(s.y>height) s.y = 0;
  }
  rafId = requestAnimationFrame(drawStars);
}

// Pause/resume rendering when page hidden (saves CPU)
function handleVisibilityChange(){
  if(document.hidden){
    if(rafId) { cancelAnimationFrame(rafId); rafId = null; }
  } else {
    if(!rafId) drawStars();
  }
}

// Debounced resize (avoid rapid re-init)
let resizeTimer = null;
function onResizeDebounced(){
  if(resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>{ resizeCanvas(); initStars(); }, 140);
}

// --- page transition helpers (fixed) ---
function isLocalLink(a){
  try{ const url = new URL(a.href, location.href); return url.origin === location.origin; }catch(e){ return false; }
}

function setupPageTransitions(){
  document.addEventListener('click', (ev)=>{
    const a = ev.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(a.target === '_blank' || a.hasAttribute('download') || href.startsWith('mailto:') || href.startsWith('#')) return;
    if(!isLocalLink(a)) return;
    ev.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(()=>{ window.location.href = href; }, TRANSITION_DURATION);
  }, {capture:true, passive:false});

  requestAnimationFrame(()=>{
    document.body.classList.add('page-enter-active');
    setTimeout(()=>{ document.body.classList.remove('page-enter'); document.body.classList.remove('page-enter-active'); }, TRANSITION_DURATION + 50);
  });
}

// --- lightbox (open exactly the clicked image) ---
function setupLightbox(){
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  if(!lightbox) return;

  function open(src, caption){
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden','false');
  }
  function close(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    lbCaption.textContent = '';
  }

  document.addEventListener('click', (ev)=>{
    const img = ev.target.closest('img');
    if(!img) return;
    const figure = ev.target.closest('figure');
    // Only lightbox images inside project/gallery sections
    if(!(figure && (figure.closest('.project-media') || figure.closest('.sketch-gallery') || figure.closest('.sketch-thumbs')))) return;
    ev.preventDefault();
    const src = img.getAttribute('src');
    const caption = img.dataset.caption || img.alt || (figure.querySelector('figcaption')?.textContent || '');
    open(src, caption);
  });

  lbClose?.addEventListener('click', close);
  lightbox.addEventListener('click', (ev)=>{ if(ev.target === lightbox) close(); });
  document.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape') close(); });
}

// --- other helpers ---
function wireResumeButtons(){ try{ const resumeButtons = document.querySelectorAll('[href="resume.pdf"], #resumeButton'); resumeButtons.forEach(b => { b.addEventListener('click', ()=>{}); }); }catch(e){ console.error('wireResumeButtons error', e); }}

function loadGitHubRepos(username='saimn2213', max=6){
  const container = document.getElementById('githubRepos');
  if(!container) return;
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${max}`)
  .then(r=>{ if(!r.ok) throw new Error('GitHub API returned ' + r.status); return r.json(); })
  .then(list=>{
    if(!Array.isArray(list)){ container.innerHTML = '<p>Unable to load GitHub repositories.</p>'; return; }
    list.forEach(repo=>{
      const d = document.createElement('div');
      const name = document.createElement('strong'); name.textContent = repo.name;
      const p = document.createElement('p'); p.textContent = repo.description || 'No description';
      const link = document.createElement('a'); link.href = repo.html_url; link.target = '_blank'; link.rel='noopener'; link.textContent = 'View on GitHub';
      d.appendChild(name); d.appendChild(p); d.appendChild(link);
      container.appendChild(d);
    });
  })
  .catch(err=>{
    container.innerHTML = '<p>Unable to load GitHub repositories.</p>';
    console.error('loadGitHubRepos error', err);
  });
}

// Add lazy + aspect ratio to imgs
function applyLazyAndAspectRatio(){
  try{
    document.querySelectorAll('img').forEach(img => {
      if(!img.loading) img.loading = 'lazy';
      if(!img.hasAttribute('width') || !img.hasAttribute('height')){
        const setAspect = () => {
          if(img.naturalWidth && img.naturalHeight){
            img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
          }
        };
        if(img.complete) setAspect(); else img.addEventListener('load', setAspect);
      }
    });
  }catch(e){ console.error('applyLazyAndAspectRatio', e); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  try{
    canvas = document.getElementById('starfield');
    ctx = canvas ? canvas.getContext('2d') : null;
    resizeCanvas(); initStars(); drawStars();
    window.addEventListener('resize', onResizeDebounced);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    setupPageTransitions();
    setupLightbox();
    wireResumeButtons();
    loadGitHubRepos();
    applyLazyAndAspectRatio();
    log('DOM loaded and initialised');
  }catch(e){ console.error('DOMContentLoaded handler failed', e); }
});
