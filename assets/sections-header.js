"use strict";

if (!customElements.get('s-header')) {
  customElements.define('s-header', class SectionHeader extends HTMLElement {
    constructor() {
      super();
      this.burger = this.querySelector(".header__burger");
      this.burgerMenu = this.querySelector(".header__list");
      this.html = this.querySelector("html");
      this.headerSection = document.querySelector(".section-header");
      this.headerHeight = this.headerSection.clientHeight + "px";
      this.headerSimilar = document.createElement("div");
      this.headerSimilar.style.height = this.headerHeight;
      this.headerSection.after(this.headerSimilar);
      this.headerNavItems = Array.from(this.querySelectorAll(".header__list a"));
      this.searchOpener = this.querySelector(".header__search-btn");
      this.searchCloser = this.querySelector(".header__search-closer");
      this.searchField = this.querySelector(".c-search");
      this.burger.addEventListener("click", ev => {
        this.burger.classList.toggle("header__burger--open");
        if (this.burger.classList.contains("header__burger--open")) {
          this.burgerMenu.classList.add("header__list--active");
          this.html.classList.add("no-scroll");
        } else {
          this.burgerMenu.classList.remove("header__list--active");
          this.html.classList.remove("no-scroll");
        }
      });
      this.headerNavItems.forEach(item => {
        item.addEventListener("click", ev => {
          let popularSection = findHeadingById(item.getAttribute("href").replace("/#", ""));
          if (popularSection) {
            ev.preventDefault();
            ev.stopPropagation();
            const position = popularSection.offsetTop - popularSection.offsetHeight / 8;
            window.scrollTo({
              top: position,
              behavior: 'smooth'
            });
          }
        });
      });
      this.searchOpener.addEventListener("click", () => {
        this.searchField.classList.add("active");
      });
      this.searchCloser.addEventListener("click", () => {
        this.searchField.classList.remove("active");
        this.searchField.querySelector('input[type="search"]').value = "";
        this.searchField.querySelector('#predictive-search').innerHTML = "";
      });
    }
  });
}