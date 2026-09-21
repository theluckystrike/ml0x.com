/* Anonymous counts only; never reads calculator inputs, text, cookies or storage.
 * Existing counter accepts view/cta. t distinguishes result views, offer clicks
 * and free next steps. These events are not Stripe sessions or purchases. */
(function () {
  'use strict';
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  var pages = {'/tools/':'tools','/tools/index.html':'tools','/calculators/kv-cache-size-calculator.html':'kv-cache','/tools/neural-network-playground.html':'neural-playground'};
  var page = pages[location.pathname];
  if (!page) return;
  var resultSeen = false;
  function hit(event, content) {
    var u = 'https://microtools-licence.lipmichal.workers.dev/hit?p=ml0x&e=' + event + '&s=unattributed&m=direct&c=' + page + '&t=' + content;
    // Keep referrer and arbitrary query data out of the request.
    try { fetch(u, {method:'POST',keepalive:true,credentials:'omit',referrerPolicy:'no-referrer'}).catch(function(){}); } catch (_) {}
  }
  hit('view', 'page');
  document.addEventListener('ml0x:result', function () {
    if (resultSeen) return;
    resultSeen = true; hit('view', 'result');
  });
  document.addEventListener('click', function (event) {
    var a = event.target.closest && event.target.closest('a[href]');
    if (!a) return;
    var offer = a.getAttribute('data-ml0x-offer');
    if (['triage','pipeline','free-memory'].indexOf(offer) >= 0) hit('cta', 'offer-' + offer);
    else if (a.classList.contains('nav-cta')) {
      try { if (new URL(a.href, location.origin).hostname === 'zovo.one') hit('cta','nav-zovo'); } catch (_) {}
    }
  }, true);
})();
