/* Evergreen Surface Solutions — site interactions */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      // Mobile: chevron button expands/collapses a tab's submenu
      var expander = e.target.closest && e.target.closest(".nav-expand");
      if (expander) {
        e.preventDefault();
        var item = expander.closest(".nav-item");
        var dd = item && item.querySelector(".dropdown");
        if (dd) {
          var opened = dd.classList.toggle("open");
          expander.setAttribute("aria-expanded", opened ? "true" : "false");
        }
        return;
      }
      // Tapping an actual link closes the whole mobile menu
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        links.querySelectorAll(".dropdown.open").forEach(function (d) { d.classList.remove("open"); });
        links.querySelectorAll('.nav-expand[aria-expanded="true"]').forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      }
    });
  }

  // ---- Current year in footer ----
  var yearEls = document.querySelectorAll("[data-year]");
  var y = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = y; });

  // ---- Pre-select a service on the contact form via ?service= ----
  var params = new URLSearchParams(window.location.search);
  var svc = params.get("service");
  if (svc) {
    var select = document.getElementById("service");
    if (select) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase() === svc.toLowerCase()) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  // ---- Scroll reveal (respects reduced-motion via CSS) ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- On-page service menus (location pages): tap to expand on mobile ----
  document.querySelectorAll(".svc-cat-top").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.closest(".svc-cat");
      var open = cat.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // ---- Rotating Google reviews (QR page) ----
  (function reviews() {
    var card = document.getElementById("review-card");
    var data = document.getElementById("reviews-data");
    if (!card || !data) return;
    var list;
    try { list = JSON.parse(data.textContent); } catch (e) { return; }
    if (!list || !list.length) return;
    var dotsWrap = document.getElementById("review-dots");
    var idx = 0, timer;
    function stars(n) {
      var s = "";
      for (var i = 0; i < 5; i++) s += '<span class="star' + (i < n ? " on" : "") + '">★</span>';
      return '<div class="review-stars" aria-label="' + n + ' out of 5 stars">' + s + "</div>";
    }
    function initials(name) {
      return name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
    }
    function render(i) {
      var r = list[i];
      var long = r.text.length > 220;
      var shown = long ? r.text.slice(0, 210).replace(/\s+\S*$/, "") + "…" : r.text;
      var avatar = r.photo
        ? '<img class="review-avatar" src="' + r.photo + '" alt="' + r.name + '" />'
        : '<div class="review-avatar review-initials">' + initials(r.name) + "</div>";
      var more = long ? ' <a class="review-more" href="' + (r.url || "#") + '" target="_blank" rel="noopener">Read more</a>' : "";
      card.innerHTML =
        '<div class="review-top">' + avatar +
        '<div><div class="review-name">' + r.name + "</div>" + stars(r.rating) + "</div></div>" +
        '<p class="review-text">' + shown + more + "</p>";
      if (dotsWrap) {
        [].forEach.call(dotsWrap.children, function (d, di) {
          d.classList.toggle("on", di === i);
        });
      }
    }
    if (dotsWrap) {
      list.forEach(function (_, i) {
        var b = document.createElement("button");
        b.className = "review-dot";
        b.setAttribute("aria-label", "Review " + (i + 1));
        b.addEventListener("click", function () { idx = i; render(idx); restart(); });
        dotsWrap.appendChild(b);
      });
    }
    function next() { idx = (idx + 1) % list.length; render(idx); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
    render(0); restart();
  })();

  // ---- Google Maps: radius map + address autocomplete (key-guarded) ----
  (function maps() {
    var key = window.EVG_MAPS_KEY;
    var mapEl = document.getElementById("radius-map");
    var addr = document.getElementById("address");
    var needsMaps = mapEl || addr;
    if (!needsMaps) return;
    if (!key || /^YOUR_/.test(key)) return; // no key yet: native autofill + map placeholder remain

    // If the key is rejected (bad key, no billing, or referrer not allowed),
    // restore a friendly message instead of a blank box.
    window.gm_authFailure = function () {
      if (mapEl) {
        mapEl.innerHTML =
          '<div class="map-fallback"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
          '<span>Map unavailable. Check that the Google Maps API key allows this site and that billing is enabled.</span></div>';
      }
    };

    window.__evgMapsReady = function () {
      // Radius map: inner 50-mi service circle + outer 300-mi cabin circle
      if (mapEl && window.google && google.maps) {
        var c = window.EVG_MAP || { lat: 40.4039, lng: -86.8597, radiusMeters: 80467 };
        var center = { lat: c.lat, lng: c.lng };
        mapEl.innerHTML = "";
        var map = new google.maps.Map(mapEl, {
          center: center, zoom: 6, mapTypeControl: false, streetViewControl: false,
        });
        var inner = new google.maps.Circle({
          map: map, center: center, radius: c.radiusMeters,
          strokeColor: "#2E5A37", strokeOpacity: 0.95, strokeWeight: 2,
          fillColor: "#3A7044", fillOpacity: 0.22,
        });
        if (c.cabinRadiusMeters) {
          var outer = new google.maps.Circle({
            map: map, center: center, radius: c.cabinRadiusMeters,
            strokeColor: "#2F5DA0", strokeOpacity: 0.9, strokeWeight: 2,
            fillColor: "#2F5DA0", fillOpacity: 0.06,
          });
          map.fitBounds(outer.getBounds());
        } else {
          map.fitBounds(inner.getBounds());
        }
        new google.maps.Marker({ map: map, position: center, title: "Lafayette, IN" });
      }
      // Address autocomplete -> fills city/state/zip
      if (addr && google.maps.places) {
        var ac = new google.maps.places.Autocomplete(addr, {
          types: ["address"], componentRestrictions: { country: "us" },
          fields: ["address_components", "formatted_address"],
        });
        ac.addListener("place_changed", function () {
          var p = ac.getPlace();
          if (!p.address_components) return;
          var get = function (type, short) {
            var comp = p.address_components.filter(function (x) { return x.types.indexOf(type) > -1; })[0];
            return comp ? (short ? comp.short_name : comp.long_name) : "";
          };
          var streetNo = get("street_number"), route = get("route");
          if (streetNo || route) addr.value = (streetNo + " " + route).trim();
          var city = document.getElementById("city");
          var state = document.getElementById("state");
          var zip = document.getElementById("zip");
          if (city) city.value = get("locality") || get("sublocality") || get("administrative_area_level_3");
          if (state) state.value = get("administrative_area_level_1", true);
          if (zip) zip.value = get("postal_code");
        });
      }
    };

    var s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) +
      "&libraries=places&callback=__evgMapsReady&loading=async";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  })();
})();
