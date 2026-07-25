# THUMOS

A holding page and a submissions form. Two static HTML files, no build step, no
dependencies, no backend.

```
index.html     "Coming soon" landing page
write.html     Write for THUMOS — the pitch form
css/styles.css single stylesheet for both pages
js/form.js     validates and sends the pitch
js/cleanup.js  removes the old cached site from returning visitors
sw.js          self-destructing service worker (see "Returning visitors")
manifest.json  icons and theme colour
assets/        favicon and app icons
```

---

## 1. Activate the form — do this first

Pitches are delivered by [FormSubmit](https://formsubmit.co), which forwards them to
**submission@thumospress.com**. It needs one activation step, and until you do it **no
pitch will reach you**:

1. Deploy the site (section 2) — activation only works from the live URL.
2. Open `write.html` and send yourself a test pitch.
3. FormSubmit emails **submission@thumospress.com** asking you to confirm. Click the
   link in that email.
4. Send one more test pitch. It should land in your inbox within a minute.

That's it — no account, no password, free. Pitches arrive as a formatted table with the
idea type, the description, and the writer's email, so you can just hit reply.

**Check the spam folder** for the confirmation email the first time.

### Changing the address

It lives in exactly one place — the `action` on the form in `write.html`:

```html
<form id="pitch-form" action="https://formsubmit.co/submission@thumospress.com" method="POST">
```

Change that address and re-activate. The JavaScript reads the address from this
attribute, so there is nothing else to edit.

### Optional: hide the address from the page source

The address above is visible in the HTML, where spam bots can scrape it. After
activating, FormSubmit gives you a random alias in your confirmation email that works
identically:

```html
<form id="pitch-form" action="https://formsubmit.co/a1b2c3d4e5f6..." method="POST">
```

Swapping it in is worth the thirty seconds.

---

## 2. Put it online

The site is plain static files, so anything that serves a folder works. It **must be
HTTPS** — all the options below do that automatically.

**Fastest — Netlify Drop (about two minutes, no account needed to start):**

1. Go to <https://app.netlify.com/drop>
2. Drag this whole folder onto the page.
3. You get a live `https://….netlify.app` URL immediately.
4. Add `thumospress.com` under *Domain settings → Add custom domain*, then point your
   domain's DNS at Netlify as instructed.

**Alternatives:** Vercel, Cloudflare Pages, GitHub Pages, or any host with a `public_html`
folder — upload the contents as-is. There is nothing to build or compile.

### After you connect the real domain

`index.html` and `write.html` each contain a few tags that name the site's address, used
for Google and for link previews on X:

```html
<link rel="canonical" href="https://thumospress.com/">
<meta property="og:url" content="https://thumospress.com/">
<meta property="og:image" content="https://thumospress.com/assets/icon-512.png">
```

They are written for `thumospress.com`. If you launch on a different domain, search and
replace it in both files. Wrong values here do not break the site — links just preview
poorly when shared.

---

## 3. Returning visitors

An earlier version of this site installed a service worker that cached the whole
magazine offline. Anyone who visited it would otherwise keep seeing that old site
forever, no matter what you deploy.

Two things handle it, and both must stay in place:

- **`sw.js`** — now a self-destructing worker. Old browsers check this file, receive it,
  and it wipes its own caches and unregisters itself.
- **`js/cleanup.js`** — clears anything left over when a page loads.

Delete both once the site has been live a month or so. Until then, leave them alone —
and do not add caching logic to `sw.js`.

---

## 4. Editing the words

Everything is plain HTML. Open the file and type.

- The "Coming soon" copy, the definition box, and the X link → `index.html`
- The submission blurb, the word limit, the payment note, the three radio options →
  `write.html`
- The thank-you message → the `.thanks` block near the bottom of `write.html`

To change the radio choices, edit the three `<label class="radio">` blocks. The `value`
is what arrives in your email, so keep those readable.

### The posters

There are two:

- **`assets/come-for-the-essays.jpg`** — the portrait poster on the holding page. On
  screens wider than 860px it sits in the left column with the wordmark and copy beside
  it; below that the page stacks to wordmark → poster → copy.
- **`assets/young-sensitive-man.jpg`** — on `write.html`, centred above the title and
  capped at 440px wide.

To swap either, drop a new file at the same path. Any shape works — the CSS scales it and
preserves the aspect ratio.

The file is 880px square (twice the display size, so it stays sharp on retina screens)
and saved as JPEG at quality 90 — 168 KB, down from the 2.1 MB original. If you replace
it, resize to roughly 880px and save as JPEG rather than dropping in a full-resolution
PNG; a multi-megabyte image is the fastest way to make the page feel slow on a phone.

If the file is missing the figure hides itself, so the page still reads correctly rather
than showing a broken-image box. That also means **a typo in the filename fails silently**
— if the poster does not appear, check the name and extension first.

The page says nothing about payment either way. If you ever want to state terms —
rates, copyright, first publication rights — add a paragraph after the word-limit one
in `write.html`.

---

## Notes

- **No tracking, no cookies, no analytics.** Nothing is stored in the browser. The only
  third party is Google Fonts (typefaces) and FormSubmit (only when someone submits).
- **Works without JavaScript.** The form falls back to a normal browser POST and lands on
  FormSubmit's own thank-you page. With JavaScript it sends in the background and shows
  the thank-you inline.
- **Spam:** there is a hidden honeypot field that bots fill and humans never see;
  submissions that fill it are silently dropped. If spam becomes a problem, remove the
  `_captcha` hidden field in `write.html` to turn FormSubmit's captcha back on.
- **Fonts:** Source Serif 4 and IBM Plex Sans, both SIL Open Font License.
