"use strict";

let mostContainer = document.querySelector("#mostCollection");
let mostCollections = Array.from(mostContainer.querySelectorAll(".categories__list"));
let mostLink = document.querySelector(".most-category__link");
let mostSelect = mostContainer.querySelector("#most-select");
let sortSelect = mostContainer.querySelector("#sort-select");
let items = Array.from(mostContainer.querySelectorAll(".sort__item"));
let options = Array.from(sortSelect.querySelectorAll("option"));
let handleMost = mostSelect.value;
let handleSort = sortSelect.value;
let categoryTilte = mostSelect.selectedOptions[0].getAttribute("data-value");
mostSelect.addEventListener("change", ev => {
  handleMost = ev.target.value;
  categoryTilte = ev.target.selectedOptions[0].getAttribute("data-value");
  mostCollections.map(item => {
    if (item.hasAttribute("active")) {
      item.removeAttribute("active");
    }
  });
  mostCollections.map(item => {
    if (item.getAttribute("data-value") == handleMost && item.getAttribute("data-sort") == handleSort) {
      item.setAttribute("active", "");
      let filter = "";
      switch (item.dataset.sort) {
        case "recommended":
          filter = "?filter.p.m.appstore.rating=5&&filter.p.m.appstore.rating=4&filter.p.m.appstore.rating=4.2&filter.p.m.appstore.rating=4.5&filter.p.m.appstore.rating=4.8&filter.p.m.appstore.rating=4.9";
          break;
        case "best":
          filter = "?sort_by=price-descending";
          break;
        case "latest":
          filter = "?sort_by=created-descending";
          break;
        case "free":
          filter = "?filter.p.m.appstore.only_free_plan=true";
          break;
      }
      mostLink.href = `/collections/${handleMost}${filter}`;
      mostLink.innerHTML = ` ${item.dataset.linkTitle} <svg aria-hidden="true" focusable="false" role="presentation" width="20" height="20" viewBox="0 0 20 20" fill="none" class="icon icon-arrow">
            <path d="M12.2559 4.41083L16.9699 9.12486C17.2954 9.45028 17.2954 9.97795 16.9699 10.3034L12.2559 15.0174C11.9305 15.3429 11.4028 15.3429 11.0774 15.0174C10.7519 14.692 10.7519 14.1644 11.0774 13.8389L14.3688 10.5474H3.33333C2.8731 10.5474 2.5 10.1744 2.5 9.71411C2.5 9.25386 2.8731 8.88078 3.33333 8.88078H14.3688L11.0774 5.58934C10.7519 5.2639 10.7519 4.73626 11.0774 4.41083C11.4028 4.08539 11.9305 4.08539 12.2559 4.41083Z" fill="currentColor"></path>
            </svg>
            `;
    }
  });
  mostSelect.blur();
});
sortSelect.addEventListener("change", ev => {
  let items = Array.from(document.querySelectorAll(".sort__item"));
  items.map(item => item.hasAttribute("data-active") ? item.removeAttribute("data-active") : null);
  items.map(item => item.getAttribute("data-value") == ev.target.value ? item.setAttribute("data-active", "") : null);
  handleSort = ev.target.value;
  mostCollections.map(item => item.hasAttribute("active") ? item.removeAttribute("active") : null);
  mostCollections.map(item => {
    if (item.getAttribute("data-value") == handleMost && item.getAttribute("data-sort") == handleSort) {
      item.setAttribute("active", "");
      let filter = "";
      switch (item.dataset.sort) {
        case "recommended":
          filter = "?filter.p.m.appstore.rating=5&&filter.p.m.appstore.rating=4&filter.p.m.appstore.rating=4.2&filter.p.m.appstore.rating=4.5&filter.p.m.appstore.rating=4.8&filter.p.m.appstore.rating=4.9";
          break;
        case "best":
          filter = "?sort_by=price-descending";
          break;
        case "latest":
          filter = "?sort_by=created-descending";
          break;
        case "free":
          filter = "?filter.p.m.appstore.only_free_plan=true";
          break;
      }
      mostLink.href = `/collections/${handleMost}${filter}`;
      mostLink.innerHTML = ` ${item.dataset.linkTitle} <svg aria-hidden="true" focusable="false" role="presentation" width="20" height="20" viewBox="0 0 20 20" fill="none" class="icon icon-arrow">
            <path d="M12.2559 4.41083L16.9699 9.12486C17.2954 9.45028 17.2954 9.97795 16.9699 10.3034L12.2559 15.0174C11.9305 15.3429 11.4028 15.3429 11.0774 15.0174C10.7519 14.692 10.7519 14.1644 11.0774 13.8389L14.3688 10.5474H3.33333C2.8731 10.5474 2.5 10.1744 2.5 9.71411C2.5 9.25386 2.8731 8.88078 3.33333 8.88078H14.3688L11.0774 5.58934C10.7519 5.2639 10.7519 4.73626 11.0774 4.41083C11.4028 4.08539 11.9305 4.08539 12.2559 4.41083Z" fill="currentColor"></path>
            </svg>
            `;
    }
  });
  sortSelect.blur();
});
function changeMostCollection(el) {
  items.map(item => item.hasAttribute("data-active") ? item.removeAttribute("data-active") : null);
  items.map(item => item.getAttribute("data-value") == el.getAttribute("data-value") ? item.setAttribute("data-active", "") : null);
  options.map(item => item.hasAttribute("selected") ? item.removeAttribute("selected") : null);
  options.map(item => item.getAttribute("value") == el.getAttribute("data-value") ? item.setAttribute("selected", "") : null);
  handleSort = el.getAttribute("data-value");
  mostCollections.map(item => item.hasAttribute("active") ? item.removeAttribute("active") : null);
  mostCollections.map(item => {
    if (item.getAttribute("data-value") == handleMost && item.getAttribute("data-sort") == handleSort) {
      item.setAttribute("active", "");
      let filter = "";
      switch (item.dataset.sort) {
        case "recommended":
          filter = "?filter.p.m.appstore.rating=5&&filter.p.m.appstore.rating=4&filter.p.m.appstore.rating=4.2&filter.p.m.appstore.rating=4.5&filter.p.m.appstore.rating=4.8&filter.p.m.appstore.rating=4.9";
          break;
        case "best":
          filter = "?sort_by=price-descending";
          break;
        case "latest":
          filter = "?sort_by=created-descending";
          break;
        case "free":
          filter = "?filter.p.m.appstore.only_free_plan=true";
          break;
      }
      mostLink.href = `/collections/${handleMost}${filter}`;
      mostLink.innerHTML = ` ${item.dataset.linkTitle} <svg aria-hidden="true" focusable="false" role="presentation" width="20" height="20" viewBox="0 0 20 20" fill="none" class="icon icon-arrow">
            <path d="M12.2559 4.41083L16.9699 9.12486C17.2954 9.45028 17.2954 9.97795 16.9699 10.3034L12.2559 15.0174C11.9305 15.3429 11.4028 15.3429 11.0774 15.0174C10.7519 14.692 10.7519 14.1644 11.0774 13.8389L14.3688 10.5474H3.33333C2.8731 10.5474 2.5 10.1744 2.5 9.71411C2.5 9.25386 2.8731 8.88078 3.33333 8.88078H14.3688L11.0774 5.58934C10.7519 5.2639 10.7519 4.73626 11.0774 4.41083C11.4028 4.08539 11.9305 4.08539 12.2559 4.41083Z" fill="currentColor"></path>
            </svg>
            `;
    }
  });
}
if (window.location.hash == "#popularCategories") {
  let popularSection = findHeadingById(window.location.hash.replace("#", ""));
  if (popularSection) {
    const position = popularSection.offsetTop - popularSection.offsetHeight / 6;
    setTimeout(() => {
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }, 0);
  }
}