var w_inner_height = window.innerHeight;
var w_inner_width = window.innerWidth;

function isElementInViewport(el) {
    // Detect if element is in viewport
    var rect = el.getBoundingClientRect();
    return (
    rect.top > 0 && rect.left > 0 && rect.bottom <= w_inner_height && rect.right <= w_inner_width);
}

function enableLazy(element) {
    var source = element.src;
    var classes = element.className.length ? element.className + ' ' : '';
    if (classes.indexOf('skip_lazy') === -1) {
        element.className = classes + 'lazy';
        element.setAttribute('data-src', source);
        element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
        return false;
    }
    return true;
}

window.lazyElements = [];
var imgs = document.querySelectorAll('img');
Array.prototype.forEach.call(imgs, function(el) {
    if (isElementInViewport(el) === false) {
        if (enableLazy(el)) {
            window.lazyElements.push(el);
        }
    }
});
