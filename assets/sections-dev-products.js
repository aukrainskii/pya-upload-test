"use strict";

class FilterDevProduct extends HTMLElement {
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
    this.checked = [];
  }
  connectedCallback() {
    this.form.addEventListener("change", this.handleChangeForm);
    this.removeBtn.addEventListener("click", this.handleChangeForm);
    this.openFilter.addEventListener("click", this.toggleFilter);
    this.backdrop.addEventListener("click", this.toggleFilter);
    this.addEventListener("click", this.toggleFilter);
  }
  disconnectedCallback() {
    this.form.removeEventListener("change", this.handleChangeForm);
    this.removeBtn.removeEventListener("click", this.handleChangeForm);
    this.openFilter.removeEventListener("click", this.toggleFilter);
    this.backdrop.removeEventListener("click", this.toggleFilter);
    this.removeEventListener("click", this.toggleFilter);
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
      this.checked.push(value);
    } else {
      this.checked = this.checked.filter(check => check !== value);
    }
    if (event.target.hasAttribute("remove-filter")) {
      const checkboxes = Array.from(this.form.querySelectorAll(".checkbox__input"));
      checkboxes.forEach(checkbox => checkbox.checked = false);
      this.checked = [];
    }
    this.requestShopify();
  }
  requestShopify() {
    const section = this.closest("section");
    const s_id = section.id.slice(16);
    const wrapper = section.querySelector(".dev-products__list");
    const tagsWrapper = section.querySelector(".filter__tags");
    wrapper.classList.add("loading");
    this.form.classList.add("loading");
    fetch(`${window.location.pathname}?section_id=${s_id}`).then(res => res.text()).then(res => {
      if (this.checked.length > 0) {
        this.buttonsWrapper.classList.add("open");
      } else {
        this.buttonsWrapper.classList.remove("open");
      }
      this.renderTags(this.checked, tagsWrapper);
      this.renderAppCard(res, wrapper, wrapper);
      wrapper.setAttribute("data-filtered", "true");
    });
  }
  renderTags(handles, wrapper) {
    wrapper.innerHTML = "";
    const checkboxes = Array.from(this.form.querySelectorAll(".checkbox__input"));
    handles.forEach(handle => {
      const tag = document.createElement("span");
      tag.classList.add("filter__tag");
      const removeTag = document.createElement("button");
      removeTag.setAttribute("value", handle);
      removeTag.addEventListener("click", ev => {
        const checkbox = checkboxes.find(cb => cb.value === ev.target.value);
        if (checkbox) {
          checkbox.checked = false;
          this.handleChangeForm(ev);
        }
      });
      const app = checkboxes.find(app => app.getAttribute("value") === handle);
      if (app) {
        const collectionName = app.closest("label").querySelector(".checkbox__label").innerText;
        tag.innerText = collectionName;
      }
      tag.appendChild(removeTag);
      wrapper.append(tag);
    });
  }
  renderAppCard(html, wrapper, origin) {
    const section = document.createElement("div");
    section.innerHTML = html;
    const apps = Array.from(section.querySelectorAll(".app-card"));
    let filteredApp = apps;
    if (this.checked.length > 0) {
      filteredApp = apps.filter(app => {
        return this.checked.some(collection => app.getAttribute("data-collection").includes(collection));
      });
    }
    let productCounts = Array.from(document.querySelectorAll("#product-count"));
    productCounts.forEach(count => {
      count.innerText = filteredApp.length;
    });
    wrapper.innerHTML = "";
    filteredApp.forEach(el => {
      wrapper.appendChild(el);
    });
    origin.classList.remove("loading");
    this.form.classList.remove("loading");
  }
}
customElements.define("dev-filter", FilterDevProduct);
class ProductList extends HTMLElement {
  static get observedAttributes() {
    return ['data-filtered'];
  }
  constructor() {
    super();
    this.targetComponent = document.querySelector('comparison-panel');
    this.compareHandle = "";
    this.compareState = 0;
  }
  connectedCallback() {
    this.compareHandle = localStorage && localStorage.getItem('c-panel-handle') ? localStorage.getItem('c-panel-handle') : this.targetComponent.getAttribute("data-handles");
    this.compareState = localStorage && localStorage.getItem('c-panel-state') ? localStorage.getItem('c-panel-state') : this.targetComponent.getAttribute("data-state");
    this.buttonsAddToCompare = Array.from(this.querySelectorAll(".app-card__compare"));
    const observer = new MutationObserver(this.handleMutation.bind(this));
    observer.observe(this.targetComponent, {
      attributes: true,
      subtree: true
    });
    this.buttonDisable();
  }
  disconnectedCallback() {}
  attributeChangedCallback(attributeName, oldValue, newValue) {
    this.compareHandle = localStorage && localStorage.getItem('c-panel-handle') ? localStorage.getItem('c-panel-handle') : this.targetComponent.getAttribute("data-handles");
    this.compareState = localStorage && localStorage.getItem('c-panel-state') ? localStorage.getItem('c-panel-state') : this.targetComponent.getAttribute("data-state");
    this.buttonsAddToCompare = Array.from(this.querySelectorAll(".app-card__compare"));
    const observer = new MutationObserver(this.handleMutation.bind(this));
    observer.observe(this.targetComponent, {
      attributes: true,
      subtree: true
    });
    this.buttonDisable();
  }
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