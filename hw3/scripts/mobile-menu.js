function whenHeaderVisible(mobileMenu) {
  mobileMenu.style.display = "none";
}

function whenHeaderHidden(mobileMenu) {
  mobileMenu.style.display = "flex";
}

function setupMobileMenu() {
  const header = document.querySelector("header");
  const mobileMenu = document.querySelector(".mobile-nav-inner");
  // the IntersectionObserver tells if an element is visible.
  // I am using it to tell if the header is or is not visible
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  const obs = new IntersectionObserver(
    ([event], _obs) => {
      if (event.isIntersecting) {
        whenHeaderVisible(mobileMenu);
      } else {
        whenHeaderHidden(mobileMenu);
      }
    },
    { threshold: 0.15 }
  );
  obs.observe(header);
}

window.addEventListener("load", setupMobileMenu);
