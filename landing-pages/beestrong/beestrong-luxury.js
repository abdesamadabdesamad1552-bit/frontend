/* BEESTRONG Luxury — 1.2KB JS, zero dependencies */
(function () {
  "use strict";

  /* Scroll reveal — IntersectionObserver, no scroll jank */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".lux-reveal").forEach(function (el) {
      obs.observe(el);
    });
  } else {
    document.querySelectorAll(".lux-reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Sticky CTA — appears after hero scroll */
  var sticky = document.getElementById("lux-sticky");
  var hero = document.querySelector(".lux-hero");
  if (sticky && hero) {
    var stickyObs = new IntersectionObserver(
      function (entries) {
        sticky.classList.toggle("is-shown", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    );
    stickyObs.observe(hero);
  }
})();
