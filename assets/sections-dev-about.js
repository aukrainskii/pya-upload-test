"use strict";

const linkToAbout = document.querySelector('#link_to_about');
linkToAbout.addEventListener('click', event => {
  event.preventDefault();
  const id = linkToAbout.getAttribute('href').slice(1);
  const heading = findHeadingById(id);
  if (heading) {
    const position = heading.offsetTop - (window.innerHeight - heading.offsetHeight) / 2;
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }
});