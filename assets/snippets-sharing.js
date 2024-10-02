"use strict";

const shareButtonsLinks = Array.from(document.querySelectorAll(".js-share-buttons-link"));
if (shareButtonsLinks) {
  function getPageTitle() {
    let content;
    if (content = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]')) {
      return content.getAttribute('content');
    } else if (content = document.querySelector('title')) {
      return content.textContent || content.innerText;
    }
    return "";
  }
  function getPageDescription() {
    let content;
    if (content = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[name="description"]')) {
      return content.getAttribute('content');
    }
    return "";
  }
  function getPageImage() {
    let content;
    if (content = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]')) {
      return content.getAttribute('content');
    }
    return "";
  }
  const pageUrl = location.href;
  const pageTitle = getPageTitle();
  const pageImage = getPageImage();
  const pageDescription = getPageDescription();
  shareButtonsLinks.forEach(btnLink => {
    const network = btnLink.dataset.network;
    let url;
    switch (network) {
      case "pinterest":
        url = new URL("https://www.pinterest.com/pin/create/button");
        url.searchParams.set("url", pageUrl);
        url.searchParams.set("media", pageImage);
        url.searchParams.set("description", pageDescription);
        btnLink.href = url.href;
        break;
      case "twitter":
        url = new URL("https://twitter.com/intent/tweet");
        url.searchParams.set("url", pageUrl);
        url.searchParams.set("text", pageDescription);
        btnLink.href = url.href;
        break;
      case "facebook":
        url = new URL("https://www.facebook.com/sharer/sharer.php");
        url.searchParams.set("u", pageUrl);
        btnLink.href = url.href;
        break;
      case "linkedin":
        url = new URL("https://www.linkedin.com/shareArticle");
        url.searchParams.set("mini", true);
        url.searchParams.set("url", pageUrl);
        url.searchParams.set("title", pageTitle);
        url.searchParams.set("summary", pageDescription);
        btnLink.href = url.href;
        break;
      case "email":
        btnLink.href = "mailto:?subject=".concat(encodeURIComponent(pageTitle), "&body=").concat(encodeURIComponent(pageDescription));
        break;
    }
  });
}