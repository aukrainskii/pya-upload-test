"use strict";

let popularContainer = document.querySelector("#popularCollections");
let popularCollections = Array.from(popularContainer.querySelectorAll(".categories__list"));
let popularLink = document.querySelector(".popular-category__link");
let popularItems = Array.from(popularContainer.querySelectorAll(".changer__item"));
let popularSelect = popularContainer.querySelector("#popular-select");
let popularOptions = Array.from(popularSelect.querySelectorAll("option"));
popularSelect.addEventListener("change", el => {
  changePopularCollection(el);
  popularSelect.blur();
});
function changePopularCollection(el) {
  let handle, title;
  if (el.tagName == "LI") {
    handle = el.getAttribute("data-category");
    title = el.getAttribute("data-value");
  } else {
    handle = el.target.value;
    let variants = Array.from(el.target.querySelectorAll("option"));
    variants.map(item => item.getAttribute("value") == handle ? title = item.getAttribute("data-value") : null);
  }
  popularItems.map(item => item.hasAttribute("data-active") ? item.removeAttribute("data-active") : null);
  popularItems.map(item => item.getAttribute("data-category") == handle ? item.setAttribute("data-active", "") : null);
  popularOptions.map(item => item.hasAttribute("selected") ? item.removeAttribute("selected") : null);
  popularOptions.map(item => item.getAttribute("value") == handle ? item.setAttribute("selected", "") : null);
  popularCollections.map(item => item.hasAttribute("active") ? item.removeAttribute("active") : null);
  popularCollections.map(item => item.getAttribute("data-value") == handle ? item.setAttribute("active", "") : null);
  popularLink.href = `/collections/${handle}?sort_by=price-descending`;
  popularLink.innerHTML = ` ${linkName1} ${title} ${linkName2} <svg aria-hidden="true" focusable="false" role="presentation" width="20" height="20" viewBox="0 0 20 20" fill="none" class="icon icon-arrow">
    <path d="M12.2559 4.41083L16.9699 9.12486C17.2954 9.45028 17.2954 9.97795 16.9699 10.3034L12.2559 15.0174C11.9305 15.3429 11.4028 15.3429 11.0774 15.0174C10.7519 14.692 10.7519 14.1644 11.0774 13.8389L14.3688 10.5474H3.33333C2.8731 10.5474 2.5 10.1744 2.5 9.71411C2.5 9.25386 2.8731 8.88078 3.33333 8.88078H14.3688L11.0774 5.58934C10.7519 5.2639 10.7519 4.73626 11.0774 4.41083C11.4028 4.08539 11.9305 4.08539 12.2559 4.41083Z" fill="currentColor"></path>
    </svg>
    `;
}