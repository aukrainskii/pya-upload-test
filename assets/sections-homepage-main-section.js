"use strict";

let collectionSearchWrapper = document.querySelector(".js-search-content__collection-outer");
let dynemicWrapper = document.querySelector(".js-search-content__dynemic-collection");
let titles = dynemicWrapper.getAttribute("data-titles").split("&-&");
let collectionSearchInput = collectionSearchWrapper.querySelector(".search-content__collection-search .c-search__input");
let collectionSearchResults = collectionSearchWrapper.querySelector("#predictive-search");
var typed = new Typed('.js-search-content__dynemic-collection', {
  strings: titles,
  typeSpeed: 150,
  loop: true
});
document.addEventListener("click", ev => {
  if (ev.target.closest(".js-search-content__collection-outer")) {
    collectionSearchWrapper.classList.add("js-open");
    collectionSearchInput.focus();
  } else {
    collectionSearchWrapper.classList.remove("js-open");
    collectionSearchInput.value = "";
    collectionSearchResults.style.display = 'none';
  }
});