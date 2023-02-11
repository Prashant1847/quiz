const container = document.querySelector('.aboutSite-layer-3');
const controls = document.querySelectorAll('.controls');
const links = document.querySelectorAll('a');

document.querySelector('.play-icon').addEventListener('click', ()=>links[0].click())
document.querySelector('.hammer-icon').addEventListener('click', ()=>links[1].click())

controls[0].addEventListener('click', ()=>{container.style.transform = "translateX(0%)";})
controls[1].addEventListener('click', ()=>{container.style.transform = "translateX(-50%)";})
