// Simplified navigation & lightbox; adds placeholder src for lightbox image to satisfy W3C
let canvas, ctx, width, height, stars=[];
const MAX_STARS=120, STAR_DENSITY=10000, TRANSITION_DURATION=320;
// 1x1 transparent GIF placeholder (valid src to satisfy validator)
const LB_PLACEHOLDER="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function resizeCanvas(){ if(!canvas) return; width=innerWidth; height=innerHeight; canvas.width=width; canvas.height=height; }
function initStars(){ if(!ctx) return; stars=[]; const count=Math.min(MAX_STARS, Math.max(30, Math.floor((width*height)/STAR_DENSITY))); for(let i=0;i<count;i++){ stars.push({x:Math.random()*width,y:Math.random()*height,z:Math.random()*1.6+0.2}); } }
let rafId=null;
function drawStars(){ if(!ctx) return; ctx.clearRect(0,0,width,height); ctx.fillStyle='#ffffff'; for(const s of stars){ ctx.fillRect(s.x|0,s.y|0,Math.max(1,s.z),Math.max(1,s.z)); s.y+=s.z*0.6; if(s.y>height) s.y=0; } rafId=requestAnimationFrame(drawStars); }
function handleVisibilityChange(){ if(document.hidden){ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } } else if(!rafId){ drawStars(); } }
let resizeTimer=null; function onResizeDebounced(){ if(resizeTimer) clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>{ resizeCanvas(); initStars(); },140); }
function isLocalLink(a){ try{ return new URL(a.href, location.href).origin===location.origin; }catch{ return false; } }

function setupPageTransitions(){
  document.addEventListener('click', e=>{
    let a=e.target.closest('a');
    if(!a) return;
    if(!a.classList.contains('project-card')){
      const parentCard=e.target.closest('a.project-card');
      if(parentCard) a=parentCard;
    }
    const href=a.getAttribute('href')||'';
    if(!href || a.target==='_blank' || a.hasAttribute('download') || href.startsWith('#') || href.startsWith('mailto:')) return;
    if(!isLocalLink(a)) return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(()=>{ location.href=href; }, TRANSITION_DURATION);
  }, {capture:true});
  requestAnimationFrame(()=>{
    document.body.classList.add('page-enter-active');
    setTimeout(()=>{ document.body.classList.remove('page-enter'); document.body.classList.remove('page-enter-active'); }, TRANSITION_DURATION+50);
  });
}

function setupLightbox(){
  const lightbox=document.getElementById('lightbox');
  if(!lightbox) return;
  const lbImg=document.getElementById('lbImg');
  const lbCaption=document.getElementById('lbCaption');
  const lbClose=document.getElementById('lbClose');

  // ensure placeholder is present at startup
  if(lbImg && !lbImg.getAttribute('src')) lbImg.setAttribute('src', LB_PLACEHOLDER);

  function open(src, caption){
    lbImg.src = src || LB_PLACEHOLDER;
    lbImg.alt = caption || '';
    lbCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden','false');
  }
  function close(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = LB_PLACEHOLDER;   // restore valid src (not empty)
    lbImg.alt = '';
    lbCaption.textContent = '';
  }

  document.addEventListener('click', e=>{
    const img=e.target.closest('figure img');
    if(!img) return;
    const figure=img.closest('figure');
    if(!(figure && (figure.closest('.project-media') || figure.closest('.sketch-thumbs')))) return;
    e.preventDefault();
    open(img.currentSrc||img.src, img.dataset.caption||img.alt||figure.querySelector('figcaption')?.textContent||'');
  });

  lbClose?.addEventListener('click', close);
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) close(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
}

function loadGitHubRepos(username='saimn2213', max=6){
  const container=document.getElementById('githubRepos'); if(!container) return;
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${max}`)
    .then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(list=>{
      if(!Array.isArray(list)){ container.innerHTML='<p>Unable to load GitHub repositories.</p>'; return; }
      list.forEach(repo=>{
        const d=document.createElement('div');
        d.innerHTML=`<strong>${repo.name}</strong><p>${repo.description||'No description'}</p><a href="${repo.html_url}" target="_blank" rel="noopener">View on GitHub</a>`;
        container.appendChild(d);
      });
    })
    .catch(err=>{
      container.innerHTML='<p>Unable to load GitHub repositories.</p>';
      console.error('GitHub repos error', err);
    });
}

function applyLazyAndAspectRatio(){
  document.querySelectorAll('img').forEach(img=>{
    if(!img.loading) img.loading='lazy';
    if(!img.hasAttribute('width')||!img.hasAttribute('height')){
      const setAspect=()=>{ if(img.naturalWidth&&img.naturalHeight){ img.style.aspectRatio=`${img.naturalWidth}/${img.naturalHeight}`; } };
      if(img.complete) setAspect(); else img.addEventListener('load', setAspect);
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  canvas=document.getElementById('starfield'); ctx=canvas?canvas.getContext('2d'):null;
  resizeCanvas(); initStars(); drawStars();
  window.addEventListener('resize', onResizeDebounced);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  setupPageTransitions();
  setupLightbox();
  loadGitHubRepos();
  applyLazyAndAspectRatio();
});
