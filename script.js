
console.log('Loading code into memory........');
console.log('Interrogating public IP.........');
console.log('Interrogating local IP.........');

console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');
console.log('HACKED');
console.log('      ');

console.log(' You found Easter Egg #1 ');





$(function() {
    $(window).on('resize', function resize()  {
        $(window).off('resize', resize);
        setTimeout(function () {
            var content = $('#content');
            var top = (window.innerHeight - content.height()) / 2;
            content.css('top', Math.max(0, top) + 'px');
            $(window).on('resize', resize);
        }, 50);
    }).resize();
});
$(document).bind("contextmenu",function(e) {
    e.preventDefault();
});
$(document).keydown(function(e){
    if(e.which === 123){
        return false;
    }
});
// secret files haha owo somewhere idk help 
