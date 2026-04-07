(function() {
  const WS_URL = 'ws://' + window.location.host;
  let ws = null;
  let eventQueue = [];

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      eventQueue.forEach(e => ws.send(JSON.stringify(e)));
      eventQueue = [];
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'reload') {
        window.location.reload();
      }
    };

    ws.onclose = () => {
      setTimeout(connect, 1000);
    };
  }

  function sendEvent(event) {
    event.timestamp = Date.now();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    } else {
      eventQueue.push(event);
    }
  }

  // Capture clicks on choice elements
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-choice]');
    if (!target) return;

    sendEvent({
      type: 'click',
      text: target.textContent.trim(),
      choice: target.dataset.choice,
      id: target.id || null
    });

    // Update indicator bar (defer so toggleSelect runs first)
    setTimeout(() => {
      const indicator = document.getElementById('indicator-text');
      if (!indicator) return;
      const container = target.closest('.options') || target.closest('.cards');
      const selected = container ? container.querySelectorAll('.selected') : [];
      if (selected.length === 0) {
        indicator.textContent = 'Interagissez ci-dessus, puis revenez au terminal';
      } else if (selected.length === 1) {
        const label = selected[0].querySelector('h3, .content h3, .card-body h3')?.textContent?.trim() || selected[0].dataset.choice;
        indicator.innerHTML = '<span class="selected-text">' + label + ' sélectionné</span> — retournez au terminal pour continuer';
      } else {
        indicator.innerHTML = '<span class="selected-text">' + selected.length + ' sélectionnés</span> — retournez au terminal pour continuer';
      }
    }, 0);
  });

  // Frame UI: selection tracking
  window.selectedChoice = null;

  window.toggleSelect = function(el) {
    const container = el.closest('.options') || el.closest('.cards');
    const multi = container && container.dataset.multiselect !== undefined;
    if (container && !multi) {
      container.querySelectorAll('.option, .card').forEach(o => o.classList.remove('selected'));
    }
    if (multi) {
      el.classList.toggle('selected');
    } else {
      el.classList.add('selected');
    }
    window.selectedChoice = el.dataset.choice;
  };

  // Expose API for explicit use
  window.brainstorm = {
    send: sendEvent,
    choice: (value, metadata = {}) => sendEvent({ type: 'choice', value, ...metadata })
  };

  connect();

  // Text input form submission
  window.submitTextInput = function() {
    const textarea = document.getElementById('user-input');
    if (!textarea) return;
    const value = textarea.value.trim();
    if (!value) return;

    sendEvent({
      type: 'text-input',
      value: value
    });

    // Disable form after submission to prevent double-send
    textarea.disabled = true;
    textarea.value = '';
    const btn = textarea.closest('.text-input-form')?.querySelector('button');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Envoyé';
    }

    // Update indicator
    const indicator = document.getElementById('indicator-text');
    if (indicator) {
      indicator.innerHTML = '<span class="selected-text">Message envoyé</span> — retournez au terminal pour continuer';
    }
  };

  // Handle Enter key in textarea (Shift+Enter for newline)
  document.addEventListener('keydown', (e) => {
    if (e.target.id === 'user-input' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      window.submitTextInput();
    }
  });
})();
