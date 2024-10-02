"use strict";

class FilterProduct extends HTMLElement {
  constructor() {
    super();
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.form = this.querySelector("form");
    this.buttonsWrapper = this.querySelector(".filter__buttons");
    this.removeBtn = this.querySelector("[remove-filter]");
    this.body = document.querySelector("body");
    this.openFilter = document.querySelector("[toggle-filter]");
    this.backdrop = this.body.querySelector(".backdrop");
    this.checked = window.location.search.replace("?", "") == "" ? [] : decodeURIComponent(window.location.search).replace("?", "").split("&");
    this.removeTags = Array.from(this.querySelectorAll(".filter__tag-btn"));
    this.showCheckbox = Array.from(this.querySelectorAll(".filter-item__button"));
  }
  connectedCallback() {
    this.form.addEventListener("change", this.handleChangeForm);
    this.removeBtn.addEventListener("click", this.handleChangeForm);
    this.removeTags.forEach(tag => tag.addEventListener("click", this.handleChangeForm));
    if(this.openFilter) {
      this.openFilter.addEventListener("click", this.toggleFilter);
    }
    this.backdrop.addEventListener("click", this.toggleFilter);
    this.addEventListener("click", this.toggleFilter);
    this.showCheckbox.forEach(btn => btn.addEventListener("click", this.showParams));
  }
  disconnectedCallback() {
    this.form.removeEventListener("change", this.handleChangeForm);
    this.removeBtn.removeEventListener("click", this.handleChangeForm);
    this.removeTags.forEach(tag => tag.removeEventListener("click", this.handleChangeForm));
    if(this.openFilter) {
      this.openFilter.removeEventListener("click", this.toggleFilter);
    }
    this.backdrop.removeEventListener("click", this.toggleFilter);
    this.removeEventListener("click", this.toggleFilter);
    this.showCheckbox.forEach(btn => btn.removeEventListener("click", this.showParams));
  }
  showParams(ev) {
    let parent = ev.target.closest(".filter-item");
    if (ev.target.hasAttribute("open-category")) {
      parent.classList.add("params-opened");
    } else {
      parent.classList.remove("params-opened");
      const position = parent.offsetTop - (window.innerHeight - parent.offsetHeight) / 2;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  }
  toggleFilter(ev) {
    if (ev.target.hasAttribute("toggle-filter")) {
      this.body.classList.toggle("open");
    }
    if (ev.target.closest(".backdrop")) {
      this.body.classList.remove("open");
    }
  }
  handleChangeForm(event) {
    const {
      checked,
      value
    } = event.target;
    if (checked) {
      value.split("&").forEach(el => {
        this.checked.push(el);

      });
    } else {
      value.split("&").forEach(el => {
        this.checked = this.checked.filter(check => check !== el);
      });
    }
    if (event.target.hasAttribute("remove-filter")) {
      this.checked = [];
    }
    if (event.target.hasAttribute("remove-tag")) {
      this.checked = value.split("?")[1] ? value.split("?")[1].split("&") : "";
    }
    this.requestShopify();
  }
  requestShopify() {
    const section = this.closest("section");
    const s_id = section.id.slice(16);
    const wrapper = section.querySelector(".dev-products__list");
    const filterParams = this.checked.toString().replace(/,/g, "&");
    wrapper.classList.add("loading");
    this.form.classList.add("loading");
    fetch(`${window.location.pathname}?${filterParams}&section_id=${s_id}`).then(res => res.text()).then(res => {
      window.history.replaceState(null, null, window.location.pathname + `${filterParams.length > 0 ? "?" + filterParams : ""}`);
      let activeFilters = Array.from(this.querySelectorAll(".params-opened"));
      let activeParams = [];
      activeFilters.forEach(f => {
        activeParams.push(f.getAttribute("data-filter"));
      });
      const parser = new DOMParser();
      const newContent = parser.parseFromString(res, 'text/html');
      activeParams.forEach(param => {
        newContent.querySelector(`[data-filter="${param}"]`).classList.add("params-opened");
      });
      section.outerHTML = newContent.querySelector("section").outerHTML;
      dropdownsInit();
    });
  }
}
customElements.define("products-filter", FilterProduct);


class CollectionProductTabs extends HTMLElement {
  constructor() {
    super();
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.buttons = Array.from(this.querySelectorAll("button"));
    this.select = this.querySelector("select");
    this.checked = window.location.search.replace("?", "") == "" ? [] : decodeURIComponent(window.location.search).replace("?", "").split("&");
  }
  connectedCallback() {
    this.buttons.forEach(button => button.addEventListener("click", this.handleChangeForm));
    this.select.addEventListener("change", this.handleChangeForm);
  }
  disconnectedCallback() {
    this.buttons.forEach(button => button.removeEventListener("click", this.handleChangeForm));
    this.select.removeEventListener("change", this.handleChangeForm);
  }
  handleChangeForm(event) {
    const {
      value
    } = event.target;
    let values = [];
    this.buttons.forEach(b => {
      if (b.value != "") {
        b.value.split("&").forEach(el => {
          values.push(el);
        });
      }
    });
    values.forEach(el => {
      this.checked = this.checked.filter(check => check !== el);
    });
    this.checked.push(value);
    this.requestShopify();
  }
  requestShopify() {
    const section = this.closest("section");

    const s_id = section.id.slice(16);
    const wrapper = section.querySelector(".dev-products__list");
    const filterParams = this.checked.toString().replace(/,/g, "&");
    wrapper.classList.add("loading");
    fetch(`${window.location.pathname}?${filterParams}&section_id=${s_id}`).then(res => res.text()).then(res => {
      window.history.replaceState(null, null, window.location.pathname + `?${filterParams}`);
      section.outerHTML = res;
      dropdownsInit();
    });
  }
}
customElements.define("collection-product-tabs", CollectionProductTabs);


class ProductList extends HTMLElement {
  constructor() {
    super();
    this.targetComponent = document.querySelector('comparison-panel');
    this.compareHandle = "";
    this.compareState = 0;
  }
  connectedCallback() {
    this.compareHandle = localStorage && localStorage.getItem('c-panel-handle') ? localStorage.getItem('c-panel-handle') : "";
    this.compareState = localStorage && localStorage.getItem('c-panel-state') ? localStorage.getItem('c-panel-state') : 0;
    this.buttonsAddToCompare = Array.from(this.querySelectorAll(".app-card__compare"));
    const observer = new MutationObserver(this.handleMutation.bind(this));
    observer.observe(this.targetComponent, {
      attributes: true,
      subtree: true
    });
    this.buttonDisable();
  }
  disconnectedCallback() {}
  buttonDisable() {
    if (this.compareState == "3") {
      this.buttonsAddToCompare.forEach(btn => {
        btn.classList.add("disabled");
      });
    } else {
      this.buttonsAddToCompare.forEach(btn => {
        btn.classList.remove("disabled");
      });
      this.compareHandle.split(",").forEach(handle => {
        this.buttonsAddToCompare.forEach(btn => {
          if (btn.getAttribute("data-btn-handle") == handle) {
            btn.classList.add("disabled");
          }
        });
      });
    }
  }
  handleMutation(mutationsList) {
    mutationsList.forEach(mutation => {
      if (mutation.type == "attributes") {
        if (mutation.target.getAttribute("data-state") == 3) {
          this.buttonsAddToCompare.forEach(btn => {
            btn.classList.add("disabled");
          });
        } else {
          if (mutation.target.getAttribute("data-handles") != null) {
            this.buttonsAddToCompare.forEach(btn => {
              btn.classList.remove("disabled");
            });
            mutation.target.getAttribute("data-handles").split(",").forEach(handle => {
              this.buttonsAddToCompare.forEach(btn => {
                if (btn.getAttribute("data-btn-handle") == handle) {
                  btn.classList.add("disabled");
                }
              });
            });
          }
        }
      }
    });
  }
}
customElements.define("product-list", ProductList);



document.addEventListener("DOMContentLoaded", (event) => {

  dropdownsInit();

  mainTabsInit();

});

function mainTabsInit() {
  let select = document.querySelector('.pw-main-select-tabs');
  let tabs = document.querySelectorAll('.pw-product-tab-content');

  if(select) {
    select.addEventListener('change', function(){
      let value = select.value;
      let currentTab = document.querySelector(`[data-content="${value}"]`);
      tabs.forEach(function(tab) {
        tab.style.display = 'none';
      })
      currentTab.style.display = 'block';
    });
  }

  
}

function dropdownsInit() {

  let dropdowns = document.querySelectorAll('.filter-item');

  dropdowns.forEach(function(dropdown){

    let checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox){
      if(checkbox.checked) {
        let spanValue = checkbox.value.substring(checkbox.value.lastIndexOf('=') + 1).replace(/\+/g, ' ').replace(/&/g, '');
        let parent = checkbox.closest('.filter-item');

        if (parent.classList.contains('filter-item--rating')) {
          if(spanValue !== '0.0' || spanValue !== '5.0' ) {
            spanValue = Math.floor(spanValue).toFixed(1);
          }
        }
        const valueHolder = checkbox.closest('.filter-item').querySelector('.filter-dropdown-title-current');
        valueHolder.textContent = spanValue;

      }
    });
  });

  let dropdownButtons = document.querySelectorAll('.filter-dropdown-title');

  if (dropdownButtons) {

    dropdownButtons.forEach(function(button){
      button.addEventListener('click', function(e){

        let dropdowns = document.querySelectorAll('.filter-item');

        if(dropdowns) {
          let filter = this.closest('.filter-item');
          let dropdown = filter.querySelector('.filter-dropdown');

          if(filter.classList.contains('show')) {
            filter.classList.remove('show');
          } else {
            dropdowns.forEach(function(dropdown){
              dropdown.classList.remove('show');
            });
            filter.classList.add('show');
          }
        }
      });
    });

    document.addEventListener('click', function(e) {
      let parentBlock = e.target.closest('.filter-dropdown');

      if (parentBlock) {
        return false;
      }

      if( !e.target.classList.contains('filter-dropdown-title') ) {
        dropdownButtons.forEach(function(button){
          let filter = button.closest('.filter-item');
          filter.classList.remove('show');
        });
      }
    });
  }

}