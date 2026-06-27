EVERGREEN SURFACE SOLUTIONS — WEBSITE
=====================================

WHAT'S HERE
-----------
A complete 18-page static website. No build step required to USE it — just
open the .html files in a browser, or upload the whole folder to any web host.

  index.html ...................... Landing page
  about.html ...................... About (Who We Are) + estimate form
  log-home-services.html .......... Log Home hub  -> 5 sub-pages
  wood-staining.html .............. Wood Staining hub -> 3 sub-pages
  pressure-soft-wash.html ......... Pressure/Soft Wash hub -> 5 sub-pages

  Log Home sub-pages:
    log-staining.html, log-caulking.html, log-chinking.html,
    log-restoration.html, log-maintenance.html
  Wood Staining sub-pages:
    deck-staining.html, fence-staining.html, siding-roof-staining.html
  Pressure/Soft Wash sub-pages:
    house-wash.html, roof-wash.html, concrete-cleaning.html,
    gutter-cleaning.html, specialty-stain-removal.html

  assets/styles.css ............... All styling (brand colors & fonts)
  assets/script.js ................ Mobile menu, form helper, animations
  Photos/ ......................... Your logo + banner (logo used in header)
  build/generate.js ............... Generator that builds every page (see below)

Every page has a "Request Your Free Estimate" form at the bottom. On the
service sub-pages, that form is pre-set to the matching service.


>>> THE ONE THING YOU STILL NEED TO DO: FORMSPREE <<<
-----------------------------------------------------
The estimate form points to a placeholder. Replace YOUR_FORM_ID with your
real Formspree form ID (dashboard -> your form -> endpoint looks like
https://formspree.io/f/abcdwxyz).

Easiest (updates all 18 pages at once):
  1. Open build/generate.js
  2. In the SITE section near the top, set:
        formAction: "https://formspree.io/f/abcdwxyz"
  3. Run:  node build/generate.js

OR, if you don't want to use the generator, just find-and-replace the text
"YOUR_FORM_ID" across all .html files with your real ID.


CHANGING PHONE, EMAIL, SERVICE AREA, HOURS
------------------------------------------
These are all set in ONE place: the SITE block at the top of
build/generate.js. Edit them there and run `node build/generate.js` to update
every page. (Current phone: (765) 415-4126.)


EDITING / RE-RUNNING THE GENERATOR
----------------------------------
The generator needs Node.js (already installed on this machine). From the
project folder run:
    node build/generate.js
It rewrites all 18 .html files from the content defined in build/generate.js.
If you only ever hand-edit the .html directly, you can ignore the generator —
but then remember a change must be made on each page individually.


ADDING REAL PHOTOS LATER
------------------------
Every image area is currently a branded "woodsy" placeholder graphic.
To drop in a real photo, replace a block that looks like:

    <div class="media ..." role="img" aria-label="...">
      ... pine icon + media-content ...
    </div>

with:

    <img class="media ..." src="Photos/your-photo.jpg" alt="describe photo" />

Save photos in the Photos/ folder. (If you use the generator, the cleanest
path is to send the photos to me / your developer to wire into the templates
so they stay consistent.)


BRAND NOTES
-----------
Colors (from your logo):  navy #15243B, forest green #2E5A37,
                          river blue #2F5DA0, warm cream #F6F3EC,
                          brass accent #B08A4F
Fonts:  Archivo (bold headlines, matches your banner) + Source Sans 3 (body)
Tagline:  Clean. Restore. Protect.
Service area:  ~50-mile radius of Lafayette (47905); cabin work multi-state.
