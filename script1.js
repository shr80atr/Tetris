const button1 = document.querySelector('.button1-3');
const button3 = document.querySelector('.button3');

const body = document.querySelector('body');

if (localStorage.getItem('backgroundColor')) {
    body.style.backgroundColor = localStorage.getItem('backgroundColor');
}

button1.addEventListener('mouseenter', () => {
    button1.style.opacity = '0.5';
});

button1.addEventListener('mouseleave', () => {
    button1.style.opacity = '1';
});

button3.addEventListener('mouseenter', () => {
    button3.style.opacity = '0.5';
});

button3.addEventListener('mouseleave', () => {
    button3.style.opacity = '1';
});
