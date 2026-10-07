/*
 * Bé Học Chữ Số - logic ứng dụng
 * Màn hình, các trò chơi, giọng đọc, âm thanh, tiến độ và góc phụ huynh.
 * Dữ liệu nằm ở js/data.js.
 */

(function () {
  'use strict';
  /* ---------- tiện ích ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const today = () => {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  };

  /* ---------- lưu tiến độ trên máy ---------- */
  const KEY = 'beHocChuSo.v1';
  function load() {
    try {
      const s = localStorage.getItem(KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  }
  const S = Object.assign(
    {
      stars: 0,
      games: {},
      sound: true,
      limit: 0,
      unlockAll: false,
      voiceName: '',
      rate: 0.6,
      rateChosen: false,
      lsay: {},
      play: { d: '', s: 0 },
    },
    load() || {}
  );
  if (!S.rateChosen) S.rate = 0.6;
  if (!S.lsay) S.lsay = {};
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {}
  }
  function gs(id) {
    return S.games[id] || (S.games[id] = { stars: 0, rounds: 0 });
  }

  /* ---------- dữ liệu ---------- */
  function variants(L) {
    const b = LDEF[L];
    return Array.from(
      new Set(
        [b].concat(LEXTRA[L] || [], [
          b + ', ' + b,
          b + b.slice(-1),
          'chữ ' + L.toLowerCase() + ', ' + b,
        ])
      )
    );
  }
  /* bỏ các cách đọc đã lưu từ phiên bản cũ nếu không còn nằm trong danh sách hiện tại */
  Object.keys(S.lsay).forEach((k) => {
    if (!LDEF[k] || variants(k).indexOf(S.lsay[k]) < 0) delete S.lsay[k];
  });
  Object.assign(LNAME, S.lsay);
  /* ---------- âm thanh và giọng đọc ---------- */
  let AC = null;
  function ac() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (AC && AC.state === 'suspended') {
      try {
        AC.resume();
      } catch (e) {}
    }
    return AC;
  }
  function tone(f, t, d, type, v) {
    const c = ac();
    if (!c || !S.sound) return;
    try {
      const o = c.createOscillator(),
        g = c.createGain(),
        n = c.currentTime + t;
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f, n);
      g.gain.setValueAtTime(0.0001, n);
      g.gain.exponentialRampToValueAtTime(v || 0.18, n + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, n + d);
      o.connect(g);
      g.connect(c.destination);
      o.start(n);
      o.stop(n + d + 0.05);
    } catch (e) {}
  }
  const sfx = {
    ok() {
      tone(660, 0, 0.12);
      tone(880, 0.1, 0.12);
      tone(1320, 0.2, 0.2);
    },
    no() {
      tone(300, 0, 0.18, 'triangle');
      tone(240, 0.15, 0.25, 'triangle');
    },
    pop() {
      tone(520, 0, 0.08, 'square', 0.1);
      tone(780, 0.05, 0.1, 'square', 0.08);
    },
    tap() {
      tone(500, 0, 0.06, 'sine', 0.1);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25));
    },
  };
  let voice = null;
  function viVoices() {
    try {
      return speechSynthesis
        .getVoices()
        .filter((v) => /^vi([-_]|$)/i.test(v.lang) || /vi[eê]t/i.test(v.name));
    } catch (e) {
      return [];
    }
  }
  function findVoice() {
    const list = viVoices();
    voice =
      (S.voiceName && list.find((v) => v.name === S.voiceName)) ||
      list.find((v) => /premium|enhanced|nâng cao|google/i.test(v.name)) ||
      list[0] ||
      null;
  }
  try {
    speechSynthesis.onvoiceschanged = findVoice;
    findVoice();
  } catch (e) {}
  let speakTimer = 0,
    lastSay = { t: '', at: 0 };
  function say(t) {
    if (!S.sound || !('speechSynthesis' in window)) return;
    /* t có thể là một câu hoặc một danh sách câu đọc nối tiếp nhau */
    const key = Array.isArray(t) ? t.join('|') : t,
      now = Date.now();
    if (key === lastSay.t && now - lastSay.at < 1200) return;
    lastSay = { t: key, at: now };
    clearTimeout(speakTimer);
    try {
      /* Android hay đọc rớt hoặc lặp từ đầu câu nếu vừa ngắt vừa đọc ngay, nên chờ một chút sau khi ngắt */
      const busy = speechSynthesis.speaking || speechSynthesis.pending;
      if (busy) speechSynthesis.cancel();
      speakTimer = setTimeout(
        () => {
          (Array.isArray(t) ? t : [t]).forEach((x) => {
            try {
              const u = new SpeechSynthesisUtterance(x);
              u.lang = 'vi-VN';
              if (voice) u.voice = voice;
              u.rate = S.rate || 0.6;
              u.pitch = 1.05;
              speechSynthesis.speak(u);
            } catch (e) {}
          });
        },
        busy ? 250 : 80
      );
    } catch (e) {}
  }

  /* ---------- hẹn giờ có dọn dẹp ---------- */
  let cleanups = [];
  function clean() {
    cleanups.forEach((f) => {
      try {
        f();
      } catch (e) {}
    });
    cleanups = [];
    clearTimeout(speakTimer);
    try {
      speechSynthesis.cancel();
    } catch (e) {}
  }
  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    cleanups.push(() => clearTimeout(t));
    return t;
  }
  /* Chờ giọng đọc nói xong (và qua một khoảng tối thiểu) rồi mới chạy fn, để không ngắt ngang câu khen */
  function afterSpeech(fn, min) {
    const t0 = Date.now();
    function tick() {
      let sp = false;
      try {
        sp = speechSynthesis.speaking || speechSynthesis.pending;
      } catch (e) {}
      const el = Date.now() - t0;
      if ((!sp && el >= min) || el > 7000) fn();
      else later(tick, 150);
    }
    later(tick, 200);
  }
  function every(fn, ms) {
    const t = setInterval(fn, ms);
    cleanups.push(() => clearInterval(t));
  }

  function burst(node) {
    const fx = $('#fx');
    if (!fx || !node) return;
    const r = node.getBoundingClientRect(),
      cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    for (let i = 0; i < 9; i++) {
      const s = el('span', '', pick(['✨', '⭐', '🌟']));
      const a = (Math.PI * 2 * i) / 9,
        d = 50 + rnd(50);
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      fx.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  /* ---------- màn hình ---------- */
  const views = {};
  ['home', 'game', 'result', 'album', 'parent', 'learn'].forEach((id) => {
    views[id] = $('#' + id);
  });
  let curView = 'home',
    lastGame = null;
  function show(id) {
    for (const k in views) views[k].hidden = k !== id;
    curView = id;
    window.scrollTo(0, 0);
  }
  function goHome() {
    clean();
    renderHome();
    show('home');
  }

  const ISLANDS = [
    {
      id: 'so',
      name: 'Đảo Số',
      c: '#2279D4',
      t: '#E3F1FF',
      need: 0,
      games: ['dem', 'bong', 'tau'],
    },
    {
      id: 'chu',
      name: 'Đảo Chữ',
      c: '#E8503F',
      t: '#FFE9E6',
      need: 0,
      games: ['nghe', 'dau', 'chuot'],
    },
    {
      id: 'mau',
      name: 'Đảo Màu và Hình',
      c: '#7C4DDB',
      t: '#EFE8FF',
      need: 0,
      games: ['mau', 'to', 'hinh'],
    },
    {
      id: 'vat',
      name: 'Đảo Con Vật',
      c: '#23995B',
      t: '#E1F6EA',
      need: 0,
      games: ['vat', 'tonho'],
    },
    { id: 'nho', name: 'Đảo Trí Nhớ', c: '#D63F86', t: '#FFE6F1', need: 0, games: ['lat'] },
  ];
  const GAMES = {
    dem: { name: 'Đếm quả', icon: '🍎', run: gDem },
    bong: { name: 'Bóng bay số', icon: '🎈', run: gBong },
    tau: { name: 'Toa tàu số', icon: '🚂', run: gTau },
    nghe: { name: 'Nghe chọn chữ', icon: '👂', run: gNghe },
    dau: { name: 'Chữ đầu tiên', icon: '🔤', run: gDau },
    chuot: { name: 'Chuột thò đầu', icon: '🐹', run: gChuot },
    mau: { name: 'Chọn màu', icon: '🎨', run: gMau },
    to: { name: 'Tô màu', icon: '🖍️', run: gTo },
    hinh: { name: 'Hình khối', icon: '🔷', run: gHinh },
    vat: { name: 'Con gì đây', icon: '🐱', run: gVat },
    tonho: { name: 'To và nhỏ', icon: '🐘', run: gTonho },
    lat: { name: 'Lật thẻ', icon: '🃏', run: gLat },
  };
  const isLocked = () => false;

  function renderHome() {
    const h = views.home;
    h.innerHTML =
      '<header class="hh"><button class="mas" id="mas" type="button" aria-label="Gấu nói chuyện">' +
      MASCOT +
      '</button><div><h1>Bé Học Chữ Số</h1><div class="bubble">Chào bé! Mình cùng chơi nhé!</div></div></header>' +
      '<div class="bar"><span class="pill">⭐ <b>' +
      S.stars +
      '</b> sao</span><span class="sp"></span><button class="pill btn" type="button" data-nav="album">Sticker</button><button class="pill btn" type="button" data-nav="parent">Bố mẹ</button></div>' +
      '<div class="learn"><button type="button" data-learn="num"><span class="lb">1 2 3</span><span>Các số 1 đến 10</span></button><button type="button" data-learn="abc"><span class="lb">A B C</span><span>Các chữ cái</span></button><button type="button" data-learn="color"><span class="lb"><i class="dot" style="background:#E53935"></i><i class="dot" style="background:#FDD835"></i><i class="dot" style="background:#1E88E5"></i></span><span>Bảng màu sắc</span></button><button type="button" data-learn="shape"><span class="lb">△ ○ □</span><span>Bảng các hình</span></button></div>' +
      ISLANDS.map((i) => {
        const lk = isLocked(i);
        return (
          '<section class="island" style="--c:' +
          i.c +
          ';--t:' +
          i.t +
          '"><header><h2>' +
          i.name +
          '</h2>' +
          (lk ? '<span class="lk">🔒 Còn ' + (i.need - S.stars) + ' sao</span>' : '') +
          '</header><div class="tiles">' +
          i.games
            .map((g) => {
              const G = GAMES[g];
              return (
                '<button class="tile' +
                (lk ? ' locked' : '') +
                '" type="button" data-g="' +
                g +
                '" data-need="' +
                (lk ? i.need - S.stars : 0) +
                '"><span class="ico">' +
                G.icon +
                '</span><span class="nm">' +
                G.name +
                '</span><span class="gs">' +
                (gs(g).stars ? '★ ' + gs(g).stars : '&nbsp;') +
                '</span></button>'
              );
            })
            .join('') +
          '</div></section>'
        );
      }).join('');
  }

  function startGame(id) {
    clean();
    lastGame = id;
    show('game');
    const G = GAMES[id],
      v = views.game;
    v.innerHTML =
      '<header class="gbar"><button class="back" type="button" data-home>← Nhà</button><h2>' +
      G.name +
      '</h2><span class="pill">⭐ <b>' +
      S.stars +
      '</b></span></header><div class="stage" id="stage"></div>';
    G.run($('#stage'), id);
  }

  /* ---------- kết thúc một lượt ---------- */
  function finish(id, wrong) {
    clean();
    const earned = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;
    const g = gs(id),
      old = S.stars;
    S.stars += earned;
    g.stars += earned;
    g.rounds++;
    save();
    let extra = '';
    const a = Math.floor(old / 6),
      b = Math.floor(S.stars / 6);
    if (b > a) {
      const st = STICKERS[(b - 1) % STICKERS.length];
      extra +=
        '<div class="newst"><span>' + st[0] + '</span><p>Sticker mới: ' + st[1] + '!</p></div>';
    }
    ISLANDS.forEach((i) => {
      if (i.need > old && i.need <= S.stars)
        extra += '<p class="unl">Bé mở được ' + i.name + '!</p>';
    });
    views.result.innerHTML =
      '<div class="res">' +
      MASCOT +
      '<h2>Giỏi quá!</h2><div class="stars">' +
      [1, 2, 3]
        .map(
          (i) => '<span class="st' + (i <= earned ? ' on' : '') + '" style="--i:' + i + '">★</span>'
        )
        .join('') +
      '</div><p class="note">Bé được ' +
      earned +
      ' sao</p>' +
      extra +
      '<div class="btns"><button class="bbtn" type="button" id="again">Chơi tiếp</button><button class="bbtn alt" type="button" data-home>Về nhà</button></div></div>';
    show('result');
    $('#again').onclick = () => startGame(id);
    sfx.win();
    say('Giỏi quá! Được ' + NUM[earned] + ' sao' + (b > a ? '. Có sticker mới rồi!' : ''));
  }

  /* ---------- khung câu hỏi nhiều đáp án ---------- */
  function quiz(stage, id, gen) {
    const N = 5;
    let q = 0,
      wrong = 0,
      wn = 0,
      locked = false,
      d = null;
    function next() {
      if (q >= N) {
        finish(id, wrong);
        return;
      }
      q++;
      wn = 0;
      locked = false;
      d = gen();
      const dots = Array.from(
        { length: N },
        (_, i) => '<i class="' + (i < q - 1 ? 'on' : i === q - 1 ? 'cur' : '') + '"></i>'
      ).join('');
      stage.innerHTML =
        '<div class="prog">' +
        dots +
        '</div><button class="prompt" type="button">' +
        SPK +
        '<span>' +
        d.prompt +
        '</span></button><div class="visual">' +
        (d.visual || '') +
        '</div><div class="choices c' +
        d.choices.length +
        (d.cls ? ' ' + d.cls : '') +
        '">' +
        d.choices
          .map(
            (c) =>
              '<button type="button" class="choice' +
              (c.cls ? ' ' + c.cls : '') +
              '" data-ok="' +
              (c.ok ? 1 : 0) +
              '">' +
              c.html +
              '</button>'
          )
          .join('') +
        '</div>';
      $('.prompt', stage).onclick = () => say(d.say || d.prompt);
      stage.querySelectorAll('.choice').forEach((b) => {
        b.onclick = () => choose(b);
      });
      if (d.mount) d.mount(stage);
      say(d.say || d.prompt);
    }
    function choose(b) {
      if (locked) return;
      if (b.dataset.ok === '1') {
        locked = true;
        b.classList.add('good');
        sfx.ok();
        burst(b);
        say(d.praise || pick(PRAISE));
        afterSpeech(next, 900);
      } else {
        wrong++;
        wn++;
        b.classList.add('bad');
        sfx.no();
        say(pick(RETRY));
        later(() => b.classList.remove('bad'), 500);
        if (wn >= 2) {
          const g = stage.querySelector('.choice[data-ok="1"]');
          if (g) g.classList.add('hint');
        }
      }
    }
    next();
  }

  /* ---------- độ khó tăng dần theo số sao của từng trò ---------- */
  const numMax = () => 10;
  const letPool = () => LET;
  function numChoices(n, max) {
    const s = new Set([n]);
    const top = Math.max(max, 3);
    while (s.size < 3) s.add(1 + rnd(top));
    return shuffle(Array.from(s)).map((x) => ({
      ok: x === n,
      html: '<span class="big">' + x + '</span>',
    }));
  }
  function letChoices(t, pool, n) {
    const s = [t];
    while (s.length < n) {
      const c = pick(pool);
      if (s.indexOf(c) < 0) s.push(c);
    }
    return shuffle(s).map((x) => ({
      ok: x === t,
      html: '<span class="big">' + x[0] + ' ' + x[1] + '</span>',
    }));
  }

  /* ======== ĐẢO SỐ ======== */
  function gDem(stage, id) {
    quiz(stage, id, () => {
      const max = numMax(id, 5),
        n = 1 + rnd(max),
        f = pick(FRUITS);
      return {
        prompt: 'Có bao nhiêu ' + f[1] + '?',
        say: 'Chạm vào từng ' + f[1] + ' để đếm nhé. Có tất cả bao nhiêu?',
        praise: 'Đúng rồi, có ' + NUM[n] + ' ' + f[1],
        visual:
          '<div class="items">' +
          Array.from(
            { length: n },
            () => '<button type="button" class="it">' + f[0] + '</button>'
          ).join('') +
          '</div>',
        choices: numChoices(n, max),
        mount(root) {
          let c = 0;
          root.querySelectorAll('.it').forEach((b) => {
            b.onclick = () => {
              if (b.classList.contains('on')) return;
              b.classList.add('on');
              c++;
              b.insertAdjacentHTML('beforeend', '<i>' + c + '</i>');
              sfx.pop();
              say(NUM[c]);
            };
          });
        },
      };
    });
  }

  function gTau(stage, id) {
    quiz(stage, id, () => {
      const max = numMax(id, 6),
        s = 1 + rnd(max - 3),
        m = rnd(4);
      const seq = [s, s + 1, s + 2, s + 3],
        ans = seq[m];
      return {
        prompt: 'Toa nào còn thiếu số?',
        say: 'Đoàn tàu bị thiếu một toa. Số nào còn thiếu nhỉ?',
        praise: 'Đúng rồi, số ' + NUM[ans],
        visual:
          '<div class="train"><span class="loco">🚂</span>' +
          seq
            .map((x, i) =>
              i === m
                ? '<span class="wag q">?</span>'
                : '<span class="wag w' + i + '">' + x + '</span>'
            )
            .join('') +
          '</div>',
        choices: numChoices(ans, max),
      };
    });
  }

  function gBong(stage, id) {
    const N = 5,
      max = numMax(id, 5);
    let q = 0,
      wrong = 0,
      target = 1,
      busy = true;
    stage.innerHTML =
      '<div class="prog"></div><button class="prompt" type="button">' +
      SPK +
      '<span></span></button><div class="sky"></div>';
    const prog = $('.prog', stage),
      pr = $('.prompt span', stage),
      sky = $('.sky', stage);
    const cols = ['#E8503F', '#F2A100', '#23995B', '#2279D4', '#7C4DDB', '#D63F86'];
    const H = (sky.clientHeight || 420) + 130;
    const B = [];
    function otherNum() {
      let v;
      do {
        v = 1 + rnd(max);
      } while (v === target && max > 1);
      return v;
    }
    function setVal(b, v) {
      b.v = v;
      b.btn.textContent = v;
    }
    function relabel(b) {
      setVal(b, Math.random() < 0.35 ? target : otherNum());
    }
    cols.forEach((c, i) => {
      const w = el('div', 'balloon');
      w.style.left = i * 16 + 2 + '%';
      w.style.setProperty('--h', H + 'px');
      w.style.animationDuration = 8 + rnd(5) + 's';
      w.style.animationDelay = '-' + rnd(8) + 's';
      const btn = el('button', 'bb');
      btn.type = 'button';
      btn.style.setProperty('--c', c);
      w.appendChild(btn);
      sky.appendChild(w);
      const b = { w: w, btn: btn, v: 1 };
      B.push(b);
      w.addEventListener('animationiteration', () => relabel(b));
      btn.onclick = () => tap(b);
      setVal(b, 1 + rnd(max));
    });
    function dots() {
      prog.innerHTML = Array.from(
        { length: N },
        (_, i) => '<i class="' + (i < q - 1 ? 'on' : i === q - 1 ? 'cur' : '') + '"></i>'
      ).join('');
    }
    function newTarget() {
      if (q >= N) {
        finish(id, wrong);
        return;
      }
      q++;
      dots();
      busy = false;
      target = 1 + rnd(max);
      pr.textContent = 'Bắt bóng số ' + target;
      if (!B.some((b) => b.v === target)) {
        const low = B.slice().sort(
          (a, b) => b.w.getBoundingClientRect().top - a.w.getBoundingClientRect().top
        )[0];
        setVal(low, target);
      }
      say('Bắt bóng số ' + NUM[target]);
    }
    function tap(b) {
      if (busy) return;
      if (b.v === target) {
        busy = true;
        sfx.pop();
        burst(b.btn);
        b.btn.classList.add('pop');
        say(pick(PRAISE));
        later(() => {
          b.btn.classList.remove('pop');
          b.w.style.animation = 'none';
          void b.w.offsetWidth;
          b.w.style.animation = '';
          relabel(b);
        }, 400);
        afterSpeech(newTarget, 900);
      } else {
        wrong++;
        sfx.no();
        b.btn.classList.add('wob');
        later(() => b.btn.classList.remove('wob'), 450);
        say('Chưa đúng. Tìm số ' + NUM[target] + ' nhé');
      }
    }
    $('.prompt', stage).onclick = () => say('Bắt bóng số ' + NUM[target]);
    newTarget();
  }

  /* ======== ĐẢO CHỮ ======== */
  function gNghe(stage, id) {
    quiz(stage, id, () => {
      const pool = letPool(id),
        t = pick(pool),
        n = 3,
        nm = LNAME[t[0]];
      return {
        prompt: 'Chữ ' + nm + ' đâu nhỉ?',
        say: 'Chữ ' + nm + ' đâu nhỉ?',
        praise: 'Đúng rồi, chữ ' + nm,
        choices: letChoices(t, pool, n),
        visual: '<span class="big" style="font-size:4.5rem">🔊</span>',
      };
    });
  }

  function gDau(stage, id) {
    const letters = Array.from(new Set(WORDS.map((w) => w[2])));
    quiz(stage, id, () => {
      const w = pick(WORDS),
        t = LET.find((x) => x[0] === w[2]);
      const pool = LET.filter((x) => letters.indexOf(x[0]) >= 0);
      return {
        prompt: cap(w[1]) + ' bắt đầu bằng chữ nào?',
        say: cap(w[1]) + ' bắt đầu bằng chữ nào?',
        praise: 'Đúng rồi, ' + w[1] + ' bắt đầu bằng chữ ' + LNAME[t[0]],
        visual: '<div class="pic"><span>' + w[0] + '</span><b>' + w[1] + '</b></div>',
        choices: letChoices(t, pool, 3),
      };
    });
  }

  function gChuot(stage, id) {
    const N = 5,
      pool = letPool(id);
    let q = 0,
      wrong = 0,
      target = pool[0],
      busy = true,
      tick = 0;
    stage.innerHTML =
      '<div class="prog"></div><button class="prompt" type="button">' +
      SPK +
      '<span></span></button><div class="holes">' +
      Array.from(
        { length: 6 },
        () =>
          '<button type="button" class="hole"><span class="pop"><span class="ham">🐹</span><b></b></span></button>'
      ).join('') +
      '</div>';
    const prog = $('.prog', stage),
      pr = $('.prompt span', stage);
    const L = Array.from(stage.querySelectorAll('.hole')).map((h) => ({
      h: h,
      b: $('b', h),
      v: null,
      t: 0,
    }));
    function dots() {
      prog.innerHTML = Array.from(
        { length: N },
        (_, i) => '<i class="' + (i < q - 1 ? 'on' : i === q - 1 ? 'cur' : '') + '"></i>'
      ).join('');
    }
    function hide(x) {
      x.h.classList.remove('up');
      x.v = null;
      x.t = 0;
    }
    function pop(x, v) {
      x.v = v;
      x.t = ++tick;
      const k = x.t;
      x.b.textContent = v[0];
      x.h.classList.add('up');
      later(() => {
        if (x.t === k) hide(x);
      }, 2600);
    }
    function newTarget() {
      if (q >= N) {
        finish(id, wrong);
        return;
      }
      q++;
      dots();
      L.forEach(hide);
      target = pick(pool);
      busy = false;
      pr.textContent = 'Tìm chữ ' + target[0] + ' ' + target[1];
      say('Chữ ' + LNAME[target[0]] + ' đâu nhỉ?');
    }
    function spawn() {
      if (busy) return;
      const up = L.filter((x) => x.v),
        free = L.filter((x) => !x.v);
      if (up.length >= 3 || !free.length) return;
      const hasT = up.some((u) => u.v === target);
      pop(pick(free), !hasT && Math.random() < 0.7 ? target : pick(pool));
    }
    L.forEach((x) => {
      x.h.onclick = () => {
        if (busy || !x.v) return;
        if (x.v === target) {
          busy = true;
          sfx.ok();
          burst(x.h);
          x.h.classList.add('yay');
          say(pick(PRAISE));
          afterSpeech(() => {
            x.h.classList.remove('yay');
            newTarget();
          }, 900);
        } else {
          wrong++;
          sfx.no();
          x.h.classList.add('bad');
          later(() => x.h.classList.remove('bad'), 450);
          say('Chưa đúng. Tìm chữ ' + LNAME[target[0]] + ' nhé');
        }
      };
    });
    $('.prompt', stage).onclick = () => say('Chữ ' + LNAME[target[0]] + ' đâu nhỉ?');
    every(spawn, 950);
    newTarget();
  }

  /* ======== ĐẢO MÀU VÀ HÌNH ======== */
  function gMau(stage, id) {
    quiz(stage, id, () => {
      const pool = COLORS;
      const three = sample(pool, 3),
        t = pick(three);
      return {
        prompt: 'Chạm vào màu ' + t[0],
        say: 'Chạm vào màu ' + t[0],
        praise: 'Đúng rồi, màu ' + t[0],
        choices: three.map((c) => ({
          ok: c === t,
          html: '<i class="blob" style="background:' + c[1] + '"></i>',
        })),
      };
    });
  }

  function shapeSvg(sh, color) {
    return (
      '<svg class="shape" viewBox="0 0 100 100" fill="' +
      color +
      '" stroke="#1E2A4F" stroke-width="5" stroke-linejoin="round" aria-hidden="true">' +
      sh[2] +
      '</svg>'
    );
  }
  function gHinh(stage, id) {
    quiz(stage, id, () => {
      const pool = SHAPES;
      const three = sample(pool, 3),
        t = pick(three),
        cs = sample(COLORS, 3);
      return {
        prompt: 'Đâu là ' + t[1] + '?',
        say: 'Đâu là ' + t[1] + '?',
        praise: 'Đúng rồi, đây là ' + t[1],
        choices: three.map((s, i) => ({ ok: s === t, html: shapeSvg(s, cs[i][1]) })),
      };
    });
  }

  function gTo(stage, id) {
    let pi = 0,
      col = COLORTABLE[0],
      filled = new Set();
    function draw() {
      filled = new Set();
      stage.innerHTML =
        '<button class="prompt" type="button">' +
        SPK +
        '<span>Chọn màu rồi chạm vào hình để tô</span></button>' +
        '<div class="chips pics">' +
        PICS.map(
          (p, i) =>
            '<button type="button" class="chip' +
            (i === pi ? ' on' : '') +
            '" data-p="' +
            i +
            '">' +
            p.name +
            '</button>'
        ).join('') +
        '</div>' +
        '<div class="canvas"><svg viewBox="0 0 300 300" role="img" aria-label="Hình ' +
        PICS[pi].name +
        ' để tô màu">' +
        PICS[pi].svg +
        '</svg></div><div class="pal">' +
        COLORTABLE.map(
          (c, i) =>
            '<button type="button" class="sw' +
            (c === col ? ' on' : '') +
            '" data-i="' +
            i +
            '" style="background:' +
            c[1] +
            '" aria-label="Màu ' +
            c[0] +
            '"></button>'
        ).join('') +
        '</div><div class="row2"><button class="bbtn" type="button" id="dn">Xong rồi</button></div>';
      $('.prompt', stage).onclick = () => say('Chọn màu rồi chạm vào hình để tô nhé');
      stage.querySelectorAll('.sw').forEach((b) => {
        b.onclick = () => {
          col = COLORTABLE[+b.dataset.i];
          stage.querySelectorAll('.sw').forEach((x) => x.classList.toggle('on', x === b));
          sfx.tap();
          say('Màu ' + col[0]);
        };
      });
      stage.querySelectorAll('.r').forEach((r, i) => {
        r.onclick = () => {
          r.style.fill = col[1];
          filled.add(i);
          sfx.pop();
        };
      });
      stage.querySelectorAll('[data-p]').forEach((b) => {
        b.onclick = () => {
          pi = +b.dataset.p;
          sfx.tap();
          draw();
          say('Hình ' + PICS[pi].name);
        };
      });
      $('#dn').onclick = () => {
        if (filled.size < 3) {
          say('Tô thêm một chút nữa nhé');
          sfx.no();
          return;
        }
        finish(id, 1);
      };
    }
    draw();
    say('Chọn màu rồi chạm vào hình để tô nhé');
  }

  /* ======== ĐẢO CON VẬT ======== */
  function gVat(stage, id) {
    quiz(stage, id, () => {
      const three = sample(ANIM, 3),
        t = pick(three);
      const bySound = t[2] && Math.random() < 0.4;
      const p = bySound ? 'Con nào kêu ' + t[2] + '?' : 'Đâu là con ' + t[1] + '?';
      return {
        prompt: p,
        say: p,
        praise: 'Đúng rồi, con ' + t[1],
        choices: three.map((a) => ({ ok: a === t, html: '<span class="big">' + a[0] + '</span>' })),
      };
    });
  }

  function gTonho(stage, id) {
    quiz(stage, id, () => {
      const mode = pick(['size', 'count', 'len']);
      if (mode === 'size') {
        const a = pick(ANIM),
          big = Math.random() < 0.5,
          left = Math.random() < 0.5;
        const sizes = left ? [4.4, 2.2] : [2.2, 4.4];
        const want = big ? 4.4 : 2.2;
        const p = 'Con nào ' + (big ? 'to' : 'nhỏ') + ' hơn?';
        return {
          prompt: p,
          say: p,
          praise: 'Đúng rồi!',
          choices: sizes.map((s) => ({
            ok: s === want,
            html: '<span style="font-size:' + s + 'rem;line-height:1">' + a[0] + '</span>',
          })),
        };
      }
      if (mode === 'count') {
        const max = 8;
        const n1 = 1 + rnd(max);
        let n2;
        do {
          n2 = 1 + rnd(max);
        } while (n2 === n1);
        const f = pick(FRUITS)[0],
          more = Math.random() < 0.5;
        const want = more ? Math.max(n1, n2) : Math.min(n1, n2);
        const p = 'Bên nào ' + (more ? 'nhiều' : 'ít') + ' hơn?';
        return {
          prompt: p,
          say: p,
          praise: 'Đúng rồi!',
          cls: 'c2',
          choices: [n1, n2].map((n) => ({
            ok: n === want,
            cls: 'grp',
            html: Array.from({ length: n }, () => '<span>' + f + '</span>').join(''),
          })),
        };
      }
      const w1 = 28 + rnd(14),
        w2 = 62 + rnd(30),
        longer = Math.random() < 0.5,
        flip = Math.random() < 0.5;
      const ws = flip ? [w2, w1] : [w1, w2],
        want = longer ? w2 : w1,
        cs = sample(COLORS, 2);
      const p = 'Cái nào ' + (longer ? 'dài' : 'ngắn') + ' hơn?';
      return {
        prompt: p,
        say: p,
        praise: 'Đúng rồi!',
        choices: ws.map((w, i) => ({
          ok: w === want,
          cls: 'barc',
          html: '<span class="bar-l" style="width:' + w + '%;background:' + cs[i][1] + '"></span>',
        })),
      };
    });
  }

  /* ======== ĐẢO TRÍ NHỚ ======== */
  function gLat(stage, id) {
    const g = gs(id),
      n = g.rounds < 2 ? 3 : g.rounds < 4 ? 4 : 6,
      kind = ['num', 'let', 'ani'][g.rounds % 3];
    let faces;
    if (kind === 'num')
      faces = sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n).map((x) => ({
        k: 'n' + x,
        h: '<b class="mf">' + x + '</b>',
        s: NUM[x],
      }));
    else if (kind === 'let')
      faces = sample(LET, n).map((x) => ({
        k: x[0],
        h: '<b class="mf">' + x[0] + '</b>',
        s: 'chữ ' + LNAME[x[0]],
      }));
    else
      faces = sample(ANIM, n).map((x) => ({
        k: x[1],
        h: '<span class="mf em">' + x[0] + '</span>',
        s: 'con ' + x[1],
      }));
    const cards = shuffle(faces.concat(faces));
    const lab = { num: 'số', let: 'chữ', ani: 'con vật' }[kind];
    const p = 'Tìm hai ' + lab + ' giống nhau';
    stage.innerHTML =
      '<button class="prompt" type="button">' +
      SPK +
      '<span>' +
      p +
      '</span></button><div class="grid" style="--cols:' +
      (n === 3 ? 3 : 4) +
      '">' +
      cards
        .map(
          (c) =>
            '<button type="button" class="mcard"><span class="in"><span class="bk">?</span><span class="fr">' +
            c.h +
            '</span></span></button>'
        )
        .join('') +
      '</div>';
    $('.prompt', stage).onclick = () => say(p);
    const B = Array.from(stage.querySelectorAll('.mcard'));
    let a = -1,
      lock = false,
      ok = 0,
      miss = 0;
    B.forEach((b, i) => {
      b.onclick = () => {
        if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
        b.classList.add('up');
        sfx.tap();
        say(cards[i].s);
        if (a < 0) {
          a = i;
          return;
        }
        const j = a;
        a = -1;
        if (cards[j].k === cards[i].k) {
          ok++;
          B[j].classList.add('done');
          B[i].classList.add('done');
          later(() => {
            sfx.ok();
            burst(b);
          }, 350);
          if (ok === n) {
            lock = true;
            afterSpeech(() => finish(id, Math.floor(miss / 2)), 1000);
          }
        } else {
          miss++;
          lock = true;
          later(() => {
            B[j].classList.remove('up');
            B[i].classList.remove('up');
            lock = false;
          }, 1000);
        }
      };
    });
    say(p);
  }

  /* ======== CÁC BẢNG: SỐ, CHỮ CÁI, MÀU SẮC, HÌNH ======== */
  function learnWord(L) {
    return WORDS.find((w) => w[2] === L) || null;
  }
  const LEARN_FIRST = { num: 1, abc: 'A', color: 0, shape: 0 };
  function shapeItems() {
    return SHAPES.map((s, i) => ({
      n: s[1],
      svg: shapeSvg(s, SHAPE_CLR[i % SHAPE_CLR.length]),
    })).concat(
      PICT.map((p) => ({
        n: p[0],
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true">' + p[1] + '</svg>',
      }))
    );
  }
  function renderLearn(kind, sel) {
    let card,
      grid,
      title,
      all,
      cls = '';
    if (kind === 'num') {
      const n = +sel || 1;
      title = 'Các số 1 đến 10';
      card =
        '<button type="button" class="lcard" data-lk="num:' +
        n +
        '"><span class="lbig">' +
        n +
        '</span><b>' +
        NUM[n] +
        '</b><span class="lrow">' +
        '🍎'.repeat(n) +
        '</span></button>';
      grid = Array.from(
        { length: 10 },
        (_, i) =>
          '<button type="button" class="lbtn' +
          (i + 1 === n ? ' on' : '') +
          '" data-lk="num:' +
          (i + 1) +
          '">' +
          (i + 1) +
          '</button>'
      ).join('');
      all = '<button type="button" class="bbtn" data-lall="num">Đọc từ 1 đến 10</button>';
    } else if (kind === 'abc') {
      const L = sel || 'A',
        x = LET.find((z) => z[0] === L) || LET[0],
        w = learnWord(x[0]);
      title = 'Các chữ cái';
      card =
        '<button type="button" class="lcard" data-lk="abc:' +
        x[0] +
        '"><span class="lbig">' +
        x[0] +
        ' ' +
        x[1] +
        '</span><b>Đọc là: ' +
        LNAME[x[0]] +
        '</b>' +
        (w ? '<span class="lrow">' + w[0] + ' ' + w[1] + '</span>' : '') +
        '</button>';
      grid = LET.map(
        (z) =>
          '<button type="button" class="lbtn' +
          (z[0] === x[0] ? ' on' : '') +
          '" data-lk="abc:' +
          z[0] +
          '">' +
          z[0] +
          '</button>'
      ).join('');
      all = '<button type="button" class="bbtn" data-lall="abc">Đọc cả bảng chữ cái</button>';
    } else if (kind === 'color') {
      const i = Math.min(+sel || 0, COLORTABLE.length - 1),
        c = COLORTABLE[i];
      title = 'Bảng màu sắc';
      cls = ' c4';
      card =
        '<button type="button" class="lcard" data-lk="color:' +
        i +
        '"><i class="lcol" style="background:' +
        c[1] +
        '"></i><b>Màu ' +
        c[0] +
        '</b><span class="lrow">' +
        c[2] +
        ' ' +
        c[3] +
        '</span></button>';
      grid = COLORTABLE.map(
        (z, j) =>
          '<button type="button" class="lbtn cb' +
          (j === i ? ' on' : '') +
          '" data-lk="color:' +
          j +
          '" aria-label="Màu ' +
          z[0] +
          '"><i style="background:' +
          z[1] +
          '"></i><small>' +
          z[0] +
          '</small></button>'
      ).join('');
      all = '<button type="button" class="bbtn" data-lall="color">Đọc tất cả các màu</button>';
    } else {
      const items = shapeItems(),
        i = Math.min(+sel || 0, items.length - 1),
        it = items[i];
      title = 'Bảng các hình';
      cls = ' c4';
      card =
        '<button type="button" class="lcard" data-lk="shape:' +
        i +
        '"><span class="lsvg">' +
        it.svg +
        '</span><b>' +
        cap(it.n) +
        '</b></button>';
      grid = items
        .map(
          (z, j) =>
            '<button type="button" class="lbtn sb' +
            (j === i ? ' on' : '') +
            '" data-lk="shape:' +
            j +
            '" aria-label="' +
            z.n +
            '"><span class="msvg">' +
            z.svg +
            '</span></button>'
        )
        .join('');
      all = '<button type="button" class="bbtn" data-lall="shape">Đọc tất cả các hình</button>';
    }
    views.learn.innerHTML =
      '<header class="gbar"><button class="back" type="button" data-home>← Nhà</button><h2>' +
      title +
      '</h2><span></span></header>' +
      card +
      '<div class="lgrid' +
      cls +
      '">' +
      grid +
      '</div><div class="row2">' +
      all +
      '</div>';
  }
  function speakLearn(kind, v) {
    if (kind === 'num') {
      say(NUM[+v]);
      return;
    }
    if (kind === 'color') {
      say('Màu ' + COLORTABLE[+v][0]);
      return;
    }
    if (kind === 'shape') {
      say(shapeItems()[+v].n);
      return;
    }
    const w = learnWord(v);
    /* không đọc lặp khi từ minh họa trùng với tên chữ, ví dụ chữ Ô và cái ô */
    say(LNAME[v] + (w && w[1] !== LNAME[v] ? ', ' + w[1] : ''));
  }
  function learnAll(kind) {
    if (kind === 'num') return NUM.slice(1);
    if (kind === 'color') return COLORTABLE.map((c) => 'màu ' + c[0]);
    if (kind === 'shape') return shapeItems().map((s) => s.n);
    return LET.map((x) => LNAME[x[0]]);
  }

  /* ======== ALBUM STICKER ======== */
  function renderAlbum() {
    const n = Math.min(STICKERS.length, Math.floor(S.stars / 6));
    views.album.innerHTML =
      '<header class="gbar"><button class="back" type="button" data-home>← Nhà</button><h2>Album sticker</h2><span class="pill">⭐ ' +
      S.stars +
      '</span></header><p class="note">Cứ 6 sao bé được thêm một sticker.</p><div class="stk">' +
      STICKERS.map((s, i) =>
        i < n
          ? '<button type="button" class="s" data-st="' +
            i +
            '"><span>' +
            s[0] +
            '</span><small>' +
            s[1] +
            '</small></button>'
          : '<div class="s off"><span>?</span><small>Còn ' +
            ((i + 1) * 6 - S.stars) +
            ' sao</small></div>'
      ).join('') +
      '</div>';
  }

  /* ======== GÓC PHỤ HUYNH ======== */
  function gate(onOk) {
    const a = 4 + rnd(6),
      b = 3 + rnd(6),
      ans = a + b,
      set = new Set([ans]);
    while (set.size < 4) set.add(ans + rnd(9) - 4);
    set.delete(0);
    while (set.size < 4) set.add(ans + 5 + rnd(4));
    const o = $('#gate');
    o.hidden = false;
    o.innerHTML =
      '<div class="sheet"><h3>Dành cho bố mẹ</h3><p>Trả lời phép tính để vào: <b>' +
      a +
      ' + ' +
      b +
      ' = ?</b></p><div class="opts">' +
      shuffle(Array.from(set))
        .map((x) => '<button type="button" class="chip" data-v="' + x + '">' + x + '</button>')
        .join('') +
      '</div><button type="button" class="chip" id="gx">Quay lại</button></div>';
    o.onclick = (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.id === 'gx') {
        o.hidden = true;
        return;
      }
      if (+t.dataset.v === ans) {
        o.hidden = true;
        onOk();
      } else {
        t.style.background = 'var(--bad)';
        t.animate &&
          t.animate(
            [
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(0)' },
            ],
            { duration: 250 }
          );
      }
    };
  }
  function openParent() {
    clean();
    renderParent();
    show('parent');
  }
  let wipeArm = false;
  function voiceCard() {
    findVoice();
    const list = viVoices();
    const status = list.length
      ? '<p>Đã tìm thấy giọng tiếng Việt trên máy. Đang dùng: <b>' +
        (voice ? voice.name : 'giọng mặc định') +
        '</b>.</p>'
      : '<p><b>Máy này chưa có giọng tiếng Việt</b>, nên app đang đọc bằng giọng khác và sẽ phát âm sai.</p><small>Samsung: Cài đặt, Quản lý chung, Chuyển văn bản thành giọng nói, chọn bộ máy "Google" (cài Google Text-to-speech nếu chưa có), bấm biểu tượng bánh răng, Cài đặt dữ liệu giọng nói, tải Tiếng Việt. Nếu đang mở bằng Samsung Internet, thử mở lại bằng Chrome. iPhone: Cài đặt, Trợ năng, Nội dung được đọc, Giọng nói, Tiếng Việt, tải bản Nâng cao. Sau khi tải xong, đóng hẳn trình duyệt rồi mở lại.</small>';
    const vchips =
      list.length > 1
        ? '<div class="chips">' +
          list
            .map(
              (v, i) =>
                '<button type="button" class="chip' +
                (voice && v.name === voice.name ? ' on' : '') +
                '" data-voice="' +
                i +
                '">' +
                v.name +
                '</button>'
            )
            .join('') +
          '</div>'
        : '';
    return (
      '<div class="pv"><h3>Âm thanh và giọng đọc</h3>' +
      status +
      vchips +
      '<div class="chips"><button type="button" class="chip' +
      (S.sound ? ' on' : '') +
      '" data-act="snd">' +
      (S.sound ? 'Đang bật' : 'Đang tắt') +
      '</button></div>' +
      '<p>Tốc độ đọc</p><div class="chips">' +
      [
        [0.45, 'Rất chậm'],
        [0.6, 'Chậm'],
        [0.85, 'Vừa'],
      ]
        .map(
          (x) =>
            '<button type="button" class="chip' +
            (S.rate === x[0] ? ' on' : '') +
            '" data-rate="' +
            x[0] +
            '">' +
            x[1] +
            '</button>'
        )
        .join('') +
      '</div>' +
      '<p>Nghe thử</p><div class="chips"><button type="button" class="chip" data-act="voice">Câu chào</button><button type="button" class="chip" data-act="abc">Bảng chữ cái</button><button type="button" class="chip" data-act="nums">Số 1 đến 10</button></div>' +
      toolCard() +
      '</div>'
    );
  }
  let toolL = '';
  function toolCard() {
    let h =
      '<p>Chỉnh cách đọc từng chữ</p><div class="chips">' +
      LET.map(
        (x) =>
          '<button type="button" class="chip' +
          (toolL === x[0] ? ' on' : '') +
          '" data-tl="' +
          x[0] +
          '">' +
          x[0] +
          (S.lsay[x[0]] ? ' ✓' : '') +
          '</button>'
      ).join('') +
      '</div>';
    if (toolL) {
      h +=
        '<p>Chữ ' +
        toolL +
        ': bấm từng cách để nghe. Cách bấm sau cùng sẽ được lưu.</p><div class="chips">' +
        variants(toolL)
          .map(
            (v, i) =>
              '<button type="button" class="chip' +
              (LNAME[toolL] === v ? ' on' : '') +
              '" data-tv="' +
              i +
              '">' +
              v +
              '</button>'
          )
          .join('') +
        '<button type="button" class="chip" data-act="tlreset">Về mặc định</button></div>';
    }
    return h;
  }
  function renderParent() {
    const rows = Object.keys(GAMES)
      .map((id) => {
        const g = gs(id);
        return (
          '<div class="row"><span>' +
          GAMES[id].icon +
          ' ' +
          GAMES[id].name +
          '</span><span>' +
          g.rounds +
          ' lượt · ' +
          g.stars +
          ' sao</span></div>'
        );
      })
      .join('');
    views.parent.innerHTML =
      '<header class="gbar"><button class="back" type="button" data-home>← Nhà</button><h2>Góc phụ huynh</h2><span></span></header>' +
      '<div class="pv"><h3>Tiến độ của bé</h3><p>Tổng cộng ' +
      S.stars +
      ' sao. Hôm nay bé đã chơi ' +
      Math.floor(S.play.s / 60) +
      ' phút.</p>' +
      rows +
      '</div>' +
      '<div class="pv"><h3>Giới hạn thời gian chơi mỗi ngày</h3><div class="chips">' +
      [
        [0, 'Không giới hạn'],
        [10, '10 phút'],
        [15, '15 phút'],
        [20, '20 phút'],
        [30, '30 phút'],
      ]
        .map(
          (x) =>
            '<button type="button" class="chip' +
            (S.limit === x[0] ? ' on' : '') +
            '" data-lim="' +
            x[0] +
            '">' +
            x[1] +
            '</button>'
        )
        .join('') +
      '</div><button type="button" class="bbtn alt" data-act="more">Cho chơi thêm 10 phút</button></div>' +
      voiceCard() +
      '<div class="pv"><h3>Xóa tiến độ</h3><button type="button" class="bbtn alt" data-act="wipe">' +
      (wipeArm ? 'Bấm lần nữa để xóa hẳn' : 'Xóa sao và sticker') +
      '</button><small>Tiến độ chỉ lưu trong trình duyệt trên máy này. Đổi máy hoặc xóa dữ liệu trình duyệt thì sẽ mất.</small></div>';
  }

  /* ---------- nghỉ ngơi khi hết giờ ---------- */
  function showRest() {
    clean();
    const r = $('#rest');
    r.hidden = false;
    r.innerHTML =
      '<div class="sheet">' +
      MASCOT +
      '<h3>Nghỉ mắt thôi nào!</h3><p>Hôm nay bé đã chơi đủ rồi. Hẹn bé ngày mai nhé.</p><button type="button" class="bbtn" id="rp">Nhờ bố mẹ</button></div>';
    $('#rp').onclick = () =>
      gate(() => {
        r.hidden = true;
        openParent();
      });
    say('Nghỉ mắt thôi nào. Hẹn ngày mai nhé');
  }
  setInterval(() => {
    if (document.hidden) return;
    const t = today();
    if (S.play.d !== t) S.play = { d: t, s: 0 };
    S.play.s += 5;
    save();
    if (
      S.limit &&
      S.play.s >= S.limit * 60 &&
      curView !== 'parent' &&
      $('#rest').hidden &&
      $('#gate').hidden
    )
      showRest();
  }, 5000);

  /* ---------- sự kiện chung ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-home]')) {
      goHome();
      return;
    }
    const tile = t.closest('.tile');
    if (tile) {
      ac();
      const need = +tile.dataset.need;
      if (need > 0) {
        sfx.no();
        say('Kiếm thêm ' + need + ' sao nữa để mở đảo này nhé');
        return;
      }
      sfx.tap();
      startGame(tile.dataset.g);
      return;
    }
    if (t.closest('#mas')) {
      ac();
      sfx.pop();
      say('Xin chào! Mình cùng chơi nhé!');
      return;
    }
    const ln = t.closest('[data-learn]');
    if (ln) {
      ac();
      clean();
      const k = ln.dataset.learn;
      renderLearn(k, LEARN_FIRST[k]);
      show('learn');
      sfx.tap();
      speakLearn(k, LEARN_FIRST[k]);
      return;
    }
    const lk = t.closest('[data-lk]');
    if (lk) {
      ac();
      const p = lk.dataset.lk.split(':');
      renderLearn(p[0], p[1]);
      sfx.pop();
      speakLearn(p[0], p[1]);
      return;
    }
    const la = t.closest('[data-lall]');
    if (la) {
      ac();
      sfx.tap();
      say(learnAll(la.dataset.lall));
      return;
    }
    const nav = t.closest('[data-nav]');
    if (nav) {
      ac();
      if (nav.dataset.nav === 'album') {
        clean();
        renderAlbum();
        show('album');
      } else gate(openParent);
      return;
    }
    const st = t.closest('[data-st]');
    if (st) {
      const s = STICKERS[+st.dataset.st];
      sfx.pop();
      say(s[1]);
      return;
    }
    const lim = t.closest('[data-lim]');
    if (lim) {
      S.limit = +lim.dataset.lim;
      save();
      renderParent();
      return;
    }
    const vc = t.closest('[data-voice]');
    if (vc) {
      const v = viVoices()[+vc.dataset.voice];
      if (v) {
        S.voiceName = v.name;
        save();
        findVoice();
        renderParent();
        ac();
        say('Xin chào! Mình cùng học nhé!');
      }
      return;
    }
    const rt = t.closest('[data-rate]');
    if (rt) {
      S.rate = +rt.dataset.rate;
      S.rateChosen = true;
      save();
      renderParent();
      ac();
      say('Xin chào! Mình cùng học nhé!');
      return;
    }
    const tl = t.closest('[data-tl]');
    if (tl) {
      toolL = tl.dataset.tl;
      renderParent();
      ac();
      say('Chữ ' + LNAME[toolL]);
      return;
    }
    const tv = t.closest('[data-tv]');
    if (tv && toolL) {
      const v = variants(toolL)[+tv.dataset.tv];
      S.lsay[toolL] = v;
      LNAME[toolL] = v;
      save();
      renderParent();
      ac();
      say(v);
      return;
    }
    const act = t.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'tlreset' && toolL) {
        delete S.lsay[toolL];
        LNAME[toolL] = LDEF[toolL];
        save();
        renderParent();
        ac();
        say('Chữ ' + LNAME[toolL]);
        return;
      }
      if (a === 'abc') {
        ac();
        say(LET.map((x) => LNAME[x[0]]));
        return;
      }
      if (a === 'nums') {
        ac();
        say(NUM.slice(1));
        return;
      }
      if (a === 'more') {
        S.play.s = Math.max(0, S.play.s - 600);
        save();
        renderParent();
      } else if (a === 'snd') {
        S.sound = !S.sound;
        save();
        renderParent();
      } else if (a === 'voice') {
        ac();
        say('Xin chào! Mình cùng học nhé!');
      } else if (a === 'unlock') {
        S.unlockAll = !S.unlockAll;
        save();
        renderParent();
      } else if (a === 'wipe') {
        if (!wipeArm) {
          wipeArm = true;
          renderParent();
          setTimeout(() => {
            wipeArm = false;
            if (curView === 'parent') renderParent();
          }, 4000);
        } else {
          wipeArm = false;
          S.stars = 0;
          S.games = {};
          S.unlockAll = false;
          save();
          renderParent();
        }
      }
    }
  });

  renderHome();
  show('home');
})();
