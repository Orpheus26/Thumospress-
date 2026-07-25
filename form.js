/* ============================================================
   THUMOS — pitch form

   The form posts to the address in its own `action` attribute, so the
   delivery address lives in write.html and nowhere else. Without
   JavaScript the browser submits it normally; with JavaScript we send it
   in the background and keep the writer on the page.
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('pitch-form');
  if (!form) return;

  var button = document.getElementById('pitch-submit');
  var status = document.getElementById('form-status');
  var thanks = document.getElementById('thanks');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // https://formsubmit.co/<address>  ->  https://formsubmit.co/ajax/<address>
  function ajaxEndpoint() {
    var action = form.getAttribute('action') || '';
    return action.indexOf('/ajax/') !== -1
      ? action
      : action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
  }

  function setError(key, message) {
    var box = form.querySelector('[data-err="' + key + '"]');
    if (box) box.textContent = message || '';
    var field = box && box.closest('.field');
    if (field) field.classList.toggle('bad', !!message);
    return !message;
  }

  function say(message, bad) {
    status.textContent = message || '';
    status.classList.toggle('bad', !!bad);
  }

  function validate(values) {
    var ok = true;
    ok = setError('idea', values.idea ? '' : 'Please choose one.') && ok;
    ok = setError('description',
      values.description.length >= 20 ? '' : 'A sentence or two, please — twenty characters at least.') && ok;
    ok = setError('email', EMAIL_RE.test(values.email) ? '' : 'We need a working email to reply to.') && ok;
    return ok;
  }

  function readValues() {
    var picked = form.querySelector('input[name="Idea for"]:checked');
    return {
      idea: picked ? picked.value : '',
      description: (document.getElementById('description').value || '').trim(),
      email: (document.getElementById('email').value || '').trim(),
      honey: (form.querySelector('.honey').value || '').trim()
    };
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var values = readValues();

    // A filled honeypot means a bot. Show the normal thank-you and drop it.
    if (values.honey) { showThanks(); return; }

    if (!validate(values)) {
      say('Some fields still need attention.', true);
      return;
    }

    say('Sending…');
    button.disabled = true;

    fetch(ajaxEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'THUMOS pitch — ' + values.idea,
        _template: 'table',
        _captcha: 'false',
        'Idea for': values.idea,
        'Description': values.description,
        'Email': values.email
      })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && String(result.data.success) !== 'false') {
          showThanks();
        } else {
          fail(result.data && result.data.message);
        }
      })
      .catch(function () { fail(); })
      .then(function () { button.disabled = false; });
  });

  function showThanks() {
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ block: 'center' });
  }

  function fail(message) {
    say(
      (message ? message + ' ' : 'That did not send — the line to our inbox is down. ') +
      'Please email your idea to submission@thumospress.com instead.',
      true
    );
  }

  // Clear a field's error as soon as the writer starts fixing it.
  form.addEventListener('input', function (ev) {
    var id = ev.target.id;
    if (id === 'description' || id === 'email') setError(id, '');
  });
  form.addEventListener('change', function (ev) {
    if (ev.target.name === 'Idea for') setError('idea', '');
  });
})();
