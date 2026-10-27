/*!
 * Portfolio AI chatbot widget (drop-in, no dependencies)
 * Add before </body>:   <script src="chatbot.js" defer></script>
 * Optional config (put BEFORE the script tag):
 *   <script>window.BW_CHAT = { api: '/api/chat', chips: ['Skills','Projects'] };</script>
 */
(function () {
  'use strict';
  if (window.__bwChat) return;
  window.__bwChat = true;

  var CFG = {
    api: '/api/chat',
    title: 'Ask Biswajit\u2019s AI',
    sub: 'AI assistant \u00b7 usually replies in seconds',
    greeting: 'Hi, I\u2019m Biswajit\u2019s AI assistant. Ask me about his skills, projects, or how to get in touch.',
    placeholder: 'Type your question\u2026',
    chips: ['Who is Biswajit?', 'Skills & tech stack', 'Show me his projects', 'Education', 'How can I contact him?'],
    cv: 'cv.pdf',
    github: 'https://github.com/Biswajitpattanaik07',
    avatar: ''   // put your photo path here, e.g. 'assets/me.jpg' (leave empty to use the built-in human logo)
  };
  var user = window.BW_CHAT || {};
  for (var k in user) if (Object.prototype.hasOwnProperty.call(user, k)) CFG[k] = user[k];

  /* ---------- offline fallback (used when /api/chat is unreachable) ---------- */
  var KB = [
    { r: /^\s*(hi|hello|hey|namaste|hii+)\b/i, a: 'Hello! \ud83d\udc4b Ask me about Biswajit\u2019s projects, skills, education or how to contact him.' },
    { r: /contact|email|mail|hire|reach|connect|linkedin|phone|number/i, a: 'The quickest way is the contact section of this page. You can also find him on GitHub: ' + CFG.github },
    { r: /\bcv\b|resume|r\u00e9sum\u00e9/i, a: 'You can download his CV here: ' + CFG.cv },
    { r: /github|repo|source code/i, a: 'His GitHub: ' + CFG.github },
    { r: /educat|degree|college|universit|cgpa|b\.?tech|study|graduat|cutm/i, a: '**B.Tech (final year)** at **Centurion University of Technology and Management (CUTM)**, Bhubaneswar, Odisha. CGPA is approximately **8.20**.' },
    { r: /resumegenie|resume genie|career assist/i, a: '**ResumeGenie AI** is a Generative AI career assistant: resume analysis and audit, ATS-style matching score, AI cover letters and career coaching. Built with Python, Streamlit and Groq-hosted Llama models.' },
    { r: /rail|track|fault|crack/i, a: '**Bharatiya Rail Track Fault Detection AI** classifies railway track defects (cracks, rust, breaks) from images using a CNN with EfficientNetB3, converted to TensorFlow Lite for lighter deployment. He reports about **91.56% accuracy** (self-reported experimental result).' },
    { r: /multicart|cartsphere|e-?commerce|marketplace|vendor/i, a: '**MultiCart / CartSphere** is a multi-vendor e-commerce platform with customers, vendors and admins, approval workflows, carts, payments and dashboards. Stack: Next.js, TypeScript, Tailwind, MongoDB, Razorpay and Cloudinary.' },
    { r: /vingo|food|delivery/i, a: '**Vingo** is a food delivery platform for customers, shop owners and delivery partners with real-time order updates. Stack: React, Vite, Node.js, Express, MongoDB, Socket.IO, Tailwind and Razorpay.' },
    { r: /agri|farm|crop/i, a: '**AgriVision AI** applies AI to agriculture (image analysis and decision support). It is a project direction he is exploring; detailed results are not documented yet.' },
    { r: /black ?box|vehicle|ieee|tech ?spark|award|won|win/i, a: '**AI Vehicle Black Box** combines IoT, embedded systems and AI for vehicle safety. He reports winning with it at **IEEE Tech Spark 2.0**.' },
    { r: /network|packet tracer|cisco/i, a: '**Intelligent Network Monitoring** is a campus network design and monitoring project built in Cisco Packet Tracer.' },
    { r: /project|work|built|portfolio|made/i, a: 'Main projects:\n- **ResumeGenie AI** (Generative AI career tool)\n- **Rail Track Fault Detection AI** (computer vision)\n- **MultiCart** (multi-vendor e-commerce)\n- **Vingo** (food delivery, real-time)\n- **AI Vehicle Black Box** (IoT + AI)\n- **Intelligent Network Monitoring**\nAsk about any of them for details.' },
    { r: /skill|tech|stack|language|tool|know|python|react|java|c\+\+|iot|esp32|embedded/i, a: '**Languages:** C++, Java, Python, JavaScript, TypeScript\n**Web:** React, Next.js, Node.js, Express, MongoDB, Tailwind\n**AI/ML:** TensorFlow, CNNs, computer vision, LLMs, RAG, LangChain\n**IoT:** ESP32, Arduino, STM32, MQTT\n**Other:** networking, AWS basics, system design' },
    { r: /goal|career|future|looking|intern|job|opportunit|available/i, a: 'Biswajit wants to grow as a **software / AI engineer**, building where software meets intelligent systems. He is open to internships and entry-level opportunities.' },
    { r: /where|location|city|based|live/i, a: 'Biswajit is based in Bhubaneswar, Odisha, India.' },
    { r: /who|about|intro|tell me|what does|do he|does he/i, a: 'Biswajit Pattanaik is a final-year B.Tech student and aspiring **software / AI engineer** who learns by building: full-stack web apps, Generative AI tools, computer-vision models and IoT systems.' }
  ];
  function offlineReply(q) {
    for (var i = 0; i < KB.length; i++) if (KB[i].r.test(q)) return KB[i].a;
    return 'I\u2019m in offline mode right now, so I can only answer basics. Try asking about his skills, projects, CV or contact details.';
  }

  /* ---------- styles ---------- */
  var css = [
    '#bwc,#bwc *{box-sizing:border-box}',
    '#bwc{text-align:left;--a:#00f260;--b:#0575e6;--bg:#070b11;--fg:#e6edf3;--mut:#7d8a98;--line:rgba(255,255,255,.09);position:fixed;z-index:9000;right:0;bottom:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg)}',
    '#bwc button{font:inherit;color:inherit}',
    '#bwcFab{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;',
    '  background:linear-gradient(135deg,var(--b),var(--a));box-shadow:0 10px 30px rgba(0,242,96,.28),0 4px 12px rgba(0,0,0,.5);transition:transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent}',
    '#bwcFab:hover{transform:scale(1.07)}#bwcFab:focus-visible{outline:3px solid #fff;outline-offset:3px}',
    '#bwcFab{padding:3px}#bwcFab svg,#bwcFab img{width:100%;height:100%;display:block;border-radius:50%;object-fit:cover;background:#0b1a2b}',
    '.bwcDot{position:absolute;right:1px;bottom:1px;width:14px;height:14px;border-radius:50%;background:var(--a);border:2.5px solid #070b11;box-shadow:0 0 8px var(--a)}',
    '#bwcFab::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--a);animation:bwcPulse 2.4s ease-out infinite}',
    '@keyframes bwcPulse{from{transform:scale(1);opacity:.7}to{transform:scale(1.55);opacity:0}}',
    '#bwc.open #bwcFab{opacity:0;pointer-events:none;transform:scale(.6)}',
    '#bwcTip{position:fixed;right:max(86px,calc(env(safe-area-inset-right) + 86px));bottom:max(30px,calc(env(safe-area-inset-bottom) + 30px));background:var(--bg);border:1px solid var(--line);color:var(--fg);font-size:13px;padding:8px 12px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.45);opacity:0;transform:translateX(8px);transition:.3s;pointer-events:none;white-space:nowrap}',
    '#bwcTip.show{opacity:1;transform:none}',
    '#bwcPanel{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:min(390px,calc(100vw - 36px));height:min(600px,calc(100vh - 36px));height:min(600px,calc(100dvh - 36px));',
    '  display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--line);border-radius:18px;overflow:hidden;',
    '  box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.6),0 0 50px rgba(0,242,96,.07);',
    '  opacity:0;transform:translateY(16px) scale(.97);transform-origin:100% 100%;visibility:hidden;transition:opacity .22s,transform .22s,visibility .22s}',
    '#bwc.open #bwcPanel{opacity:1;transform:none;visibility:visible}',
    '.bwcHead{flex:none;display:flex;align-items:center;gap:12px;padding:12px 14px;padding-top:max(12px,env(safe-area-inset-top));background:linear-gradient(180deg,#111923,#0b1118);border-bottom:1px solid var(--line)}',
    '.bwcAv{width:42px;height:42px;border-radius:50%;padding:2px;background:linear-gradient(135deg,var(--b),var(--a));flex:none;position:relative}',
    '.bwcAv svg,.bwcAv img{width:100%;height:100%;display:block;border-radius:50%;object-fit:cover;background:#0b1a2b}',
    '.bwcAv i{position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:var(--a);border:2px solid #0b1118}',
    '.bwcT{flex:1;min-width:0}.bwcT b{display:block;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bwcT span{display:block;font-size:11.5px;color:var(--mut);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bwcX{flex:none;width:40px;height:40px;border:0;border-radius:10px;background:transparent;cursor:pointer;display:grid;place-items:center;color:var(--mut);-webkit-tap-highlight-color:transparent}',
    '.bwcX:hover{background:rgba(255,255,255,.07);color:#fff}.bwcX:focus-visible{outline:2px solid var(--a)}',
    '.bwcX svg{width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}',
    '#bwcMsgs{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}',
    '.bwcM{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.5;overflow-wrap:anywhere;animation:bwcIn .25s ease both}',
    '@keyframes bwcIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.bwcM.bot{align-self:flex-start;background:#121b26;border:1px solid var(--line);border-bottom-left-radius:5px}',
    '.bwcM.me{align-self:flex-end;background:linear-gradient(135deg,var(--b),#0a8f9c);color:#fff;border-bottom-right-radius:5px;white-space:pre-wrap}',
    '.bwcM a{color:#5ec8ff;text-decoration:underline;text-underline-offset:2px}.bwcM b{color:#fff}',
    '.bwcM code{background:rgba(255,255,255,.09);padding:1px 5px;border-radius:5px;font-size:.9em}',
    '.bwcM ul{margin:.3em 0;padding-left:1.2em}.bwcM p{margin:0}.bwcM p+p,.bwcM p+ul,.bwcM ul+p{margin-top:.5em}',
    '.bwcTyp{display:flex;gap:4px;padding:13px 15px}.bwcTyp i{width:7px;height:7px;border-radius:50%;background:var(--mut);animation:bwcDot 1.2s infinite}',
    '.bwcTyp i:nth-child(2){animation-delay:.15s}.bwcTyp i:nth-child(3){animation-delay:.3s}',
    '@keyframes bwcDot{0%,60%,100%{transform:none;opacity:.4}30%{transform:translateY(-4px);opacity:1}}',
    '#bwcChips{flex:none;display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 10px}',
    '#bwcChips button{border:1px solid rgba(0,242,96,.35);background:rgba(0,242,96,.06);color:#c9ffe0;border-radius:99px;padding:8px 13px;font-size:13px;cursor:pointer;min-height:36px;-webkit-tap-highlight-color:transparent;transition:.15s}',
    '#bwcChips button:hover{background:rgba(0,242,96,.16)}',
    '#bwcForm{flex:none;display:flex;align-items:flex-end;gap:8px;padding:10px 12px;padding-bottom:max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#0b1118}',
    '#bwcIn{flex:1;min-width:0;resize:none;border:1px solid var(--line);background:#0f1620;color:var(--fg);border-radius:14px;padding:11px 13px;font-size:16px;line-height:1.35;font-family:inherit;max-height:110px;outline:none;-webkit-appearance:none}',
    '#bwcIn:focus{border-color:rgba(0,242,96,.55);box-shadow:0 0 0 3px rgba(0,242,96,.12)}#bwcIn::placeholder{color:#5d6b79}',
    '#bwcSend{flex:none;width:44px;height:44px;border:0;border-radius:50%;cursor:pointer;display:grid;place-items:center;background:linear-gradient(135deg,var(--b),var(--a));-webkit-tap-highlight-color:transparent;transition:opacity .15s,transform .15s}',
    '#bwcSend:disabled{opacity:.4;cursor:not-allowed}#bwcSend:not(:disabled):hover{transform:scale(1.06)}#bwcSend svg{width:20px;height:20px;fill:none;stroke:#04100a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '.bwcFoot{flex:none;text-align:center;font-size:10.5px;color:#4d5a67;padding:0 10px 8px;background:#0b1118}',
    /* phones: full-screen sheet */
    '@media(max-width:520px){',
    '  #bwcPanel{right:0;left:0;top:0;bottom:auto;width:100%;height:100vh;height:100dvh;border-radius:0;border:0;transform:translateY(24px)}',
    '  #bwcTip{display:none}',
    '  .bwcM{font-size:15px;max-width:90%}',
    '}',
    '@media(max-height:430px) and (orientation:landscape){#bwcPanel{width:min(420px,60vw);right:0;left:auto}.bwcFoot{display:none}#bwcChips{display:none}}',
    '@media(prefers-reduced-motion:reduce){#bwcFab::after,.bwcTyp i{animation:none}#bwcPanel,#bwcFab,.bwcM{transition:none;animation:none}}',
    'html.bwcLock{overflow:hidden}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  function avatar(id) {
    if (CFG.avatar) return '<img src="' + CFG.avatar.replace(/"/g, '') + '" alt="" width="48" height="48">';
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bwcg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b3d6e"/><stop offset="1" stop-color="#0a6b57"/></linearGradient></defs>' +
      '<circle cx="24" cy="24" r="24" fill="url(#bwcg' + id + ')"/>' +
      '<path d="M6 48c1-9 8.5-13.5 18-13.5S41 39 42 48z" fill="#0c1624"/>' +
      '<path d="M18.5 36.5L24 42l5.5-5.5" fill="#e9f6ff"/>' +
      '<path d="M20 29.5h8v5.5c-2.6 2.2-5.4 2.2-8 0z" fill="#e9b88f"/>' +
      '<ellipse cx="24" cy="21.5" rx="8.2" ry="9" fill="#f6cfa9"/>' +
      '<path d="M15.6 21.5c-.9-8 4-12.2 9.4-12 5.2.2 9.3 4.4 7.6 12.2-.8-3.8-2.6-5.9-5.4-6.7-3 1.2-8 1.2-11.6 6.5z" fill="#171b26"/>' +
      '<ellipse cx="20.7" cy="22.6" rx="1.05" ry="1.35" fill="#171b26"/><ellipse cx="27.3" cy="22.6" rx="1.05" ry="1.35" fill="#171b26"/>' +
      '<path d="M20.8 26.4c1.9 1.7 4.5 1.7 6.4 0" fill="none" stroke="#b5654a" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M14.6 21.5a9.4 9.4 0 0 1 18.8 0" fill="none" stroke="#00f260" stroke-width="1.6" stroke-linecap="round"/>' +
      '<rect x="12.6" y="20.5" width="3.4" height="6" rx="1.7" fill="#00f260"/><rect x="32" y="20.5" width="3.4" height="6" rx="1.7" fill="#00f260"/>' +
      '<path d="M33.7 26.5c0 3-3 4.2-6.2 4.2" fill="none" stroke="#00f260" stroke-width="1.3" stroke-linecap="round"/><circle cx="27" cy="30.7" r="1.3" fill="#e9f6ff"/></svg>';
  }
  var ICON_BOT = '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9.5 16.5h5"/><circle cx="12" cy="3.5" r="1"/></svg>';
  var ICON_CHAT = '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01"/></svg>';
  var root = document.createElement('div');
  root.id = 'bwc';
  root.innerHTML =
    '<div id="bwcTip">Ask me anything \ud83d\udc4b</div>' +
    '<button id="bwcFab" type="button" aria-label="Open AI chat assistant" aria-haspopup="dialog" aria-expanded="false">' + avatar('f') + '<i class="bwcDot"></i></button>' +
    '<section id="bwcPanel" role="dialog" aria-modal="false" aria-label="AI chat assistant">' +
      '<header class="bwcHead"><div class="bwcAv">' + avatar('h') + '<i></i></div>' +
        '<div class="bwcT"><b></b><span></span></div>' +
        '<button class="bwcX" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>' +
      '<div id="bwcMsgs" role="log" aria-live="polite"></div>' +
      '<div id="bwcChips"></div>' +
      '<form id="bwcForm" autocomplete="off">' +
        '<textarea id="bwcIn" rows="1" maxlength="500" aria-label="Your message"></textarea>' +
        '<button id="bwcSend" type="submit" aria-label="Send message" disabled><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
      '</form>' +
      '<div class="bwcFoot">AI can make mistakes. Check important details.</div>' +
    '</section>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var fab = $('#bwcFab'), panel = $('#bwcPanel'), msgs = $('#bwcMsgs'), chips = $('#bwcChips'),
      form = $('#bwcForm'), input = $('#bwcIn'), send = $('#bwcSend'), tip = $('#bwcTip');
  $('.bwcT b').textContent = CFG.title;
  $('.bwcT span').textContent = CFG.sub;
  input.placeholder = CFG.placeholder;

  /* ---------- helpers ---------- */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(text) {
    var h = esc(text);
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
         .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
         .replace(/(https?:\/\/[^\s<)]+[^\s<).,;!?])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    var out = [], list = false;
    h.split('\n').forEach(function (line) {
      var m = line.match(/^\s*[-*\u2022]\s+(.*)/);
      if (m) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + m[1] + '</li>'); }
      else { if (list) { out.push('</ul>'); list = false; } if (line.trim()) out.push('<p>' + line + '</p>'); }
    });
    if (list) out.push('</ul>');
    return out.join('');
  }
  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
  function add(role, text, save) {
    var d = document.createElement('div');
    d.className = 'bwcM ' + (role === 'user' ? 'me' : 'bot');
    if (role === 'user') d.textContent = text; else d.innerHTML = fmt(text);
    msgs.appendChild(d);
    scrollDown();
    if (save !== false) { history.push({ role: role, content: text }); persist(); }
    return d;
  }

  /* ---------- state (kept for the browser tab only) ---------- */
  var history = [], busy = false, KEY = 'bwChatHistory';
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-30))); } catch (e) {} }
  function restore() {
    try { var s = JSON.parse(sessionStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) return s; } catch (e) {}
    return [];
  }

  /* ---------- open / close ---------- */
  var isOpen = false, mq = window.matchMedia('(max-width:520px)'), vv = window.visualViewport;
  function fit() {                                   // keeps the sheet above the on-screen keyboard
    if (isOpen && mq.matches && vv) { panel.style.height = vv.height + 'px'; panel.style.top = vv.offsetTop + 'px'; }
    else { panel.style.height = ''; panel.style.top = ''; }
  }
  function open() {
    if (isOpen) return; isOpen = true;
    root.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); tip.classList.remove('show');
    if (mq.matches) document.documentElement.classList.add('bwcLock');
    fit(); scrollDown();
    if (!mq.matches) setTimeout(function () { input.focus(); }, 250);
  }
  function close() {
    if (!isOpen) return; isOpen = false;
    root.classList.remove('open'); fab.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('bwcLock'); fit(); fab.focus({ preventScroll: true });
  }
  fab.addEventListener('click', open);
  $('.bwcX').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
  if (vv) { vv.addEventListener('resize', function () { fit(); scrollDown(); }); vv.addEventListener('scroll', fit); }
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
    if (!mq.matches) document.documentElement.classList.remove('bwcLock'); else if (isOpen) document.documentElement.classList.add('bwcLock'); fit();
  });

  /* ---------- input ---------- */
  function sync() { send.disabled = busy || !input.value.trim(); input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }
  input.addEventListener('input', sync);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : submit(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
  function submit() { var t = input.value.trim(); if (!t || busy) return; input.value = ''; sync(); ask(t); }

  CFG.chips.forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = c;
    b.addEventListener('click', function () { ask(c); }); chips.appendChild(b);
  });

  /* ---------- talk to the backend ---------- */
  function ask(text) {
    if (busy) return; busy = true; sync();
    chips.style.display = 'none';
    add('user', text);
    var typing = document.createElement('div');
    typing.className = 'bwcM bot bwcTyp'; typing.innerHTML = '<i></i><i></i><i></i>';
    msgs.appendChild(typing); scrollDown();

    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
    fetch(CFG.api, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-10) }), signal: ctl ? ctl.signal : undefined
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j && j.error || 'http ' + r.status); return j; }); })
      .then(function (j) { if (!j.reply) throw new Error('empty'); return j.reply; })
      .catch(function (err) {
        var msg = String(err && err.message || '');
        if (/Too many/i.test(msg)) return msg;           // show rate-limit text as is
        return offlineReply(text);                       // anything else: graceful offline answer
      })
      .then(function (reply) {
        clearTimeout(timer); typing.remove(); add('assistant', reply);
      })
      .then(function () { busy = false; sync(); if (!mq.matches) input.focus(); });
  }

  /* ---------- boot ---------- */
  history = restore();
  if (history.length) { history.forEach(function (m) { add(m.role, m.content, false); }); chips.style.display = 'none'; }
  else add('assistant', CFG.greeting, false);
  setTimeout(function () { if (!isOpen && !history.length) { tip.classList.add('show'); setTimeout(function () { tip.classList.remove('show'); }, 5000); } }, 3500);
})();
