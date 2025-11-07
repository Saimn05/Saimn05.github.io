// Resume download button
const resumeButton = document.getElementById("resumeButton");
resumeButton.addEventListener("click", () => {
window.location.href = "resume.pdf";
});
// ⭐ Starfield animation
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stars = [];
function initStars() {
for (let i = 0; i < 200; i++) {
stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 });
}
}
function animateStars() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
stars.forEach((star) => {
ctx.fillStyle = "white";
ctx.fillRect(star.x, star.y, star.size, star.size);
star.y += star.size;
if (star.y > canvas.height) star.y = 0;
});
requestAnimationFrame(animateStars);
}
initStars();
animateStars();
