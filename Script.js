// script.js — defensive with page transitions + lightbox + starfield

let canvas, ctx, width, height, stars = [];

function log(...args){ if(window && window.console) console.log('[site]', ...args); }

// --- starfield (same as before) ---
function resizeCanvas(){
  if(!canvas) return;
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width; canvas.height = height;
}
function initStars(){
  if(!ctx) return;
  stars = [];
  const count = Math.max(30, Math.floor((width * height) / 5000));
  for(let i=0;i<count;i++){
    stars.push({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1.6+0.2 });
  }
}
function drawStars(){
  if(!ctx) return;
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(s =>{
    ctx.fillRect(Math.round(s.x), Math.round(s.y), Math.max(1, s.z), Math.max(1, s.z));
    s.y += s.z*0.6;
    if(s.y>height) s.y = 0;
  });
  requestAnimationFrame(drawStars);
}

// --- page transition helpers ---
const TRANSITION_DURATION = 320; //ms

function isLocalLink(a){
  try{
    const url = new URL(a.href, location.href);
    return url.origin === location.origin;
  }catch(e){ return false; }
}

function setupPageTransitions(){
  // intercept clicks on internal links and animate exit, then navigate
  document.addEventListener('click', (ev)=>{
    const a = ev.target.closest('a');
    if(!a) return;
    // don't intercept links that open new tab or are anchors or mailto/tel
    if(a.target === '_blank' || a.hasAttribute('download') || a.href.startsWith('mailto:') || a.getAttribute('href')?.startsWith('#')) return;
    if(!isLocalLink(a)) return;
    // prevent default and animate
    ev.preventDefault();
    const href = a.getAttribute('href');
    document.body.classList.add('page-exit');
    // small delay to let CSS animate
    setTimeout(()=>{ window.location.href = href; }, TRANSITION_DURATION);
  }, {capture:true});
  // on load, trigger enter animation
  requestAnimationFrame(()=>{
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    setTimeout(()=>{ document.body.classList.remove('page-enter-active'); }, TRANSITION_DURATION+50);
  });
}

// --- lightbox for images ---
function setupLightbox(){
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');

  if(!lightbox) return;

  function open(src, caption){
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function close(){
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
  }

  document.addEventListener('click', (ev)=>{
    const fig = ev.target.closest('figure');
    if(!fig) return;
    const img = fig.querySelector('img');
    if(img && img.src){
      // only open if the figure is inside .project-media or sketch-gallery
      if(fig.closest('.project-media') || fig.closest('.sketch-gallery') || fig.closest('.sketch-thumbs')){
        ev.preventDefault();
        const caption = fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : img.alt || '';
        open(img.src, caption);
      }
    }
  });

  lbClose?.addEventListener('click', close);
  lightbox.addEventListener('click', (ev)=>{ if(ev.target === lightbox) close(); });
  document.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape') close(); });
}

// --- other helpers (github repos, resume buttons) ---
function wireResumeButtons(){
  try{
    const resumeButtons = document.querySelectorAll('[href="resume.pdf"], #resumeButton');
    resumeButtons.forEach(b => {
      b.addEventListener('click', ()=>{ /* analytics hook */ });
    });
  }catch(e){ console.error('wireResumeButtons error', e); }
}

function loadGitHubRepos(username='saimn2213', max=6){
  const container = document.getElementById('githubRepos');
  if(!container) return;
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${max}`)
  .then(r=>{
    if(!r.ok) throw new Error('GitHub API returned ' + r.status);
    return r.json();
  })
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

document.addEventListener('DOMContentLoaded', ()=>{
  try{
    // Initialize canvas and starfield after DOM exists
    canvas = document.getElementById('starfield');
    ctx = canvas ? canvas.getContext('2d') : null;
    resizeCanvas();
    initStars();
    drawStars();
    window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

    setupPageTransitions();
    setupLightbox();
    wireResumeButtons();
    loadGitHubRepos();
    log('DOM loaded and initialised');
  }catch(e){
    console.error('DOMContentLoaded handler failed', e);
  }
});
