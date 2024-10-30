"use strict";

if (!customElements.get('c-search')) {
  customElements.define('c-search', class ComponentSearch extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input[type="search"]');
      //this.typeSearch = this.getAttribute("data-search-param");
      this.predictiveSearchResults = this.querySelector('#predictive-search');
      this.input.addEventListener('input', this.debounce(event => {
        this.onChange();
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
      fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`).then(response => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        return response.text();
      }).then(text => {
        let resultsMarkup;

        if (this.typeSearch == "product") {
          resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-products-list').outerHTML;
        } else if (this.typeSearch == "article") {
          resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-articles-list').outerHTML;
        } else if (this.typeSearch == "collection") {
          resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-collection-list').outerHTML;
        } else {
          resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-collection-product-list').outerHTML;
        }
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        if (this.predictiveSearchResults) {
          this.open();
        }
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
  });
}