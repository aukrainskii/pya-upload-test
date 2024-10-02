"use strict";

if (!customElements.get('c-product-slider')) {
  customElements.define('c-product-slider', class ComponentProductSlider extends HTMLElement {
    constructor() {
      super();
      this.slider = new Glide(this, {
        gap: 20,
        type: 'carousel',
        perView: 3,
        breakpoints: {
          560: {
            perView: 1
          },
          992: {
            perView: 2
          }
        }
      }).mount();
      this.slides = this.querySelectorAll(".js-product-slider__slides li");
    }
    connectedCallback() {
      this.slides.forEach(el => {
        el.addEventListener("click", ev => {
          ev.stopPropagation();
          publish("openSliderPopup", el);
        });
      });
    }
    disconnectedCallback() {}
  });
}
if (!customElements.get('c-product-slider-popup')) {
  customElements.define('c-product-slider-popup', class ComponentProductSliderPopup extends HTMLElement {
    constructor() {
      super();
      this.slider = new Glide(this.querySelector(".js-product-slider-popup__slider"), {
        gap: 20,
        type: 'carousel',
        perView: 1
      });
      this.slider.mount();
      this.slides = this.querySelectorAll(".js-product-slider-popup__slider li:not([class='glide__slide--clone']");
    }
    connectedCallback() {
      subscribe("openSliderPopup", el => this.openPopup(el));
      this.addEventListener("click", ev => this.closePopup(ev.target));
      document.body.addEventListener('keyup', e => {
        if (e.code == "Escape") {
          this.closePopup();
        }
      });
      this.videos = Array.from(this.querySelectorAll(".youtube-video"));
      this.slider.on(['move'], () => {
        this.querySelectorAll('.youtube-video').forEach(video => {
          video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        });
      });
    }
    disconnectedCallback() {
      this.removeEventListener("click", ev => this.closePopup(ev.target));
      document.body.removeEventListener('keyup', e => {
        if (e.code == "Escape") {
          this.closePopup();
        }
      });
    }
    openPopup(slide) {
      let order;
      this.slides.forEach((el, i) => {
        if (el.getAttribute("data-id") == slide.getAttribute("data-id")) {
          order = i;
          if (el.querySelector("iframe")) {
            el.querySelector("iframe").contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          }
        }
      });
      document.body.classList.add("open");
      this.classList.add("active");
      this.slider.update({
        startAt: order,
        gap: 20,
        type: 'carousel',
        perView: 1
      });
    }
    closePopup() {
      let el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      if (el == this) {
        this.classList.remove("active");
        this.querySelectorAll('.youtube-video').forEach(video => {
          video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        });
        document.body.classList.remove("open");
      }
    }
  });
}