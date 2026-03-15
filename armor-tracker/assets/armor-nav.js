(function() {
  var STORAGE_PREFIX = 'personal-armour';
  var NOTICE_KEY = 'unoob-data-notice-dismissed';

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
    menuBtn.addEventListener('click', function() {
      var open = !dropdown.hidden;
      dropdown.hidden = !open;
      menuBtn.classList.toggle('open', !open);
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
})();
