// With MacOS press option + shift + k could print char: 
// But the char can't show on windows.
// Just use font-awesome instead.

var btnBuy = document.getElementById('buy');
var btnCheckout = document.getElementById('checkout');
var card = document.querySelector('.giftcard');

function showBack() {
    card.classList.add('show-back');
    card.classList.remove('show-front');
}

function showFront() {
    card.classList.remove('show-back');
    card.classList.add('show-front');
}

function showFX() {
    showBack();
    setTimeout(showFront, 3000);
}

var timer = null;
var setTimer = function() {
    timer = setInterval(showFX, 8000);
};
var clearTimer = function() {
    clearInterval(timer);
    timer = null;
};

btnBuy.addEventListener('click', function() {
    showBack();
});
btnCheckout.addEventListener('click', function() {
    showFront();
});

card.addEventListener('mouseenter', function() {
    clearTimer();
});
card.addEventListener('mouseleave', function() {
    setTimer();
});

setTimeout(showFX, 2000);
setTimer();



