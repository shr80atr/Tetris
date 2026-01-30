const input1 = document.querySelector('.input1');
const button = document.querySelector('.button');
const input2 = document.querySelector('.input2');

const body = document.querySelector('body');

if (localStorage.getItem('backgroundColor')) {
    body.style.backgroundColor = localStorage.getItem('backgroundColor');

    if (localStorage.getItem('backgroundColor') === 'rgb(140, 220, 254)') {
        input2.style.backgroundColor = '#FFF2CC';
    }

    else {
        input2.style.backgroundColor = '#8CDCFE';
    }
}

var score = 5;

if (localStorage.getItem('score')) {
    input1.value = localStorage.getItem('score');
    score = localStorage.getItem('score');
}

button.addEventListener('click', () => {
    localStorage.setItem('backgroundColor', window.getComputedStyle(input2).backgroundColor);
    body.style.backgroundColor = localStorage.getItem('backgroundColor');

    if (localStorage.getItem('backgroundColor') === 'rgb(140, 220, 254)') {
        input2.style.backgroundColor = '#FFF2CC';
    }

    else {
        input2.style.backgroundColor = '#8CDCFE';
    }
});

button.addEventListener('mouseenter', () => {
    button.style.opacity = '0.5';
});

button.addEventListener('mouseleave', () => {
    button.style.opacity = '1';
})