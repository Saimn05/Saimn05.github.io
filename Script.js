// script.js — shared by all pages


// Resize-aware starfield canvas
const canvas = document.getElementById('starfield');
const ctx = canvas ? canvas.getContext('2d') : null;
let width = window.innerWidth;
let height = window.innerHeight;
let stars = [];


function resizeCanvas(){
if(!canvas) return;
width = window.innerWidth; height = window.innerHeight;
canvas.width = width; canvas.height = height;
}


window.addEventListener('resize', () => { resizeCanvas(); initStars(); });


function initStars(){
if(!ctx) return;
stars = [];
const count = Math.floor((width * height) / 5000);
for(let i=0;i<count;i++){
stars.push({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1.6+0.2 });
}
}


function drawStars(){
if(!ctx) return;
ctx.clearRect(0,0,width,height);
ctx.fillStyle = '#ffffff';
stars.forEach(s =>{
ctx.fillRect(s.x,s.y,s.z,s.z);
s.y += s.z*0.6;
if(s.y>height) s.y = 0;
});
requestAnimationFrame(drawStars);
}


// Start starfield
resizeCanvas(); initStars(); drawStars();


// Resume download button (if present)
const resumeButtons = document.querySelectorAll('[href="resume.pdf"], #resumeButton');
resumeButtons.forEach(b => {
b.addEventListener('click', (e)=>{
// allow default download
});
});


// Auto-fetch GitHub repos (only on pages that have #githubRepos)
function loadGitHubRepos(username='saimn2213', max=6){
const container = document.getElementById('githubRepos');
if(!container) return;
fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${max}`)
.then(r=>r.json())
.then(list=>{
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
console.error(err);
});
}


// Run loader on pages
document.addEventListener('DOMContentLoaded', ()=>{
loadGitHubRepos();
});
