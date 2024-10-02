"use strict";

const navLinks = document.querySelectorAll('.article-navigation__item');
navLinks.forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const heading = findHeadingById(id);
    if (heading) {
      const position = heading.offsetTop - (window.innerHeight - heading.offsetHeight) / 2;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  });
});