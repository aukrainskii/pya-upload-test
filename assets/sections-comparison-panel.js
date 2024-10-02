"use strict";

function addToCompare(handle) {
  let panel = document.querySelector("comparison-panel") ? document.querySelector("comparison-panel") : null;
  if (panel) {
    let newAttribute;
    if (localStorage) {
      newAttribute = localStorage.getItem('c-panel-handle') ? localStorage.getItem('c-panel-handle') + "," + handle : handle;
    } else {
      newAttribute = panel.getAttribute("data-handles") != "" ? panel.getAttribute("data-handles") + "," + handle : handle;
    }
    panel.setAttribute("data-handles", newAttribute);
  }
}
if (!customElements.get('comparison-panel')) {
  class ComparisonPanel extends HTMLElement {
    static get observedAttributes() {
      return ['data-handles'];
    }
    constructor() {
      super();
      this.handles = localStorage && localStorage.getItem('c-panel-handle') ? localStorage.getItem('c-panel-handle') : this.getAttribute('data-handles');
      this.state = localStorage && localStorage.getItem('c-panel-state') ? localStorage.getItem('c-panel-state') : this.getAttribute('data-state');
      this.linkToCompare = this.querySelector("#link-to-compare");
    }
    connectedCallback() {
      if (window.location.pathname.includes("tools/compare")) {
        this.handles = window.location.pathname.replace("/tools/compare/", "").replace(/-vs-/g, ',');
      }
      this.setAttribute("data-handles", this.handles);
      this.updatePanel(this.handles);
      window.addEventListener('resize', this.simulateOrderPanel.bind(this));
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this.simulateOrderPanel.bind(this));
    }
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (oldValue != null) {
        this.updatePanel(newValue);
      }
    }
    updatePanel(handles) {
      let h_array = handles.split(",");
      if (h_array.length > 0 && h_array[0] !== "") {
        const promises = h_array.map(h => {
          return this.getAppInfo(h);
        });
        Promise.all(promises).then(dataArray => {
          this.renderApp(dataArray);
          this.state = dataArray.length;
          this.handles = handles;
          this.setAttribute("data-state", this.state);
          this.linkToCompare.setAttribute("href", "/tools/compare/" + handles.replace(/,/g, "-vs-"));
          if (localStorage) {
            localStorage.setItem("c-panel-state", this.state);
            localStorage.setItem("c-panel-handle", this.handles);
          }
          this.simulateOrderPanel();
        }).catch(error => {
          console.error(error);
        });
      } else {
        this.handles = "";
        this.state = 0;
        this.setAttribute("data-state", this.state);
        if (localStorage) {
          localStorage.setItem("c-panel-state", this.state);
          localStorage.setItem("c-panel-handle", this.handles);
        }
        this.simulateOrderPanel();
      }
    }
    simulateOrderPanel() {
      if (document.querySelector(".comparison-panel-simulation")) {
        let simulateElement = document.querySelector(".comparison-panel-simulation");
        simulateElement.style.height = this.offsetHeight + "px";
      } else {
        let simulateElement = document.createElement("div");
        simulateElement.classList.add("comparison-panel-simulation");
        simulateElement.style.height = this.offsetHeight + "px";
        document.body.appendChild(simulateElement);
      }
    }
    getAppInfo(handle) {
      return new Promise((resolve, reject) => {
        fetch(`/products/${handle}?view=json`).then(res => res.json()).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    }
    renderApp(array) {
      let appWrapper = this.querySelector(".comparison-panel__apps");
      appWrapper.innerHTML = "";
      array.forEach(data => {
        let app = document.createElement('div');
        app.classList.add('compare-app');
        app.dataset.handle = data.app.slug;
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('compare-app__delete-btn');
        deleteBtn.addEventListener("click", () => this.deleteApp(app.dataset.handle));
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99866 11.7678L14.418 16.1873C14.9062 16.6754 15.6977 16.6754 16.1858 16.1873C16.674 15.6991 16.674 14.9077 16.1858 14.4195L11.7664 10.0001L16.1858 5.58067C16.674 5.09252 16.674 4.30106 16.1858 3.8129C15.6977 3.32475 14.9062 3.32475 14.418 3.8129L9.99866 8.23232L5.5792 3.8129C5.09104 3.32474 4.29958 3.32474 3.81143 3.8129C3.32327 4.30105 3.32327 5.0925 3.81143 5.58066L8.23085 10.0001L3.81143 14.4195C3.32327 14.9077 3.32327 15.6991 3.81143 16.1873C4.29958 16.6754 5.09104 16.6754 5.5792 16.1873L9.99866 11.7678Z" fill="currentColor"></path>
                    </svg>
                `;
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('compare-app__img');
        let img = document.createElement('img');
        img.src = `${data.app.icon}?width=120`;
        img.alt = data.app.title;
        img.srcset = `${data.app.icon}?width=60 1x, ${data.app.icon}?width=120 2x`;
        img.width = 60;
        img.height = 60;
        img.loading = 'lazy';
        let title = document.createElement('p');
        title.classList.add('compare-app__title');
        title.textContent = data.app.title;
        imgContainer.appendChild(img);
        app.appendChild(deleteBtn);
        app.appendChild(imgContainer);
        app.appendChild(title);
        appWrapper.appendChild(app);
      });
    }
    deleteApp(handle) {
      let handles = this.handles.split(",").filter(item => item !== handle).toString();
      this.setAttribute("data-handles", handles);
    }
  }
  customElements.define("comparison-panel", ComparisonPanel);
}