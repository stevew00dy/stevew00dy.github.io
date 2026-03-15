(function() {
  var STORAGE_PREFIX = 'personal-armour';
  var NOTICE_KEY = 'unoob-data-notice-dismissed';
  var currentFilter = 'all';
  var searchQuery = '';

  function getArmorKeys() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && (k.indexOf('personal-armour') === 0 || k.indexOf('personal-armor') === 0)) {
        keys.push(k);
      }
    }
    return keys;
  }

  function exportData() {
    var data = { version: 1, exportedAt: new Date().toISOString(), items: {} };
    getArmorKeys().forEach(function(k) {
      data.items[k] = localStorage.getItem(k);
    });
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'armor-tracker-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    var r = new FileReader();
    r.onload = function() {
      try {
        var data = JSON.parse(r.result);
        if (data.items && typeof data.items === 'object') {
          for (var k in data.items) {
            if (data.items[k] != null) localStorage.setItem(k, data.items[k]);
          }
          window.location.reload();
        } else {
          alert('Invalid backup file. Expected an Armor Tracker JSON export.');
        }
      } catch (e) {
        alert('Invalid backup file.');
      }
    };
    r.readAsText(file);
  }

  function resetData() {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    getArmorKeys().forEach(function(k) { localStorage.removeItem(k); });
    window.location.reload();
  }

  var menuBtn = document.getElementById('armor-nav-menu-btn');
  var dropdown = document.getElementById('armor-nav-dropdown');
  var closeBtn = document.getElementById('armor-nav-close');
  var fileInput = document.getElementById('armor-nav-file');
  var notice = document.getElementById('armor-unob-notice');
  var dismissBtn = document.getElementById('armor-notice-dismiss');

  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
      menuBtn.classList.toggle('open', !dropdown.hidden);
    });
  }
  if (closeBtn && dropdown) {
    closeBtn.addEventListener('click', function() {
      dropdown.hidden = true;
      if (menuBtn) menuBtn.classList.remove('open');
    });
  }
  document.addEventListener('click', function(e) {
    if (dropdown && !dropdown.hidden && menuBtn && !menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.hidden = true;
      menuBtn.classList.remove('open');
    }
  });

  var exportBtn = document.getElementById('armor-nav-export');
  if (exportBtn) exportBtn.addEventListener('click', function() { exportData(); dropdown.hidden = true; if (menuBtn) menuBtn.classList.remove('open'); });
  var importBtn = document.getElementById('armor-nav-import');
  if (importBtn) importBtn.addEventListener('click', function() { fileInput.click(); });
  if (fileInput) fileInput.addEventListener('change', function(e) {
    var f = e.target.files[0];
    if (f) importData(f);
    e.target.value = '';
  });
  var resetBtn = document.getElementById('armor-nav-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetData);

  if (dismissBtn && notice) {
    dismissBtn.addEventListener('click', function() {
      localStorage.setItem(NOTICE_KEY, '1');
      notice.style.display = 'none';
    });
  }
  if (notice && localStorage.getItem(NOTICE_KEY) === '1') {
    notice.style.display = 'none';
  }

  /* Hide the in-app second nav bar and wire up our search/filter */
  function hideSecondNav() {
    var root = document.getElementById('root');
    if (!root || root.querySelector('[data-armor-second-nav]')) return;
    var main = root.firstElementChild;
    if (!main) return;
    var searchInput = root.querySelector('input[placeholder*="Search" i], input[placeholder*="armor" i]');
    var target = null;
    if (searchInput) {
      var el = searchInput;
      while (el && el !== main) {
        if (el.parentElement === main) { target = el; break; }
        el = el.parentElement;
      }
    }
    if (!target && main.children.length > 0) {
      var first = main.children[0];
      if (first.textContent && first.textContent.indexOf('Personal Armour') >= 0) target = first;
    }
    if (target) target.setAttribute('data-armor-second-nav', '1');
  }

  function getCards() {
    var root = document.getElementById('root');
    if (!root) return [];
    var cards = root.querySelectorAll('[class*="rounded-xl"], [class*="rounded-lg"]');
    return Array.prototype.filter.call(cards, function(c) {
      return !c.closest('[data-armor-second-nav]');
    });
  }

  function cardMatchesFilter(card, filter, query) {
    var text = (card.textContent || '').toLowerCase();
    var typeMatch = filter === 'all' || text.indexOf(filter) >= 0;
    var searchMatch = !query || text.indexOf(query.toLowerCase()) >= 0;
    return typeMatch && searchMatch;
  }

  function applyFilter() {
    var cards = getCards();
    cards.forEach(function(card) {
      var show = cardMatchesFilter(card, currentFilter, searchQuery);
      card.style.display = show ? '' : 'none';
    });
  }

  var searchEl = document.getElementById('armor-nav-search');
  var filterBtns = document.querySelectorAll('.nav-filter-btn[data-filter]');
  if (searchEl) {
    searchEl.addEventListener('input', function() {
      searchQuery = searchEl.value.trim();
      applyFilter();
    });
  }
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hideSecondNav, 100);
      setTimeout(hideSecondNav, 500);
    });
  } else {
    setTimeout(hideSecondNav, 100);
    setTimeout(hideSecondNav, 500);
  }
  var mo = new MutationObserver(function() {
    hideSecondNav();
    applyFilter();
  });
  var rootEl = document.getElementById('root');
  if (rootEl) {
    mo.observe(rootEl, { childList: true, subtree: true });
  }
})();
