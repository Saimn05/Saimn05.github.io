// script.js — shared by all pages
// Defensive and verbose logging to help track any runtime errors

let canvas, ctx, width, height, stars = [];

function log(...args){ if(window && window.console) console.log('[site]', ...args); }

// Safe resize
function resizeCanvas(){
  if(!canvas) { log('resizeCanvas: canvas not found'); return; }
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width; canvas.height = height;
  log('canvas resized', width, height);
}

function initStars(){
  if(!ctx) { log('initStars: ctx is null'); return; }
  stars = [];
  const count = Math.max(30, Math.floor((width * height) / 5000));
  for(let i=0;i<count;i++){
    stars.push({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1.6+0.2 });
  }
  log('initStars: count=', stars.length);
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

// Resume download button (if present)
function wireResumeButtons(){
  try{
    const resumeButtons = document.querySelectorAll('[href="resume.pdf"], #resumeButton');
    resumeButtons.forEach(b => {
      b.addEventListener('click', (e)=>{
        // allow default download; could add analytics here
      });
    });
  }catch(e){ console.error('wireResumeButtons error', e); }
}

// Auto-fetch GitHub repos (only on pages that have #githubRepos)
function loadGitHubRepos(username='saimn2213', max=6){
  const container = document.getElementById('githubRepos');
  if(!container){ log('loadGitHubRepos: #githubRepos not found'); return; }

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

    wireResumeButtons();
    loadGitHubRepos();
    log('DOM loaded and initialised');
  }catch(e){
    console.error('DOMContentLoaded handler failed', e);
  }
});
