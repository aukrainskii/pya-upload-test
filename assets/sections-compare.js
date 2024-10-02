"use strict";

let compare_nav_list = document.querySelectorAll("[nav-item]");
let compare_nav_select = document.querySelector(".compare-nav__select > select");
let body = document.querySelector("body");
let modalCompare = document.querySelector(".compare-modal");
compare_nav_list.forEach(item => {
  item.addEventListener('click', ev => linkToSection(ev));
});
compare_nav_select.addEventListener('change', ev => linkToSection(ev));
function linkToSection(event) {
  let id;
  if (event.type == "click") {
    id = event.target.getAttribute("nav-item");
  } else if (event.type == "change") {
    id = event.target.value;
  }
  const heading = findHeadingById(id);
  if (heading) {
    const position = heading.offsetTop - (window.innerHeight - heading.offsetHeight) / 2;
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }
}
let screenSliders = Array.from(document.querySelectorAll(".screenshots-slider"));
let viewScreens = Array.from(document.querySelectorAll(".media-content__img"));
viewScreens.forEach(view => {
  view.addEventListener("click", () => {
    let dataSlider = view.getAttribute("data-slider");
    body.classList.add("open");
    screenSliders.map(x => {
      if (x.getAttribute("data-slider") == dataSlider) {
        x.classList.add("active");
        let slider_x = new Glide(x).mount();
        document.querySelector(".backdrop").addEventListener("click", ev => {
          ev.preventDefault();
          ev.stopPropagation();
          x.classList.remove("active");
        });
      }
    });
  });
});
let overviewSection = document.querySelector(".section-compare--overview");
let navigationSection = document.querySelector(".compare-nav");
let overviewEmitation = document.createElement("div");
let navigationEmitation = document.createElement("div");
overviewEmitation.classList.add("section-emit");
navigationEmitation.classList.add("section-emit");
let overviewSectionHeight = overviewSection.offsetHeight;
let navigationSectionHeight = navigationSection.offsetHeight;
overviewSection.after(overviewEmitation);
navigationSection.after(navigationEmitation);
let stickyHight = overviewSection.offsetHeight + overviewSection.offsetTop - 100;
window.addEventListener('scroll', ev => {
  if (window.scrollY > stickyHight) {
    overviewEmitation.style.height = overviewSectionHeight + "px";
    navigationEmitation.style.height = overviewSectionHeight + "px";
    overviewSection.classList.add("sticky");
    navigationSection.classList.add("sticky");
  } else {
    overviewEmitation.style.height = 0 + "px";
    navigationEmitation.style.height = 0 + "px";
    overviewSection.classList.remove("sticky");
    navigationSection.classList.remove("sticky");
  }
});
function compareModal() {
  let open = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (open) {
    body.classList.add("open");
    modalCompare.classList.add("active");
    document.querySelector(".backdrop").addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      modalCompare.classList.remove("active");
    });
  } else {
    body.classList.remove("open");
    modalCompare.classList.remove("active");
    document.querySelector(".backdrop").removeEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      modalCompare.classList.remove("active");
    });
  }
}
document.querySelector(".backdrop").addEventListener("click", ev => {
  ev.preventDefault();
  ev.stopPropagation();
  body.classList.remove("open");
});
function linkToCompare(handle) {
  let add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let currentPath = location.pathname;
  let newPath;
  if (add) {
    newPath = currentPath + "-vs-" + handle;
  } else {
    newPath = currentPath.replace("-vs-" + handle, "").replace(handle + "-vs-", "").replace(handle, "");
  }
  document.location.href = newPath;
}
class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('#predictive-search');
    this.input.addEventListener('input', this.debounce(event => {
      this.onChange(event);
    }, 300).bind(this));
  }
  onChange() {
    const searchTerm = this.input.value.trim();
    if (!searchTerm.length) {
      this.close();
      return;
    }
    this.getSearchResults(searchTerm);
  }
  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search&type=product`).then(response => {
      if (!response.ok) {
        var error = new Error(response.status);
        this.close();
        throw error;
      }
      return response.text();
    }).then(text => {
      const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-results').outerHTML;
      this.predictiveSearchResults.innerHTML = resultsMarkup;
      this.open();
    }).catch(error => {
      this.close();
      throw error;
    });
  }
  open() {
    this.predictiveSearchResults.style.display = 'block';
  }
  close() {
    this.predictiveSearchResults.style.display = 'none';
  }
  debounce(fn, wait) {
    var _this = this;
    let t;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(t);
      t = setTimeout(() => fn.apply(_this, args), wait);
    };
  }
}
customElements.define('predictive-search', PredictiveSearch);