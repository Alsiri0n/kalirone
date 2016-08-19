(function ($) {
  "use strict";
    lightbox.option({
      'resizeDuration': 10,
      'fadeDuration': 200,
      'wrapAround': true
    })
} (jQuery));

var cache = {};
function loadPage(url) {
  if (cache[url]) {
    return new Promise(function(resolve) {
      resolve(cache[url]);
    });
  }

  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    cache[url] = response.text();
    return cache[url];
  });
}

var main = document.querySelector('main');

function changePage() {
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    var wrapper = document.createElement('section');
        wrapper.innerHTML = responseText;

    var oldContent = document.querySelector('.info');
    var newContent = wrapper.querySelector('.info');

    main.appendChild(newContent);
    animate(oldContent, newContent);
  });
}

function animate(oldContent, newContent) {
  oldContent.style.position = 'absolute';

  var fadeOut = oldContent.animate({
    transform: 'translateX(100px)'}, 1000);
  //   opacity: [1, 0]
  // }, 1000);

  var fadeIn = newContent.animate({
  //   opacity: [0, 1]
  // }, 1000);
  transform: 'translateX(100px)'}, 1000);

  fadeIn.onfinish = function() {
    oldContent.parentNode.removeChild(oldContent);
  };
}

window.addEventListener('popstate', changePage);

document.addEventListener('click', function(e) {
  var el = e.target;

  while (el && !el.href) {
    el = el.parentNode;
  }

  if (el) {
    e.preventDefault();
    history.pushState(null, null, el.href);
    changePage();

    return;
  }
});