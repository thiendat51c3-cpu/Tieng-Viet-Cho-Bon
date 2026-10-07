/*
 * Bé Học Chữ Số - dữ liệu nội dung
 * Số, chữ cái, từ vựng, màu sắc, hình khối, sticker, tranh tô màu.
 * Tệp này nạp trước js/app.js; các hằng số ở đây dùng chung cho app.
 */

'use strict';

/* ---------- Dữ liệu nội dung ---------- */
const NUM = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
const LET = [
  ['A', 'a'],
  ['Ă', 'ă'],
  ['Â', 'â'],
  ['B', 'b'],
  ['C', 'c'],
  ['D', 'd'],
  ['Đ', 'đ'],
  ['E', 'e'],
  ['Ê', 'ê'],
  ['G', 'g'],
  ['H', 'h'],
  ['I', 'i'],
  ['K', 'k'],
  ['L', 'l'],
  ['M', 'm'],
  ['N', 'n'],
  ['O', 'o'],
  ['Ô', 'ô'],
  ['Ơ', 'ơ'],
  ['P', 'p'],
  ['Q', 'q'],
  ['R', 'r'],
  ['S', 's'],
  ['T', 't'],
  ['U', 'u'],
  ['Ư', 'ư'],
  ['V', 'v'],
  ['X', 'x'],
  ['Y', 'y'],
];
const LNAME = {
  A: 'a',
  Ă: 'á',
  Â: 'ớ',
  B: 'bờ',
  C: 'cờ',
  D: 'dờ',
  Đ: 'đờ',
  E: 'e',
  Ê: 'ê',
  G: 'gờ',
  H: 'hờ',
  I: 'i',
  K: 'ca',
  L: 'lờ',
  M: 'mờ',
  N: 'nờ',
  O: 'o',
  Ô: 'ô',
  Ơ: 'ơ',
  P: 'pê',
  Q: 'quờ',
  R: 'rờ',
  S: 'sờ',
  T: 'tờ',
  U: 'u',
  Ư: 'ư',
  V: 'vờ',
  X: 'xờ',
  Y: 'i dài',
};
const LDEF = Object.assign({}, LNAME);
const LEXTRA = { K: ['ka'], Y: ['y dài'], P: ['pờ', 'pi'] };
const WORDS = [
  ['🦋', 'bướm', 'B'],
  ['🐮', 'bò', 'B'],
  ['🐟', 'cá', 'C'],
  ['🐔', 'gà', 'G'],
  ['🌸', 'hoa', 'H'],
  ['🐱', 'mèo', 'M'],
  ['🍄', 'nấm', 'N'],
  ['🍎', 'táo', 'T'],
  ['🚗', 'xe', 'X'],
  ['🦆', 'vịt', 'V'],
  ['💡', 'đèn', 'Đ'],
  ['⭐', 'sao', 'S'],
  ['🐢', 'rùa', 'R'],
  ['🍦', 'kem', 'K'],
  ['🍃', 'lá', 'L'],
  ['🐐', 'dê', 'D'],
  ['☂️', 'ô', 'Ô'],
  ['🐝', 'ong', 'O'],
  ['🐸', 'ếch', 'Ê'],
  ['🌶️', 'ớt', 'Ơ'],
  ['🔋', 'pin', 'P'],
  ['🐻', 'gấu', 'G'],
];
const ANIM = [
  ['🐱', 'mèo', 'meo meo'],
  ['🐶', 'chó', 'gâu gâu'],
  ['🐔', 'gà', 'ò ó o o'],
  ['🐷', 'heo', 'ụt ịt'],
  ['🐮', 'bò', 'um bò'],
  ['🦆', 'vịt', 'cạc cạc'],
  ['🐸', 'ếch', 'ộp ộp'],
  ['🐑', 'cừu', 'be be'],
  ['🐴', 'ngựa', 'hí hí'],
  ['🐘', 'voi', ''],
  ['🦁', 'sư tử', ''],
  ['🐵', 'khỉ', ''],
  ['🐰', 'thỏ', ''],
  ['🐢', 'rùa', ''],
  ['🐻', 'gấu', ''],
  ['🐯', 'hổ', ''],
];
const FRUITS = [
  ['🍎', 'quả táo'],
  ['🍌', 'quả chuối'],
  ['🍊', 'quả cam'],
  ['🍓', 'quả dâu'],
  ['🐥', 'chú gà con'],
  ['🎈', 'quả bóng'],
  ['🚗', 'chiếc xe'],
  ['🦆', 'con vịt'],
  ['⭐', 'ngôi sao'],
];
const COLORS = [
  ['đỏ', '#E53935'],
  ['xanh dương', '#1E88E5'],
  ['xanh lá', '#43A047'],
  ['vàng', '#FDD835'],
  ['cam', '#FB8C00'],
  ['tím', '#8E24AA'],
  ['hồng', '#F48FB1'],
  ['nâu', '#795548'],
];
const SHAPES = [
  ['tron', 'hình tròn', '<circle cx="50" cy="50" r="40"/>'],
  ['vuong', 'hình vuông', '<rect x="12" y="12" width="76" height="76" rx="6"/>'],
  ['tam', 'hình tam giác', '<polygon points="50,10 92,88 8,88"/>'],
  ['cn', 'hình chữ nhật', '<rect x="5" y="26" width="90" height="48" rx="6"/>'],
  [
    'sao',
    'ngôi sao',
    '<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>',
  ],
  [
    'tim',
    'hình trái tim',
    '<path d="M50 88C10 58 6 28 28 20C40 16 50 26 50 32C50 26 60 16 72 20C94 28 90 58 50 88Z"/>',
  ],
  ['bd', 'hình bầu dục', '<ellipse cx="50" cy="50" rx="44" ry="28"/>'],
  ['thoi', 'hình thoi', '<polygon points="50,6 94,50 50,94 6,50"/>'],
  ['tt', 'mũi tên', '<polygon points="6,38 58,38 58,16 94,50 58,84 58,62 6,62"/>'],
];
const COLORTABLE = [
  ['đỏ', '#E53935', '🍎', 'quả táo'],
  ['cam', '#FB8C00', '🍊', 'quả cam'],
  ['vàng', '#FDD835', '🍌', 'quả chuối'],
  ['xanh lá', '#43A047', '🍃', 'lá cây'],
  ['xanh dương', '#1E88E5', '🌊', 'sóng biển'],
  ['xanh da trời', '#4FC3F7', '🐬', 'cá heo'],
  ['tím', '#8E24AA', '🍇', 'quả nho'],
  ['hồng', '#F48FB1', '🌸', 'bông hoa'],
  ['nâu', '#795548', '🐻', 'con gấu'],
  ['đen', '#212121', '🎱', 'viên bi đen'],
  ['trắng', '#FFFFFF', '☁️', 'đám mây'],
  ['xám', '#9E9E9E', '🐘', 'con voi'],
];
const SHAPE_CLR = [
  '#E53935',
  '#1E88E5',
  '#43A047',
  '#FB8C00',
  '#FDD835',
  '#F06292',
  '#8E24AA',
  '#26A69A',
  '#795548',
];
const G3 = 'stroke="#1E2A4F" stroke-width="3" stroke-linejoin="round"';
const PICT = [
  [
    'đèn giao thông',
    '<rect x="30" y="6" width="40" height="88" rx="12" fill="#37474F" ' +
      G3 +
      '/><circle cx="50" cy="25" r="10" fill="#E53935"/><circle cx="50" cy="50" r="10" fill="#FDD835"/><circle cx="50" cy="75" r="10" fill="#43A047"/>',
  ],
  [
    'ngôi nhà',
    '<rect x="20" y="46" width="60" height="44" fill="#FFCC80" ' +
      G3 +
      '/><polygon points="12,50 50,14 88,50" fill="#E53935" ' +
      G3 +
      '/><rect x="42" y="62" width="16" height="28" fill="#8D6E63" ' +
      G3 +
      '/><rect x="26" y="56" width="12" height="12" fill="#81D4FA" ' +
      G3 +
      '/><rect x="62" y="56" width="12" height="12" fill="#81D4FA" ' +
      G3 +
      '/>',
  ],
  [
    'mặt trời',
    '<g stroke="#FB8C00" stroke-width="6" stroke-linecap="round"><path d="M50 8V20M50 80V92M8 50H20M80 50H92M20 20L28 28M72 72L80 80M80 20L72 28M28 72L20 80"/></g><circle cx="50" cy="50" r="22" fill="#FDD835" ' +
      G3 +
      '/>',
  ],
  [
    'đám mây',
    '<path d="M24 72A16 16 0 0 1 26 40A22 22 0 0 1 68 36A18 18 0 0 1 76 72Z" fill="#B3E5FC" ' +
      G3 +
      '/>',
  ],
  [
    'mặt trăng',
    '<path d="M64 10A42 42 0 1 0 64 90A32 32 0 1 1 64 10Z" fill="#FFE082" ' + G3 + '/>',
  ],
  [
    'cái cây',
    '<rect x="43" y="54" width="14" height="40" fill="#8D6E63" ' +
      G3 +
      '/><circle cx="50" cy="36" r="26" fill="#43A047"/><circle cx="30" cy="52" r="18" fill="#43A047"/><circle cx="70" cy="52" r="18" fill="#43A047"/>',
  ],
  [
    'bông hoa',
    '<rect x="47" y="52" width="6" height="42" fill="#43A047" ' +
      G3 +
      '/><g fill="#F48FB1" ' +
      G3 +
      '><circle cx="50" cy="24" r="12"/><circle cx="64" cy="32" r="12"/><circle cx="64" cy="48" r="12"/><circle cx="50" cy="56" r="12"/><circle cx="36" cy="48" r="12"/><circle cx="36" cy="32" r="12"/></g><circle cx="50" cy="40" r="11" fill="#FDD835" ' +
      G3 +
      '/>',
  ],
];
const STICKERS = [
  ['🦄', 'kỳ lân'],
  ['🚀', 'tên lửa'],
  ['🐳', 'cá voi'],
  ['🍭', 'kẹo mút'],
  ['🎠', 'ngựa xoay'],
  ['🌈', 'cầu vồng'],
  ['🦖', 'khủng long'],
  ['🎂', 'bánh kem'],
  ['🐼', 'gấu trúc'],
  ['🐙', 'bạch tuộc'],
  ['🐲', 'rồng'],
  ['🍉', 'dưa hấu'],
];
const PRAISE = ['Giỏi quá!', 'Đúng rồi!', 'Tuyệt vời!', 'Giỏi lắm!', 'Hoan hô!'];
const RETRY = ['Thử lại nhé!', 'Gần đúng rồi, thử lại nào!', 'Thử lần nữa nhé!'];

const MASCOT =
  '<svg class="mascot" viewBox="0 0 120 120" aria-hidden="true"><circle cx="28" cy="30" r="16" fill="#C98B4E"/><circle cx="92" cy="30" r="16" fill="#C98B4E"/><circle cx="28" cy="30" r="8" fill="#F4C79B"/><circle cx="92" cy="30" r="8" fill="#F4C79B"/><circle cx="60" cy="64" r="44" fill="#D9A064"/><ellipse cx="60" cy="78" rx="20" ry="15" fill="#F4C79B"/><circle cx="44" cy="58" r="5" fill="#1E2A4F"/><circle cx="76" cy="58" r="5" fill="#1E2A4F"/><circle cx="46" cy="56" r="1.8" fill="#fff"/><circle cx="78" cy="56" r="1.8" fill="#fff"/><ellipse cx="60" cy="72" rx="7" ry="5" fill="#1E2A4F"/><path d="M52 82Q60 90 68 82" stroke="#1E2A4F" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="36" cy="72" r="6" fill="#FF8FA3" opacity=".6"/><circle cx="84" cy="72" r="6" fill="#FF8FA3" opacity=".6"/></svg>';
const SPK =
  '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M15 9a4 4 0 010 6M17.5 6.5a8 8 0 010 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

/* ---------- Tranh để tô màu ---------- */
function starPts(cx, cy, R) {
  const r = R * 0.45,
    p = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      k = i % 2 ? r : R;
    p.push((cx + k * Math.cos(a)).toFixed(1) + ',' + (cy + k * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}
const star = (cx, cy, R) => '<polygon class="r" points="' + starPts(cx, cy, R) + '"/>';
const PICS = [
  {
    name: 'hoa',
    svg: '<rect class="r" x="144" y="140" width="12" height="112"/><ellipse class="r" cx="112" cy="200" rx="34" ry="16" transform="rotate(-25 112 200)"/><ellipse class="r" cx="190" cy="185" rx="34" ry="16" transform="rotate(25 190 185)"/><path class="r" d="M105 240H195L185 292H115Z"/><circle class="r" cx="198" cy="110" r="30"/><circle class="r" cx="174" cy="152" r="30"/><circle class="r" cx="126" cy="152" r="30"/><circle class="r" cx="102" cy="110" r="30"/><circle class="r" cx="126" cy="68" r="30"/><circle class="r" cx="174" cy="68" r="30"/><circle class="r" cx="150" cy="110" r="28"/>',
  },
  {
    name: 'cá',
    svg: '<polygon class="r" points="225,150 285,100 285,200"/><path class="r" d="M110 100Q140 50 175 98Z"/><path class="r" d="M120 200Q150 245 175 205Z"/><ellipse class="r" cx="140" cy="150" rx="90" ry="60"/><circle class="r" cx="95" cy="135" r="11"/><circle class="r" cx="40" cy="90" r="14"/><circle class="r" cx="22" cy="55" r="9"/><circle class="r" cx="58" cy="48" r="10"/>',
  },
  {
    name: 'nhà',
    svg: '<circle class="r" cx="240" cy="60" r="32"/><rect class="r" x="195" y="80" width="22" height="50"/><rect class="r" x="70" y="140" width="160" height="120"/><polygon class="r" points="55,145 150,70 245,145"/><rect class="r" x="130" y="190" width="40" height="70"/><rect class="r" x="85" y="165" width="36" height="36"/><rect class="r" x="180" y="165" width="36" height="36"/><rect class="r" x="20" y="260" width="260" height="26"/>',
  },
  {
    name: 'bướm',
    svg: '<ellipse class="r" cx="105" cy="118" rx="52" ry="38" transform="rotate(-30 105 118)"/><ellipse class="r" cx="195" cy="118" rx="52" ry="38" transform="rotate(30 195 118)"/><ellipse class="r" cx="115" cy="198" rx="40" ry="28" transform="rotate(25 115 198)"/><ellipse class="r" cx="185" cy="198" rx="40" ry="28" transform="rotate(-25 185 198)"/><circle class="r" cx="96" cy="112" r="13"/><circle class="r" cx="204" cy="112" r="13"/><ellipse class="r" cx="150" cy="160" rx="11" ry="62"/><circle class="r" cx="150" cy="92" r="15"/><path class="d" d="M144 80Q132 54 116 50M156 80Q168 54 184 50"/>',
  },
  {
    name: 'cây',
    svg: '<rect class="r" x="20" y="262" width="260" height="26"/><rect class="r" x="132" y="170" width="36" height="96"/><circle class="r" cx="150" cy="105" r="62"/><circle class="r" cx="100" cy="150" r="44"/><circle class="r" cx="200" cy="150" r="44"/><circle class="r" cx="128" cy="95" r="11"/><circle class="r" cx="175" cy="120" r="11"/><circle class="r" cx="110" cy="152" r="11"/><circle class="r" cx="205" cy="158" r="11"/>',
  },
  {
    name: 'ô tô',
    svg: '<rect class="r" x="30" y="160" width="240" height="62" rx="16"/><path class="r" d="M80 162L112 108H190L226 162Z"/><path class="r" d="M96 158L118 118H147V158Z"/><path class="r" d="M158 158V118H184L210 158Z"/><circle class="r" cx="90" cy="226" r="30"/><circle class="r" cx="210" cy="226" r="30"/><circle class="r" cx="90" cy="226" r="12"/><circle class="r" cx="210" cy="226" r="12"/><circle class="r" cx="256" cy="186" r="9"/>',
  },
  {
    name: 'thuyền',
    svg: '<rect class="r" x="0" y="246" width="300" height="54"/><path class="r" d="M40 190H260L226 248H74Z"/><rect class="r" x="108" y="140" width="84" height="50"/><rect class="r" x="146" y="58" width="8" height="84"/><path class="r" d="M156 62V132H222Z"/><path class="r" d="M146 58V34L116 46Z"/><circle class="r" cx="130" cy="166" r="10"/><circle class="r" cx="170" cy="166" r="10"/>',
  },
  {
    name: 'cầu vồng',
    svg: '<path class="r" d="M20 230A130 130 0 0 1 280 230H246A96 96 0 0 0 54 230Z"/><path class="r" d="M54 230A96 96 0 0 1 246 230H212A62 62 0 0 0 88 230Z"/><path class="r" d="M88 230A62 62 0 0 1 212 230H178A28 28 0 0 0 122 230Z"/><circle class="r" cx="40" cy="236" r="22"/><circle class="r" cx="70" cy="244" r="20"/><circle class="r" cx="18" cy="248" r="16"/><circle class="r" cx="260" cy="236" r="22"/><circle class="r" cx="230" cy="244" r="20"/><circle class="r" cx="282" cy="248" r="16"/>',
  },
  {
    name: 'tên lửa',
    svg:
      '<path class="r" d="M138 204Q150 262 162 204Z"/><path class="r" d="M115 160L72 218L115 198Z"/><path class="r" d="M185 160L228 218L185 198Z"/><path class="r" d="M150 28C192 66 198 130 186 192H114C102 130 108 66 150 28Z"/><circle class="r" cx="150" cy="108" r="22"/><rect class="r" x="132" y="192" width="36" height="14" rx="3"/>' +
      star(60, 70, 16) +
      star(244, 96, 14) +
      star(228, 40, 10) +
      star(70, 200, 10),
  },
  {
    name: 'gấu',
    svg: '<circle class="r" cx="82" cy="84" r="34"/><circle class="r" cx="218" cy="84" r="34"/><circle class="r" cx="82" cy="84" r="17"/><circle class="r" cx="218" cy="84" r="17"/><circle class="r" cx="150" cy="156" r="98"/><ellipse class="r" cx="150" cy="192" rx="46" ry="34"/><ellipse class="r" cx="150" cy="172" rx="16" ry="10"/><circle class="r" cx="110" cy="132" r="10"/><circle class="r" cx="190" cy="132" r="10"/><path class="d" d="M150 182V200M134 210Q150 224 166 210"/>',
  },
  {
    name: 'vịt',
    svg: '<rect class="r" x="14" y="244" width="272" height="42"/><path class="r" d="M80 176L36 148L66 204Z"/><ellipse class="r" cx="150" cy="196" rx="88" ry="58"/><circle class="r" cx="212" cy="108" r="46"/><path class="r" d="M250 106L292 118L250 134Z"/><circle class="r" cx="224" cy="98" r="7"/><ellipse class="r" cx="128" cy="200" rx="42" ry="26" transform="rotate(-15 128 200)"/>',
  },
  {
    name: 'quả táo',
    svg: '<rect class="r" x="144" y="52" width="12" height="40" rx="5"/><path class="r" d="M156 90Q190 40 238 62Q208 106 156 90Z"/><circle class="r" cx="150" cy="178" r="94"/><circle class="r" cx="106" cy="140" r="15"/>',
  },
  {
    name: 'mèo',
    svg: '<polygon class="r" points="62,120 72,36 138,84"/><polygon class="r" points="238,120 228,36 162,84"/><polygon class="r" points="82,100 84,62 114,84"/><polygon class="r" points="218,100 216,62 186,84"/><circle class="r" cx="150" cy="168" r="96"/><circle class="r" cx="112" cy="150" r="15"/><circle class="r" cx="188" cy="150" r="15"/><polygon class="r" points="138,182 162,182 150,198"/><path class="d" d="M150 198V212M150 212Q136 226 122 214M150 212Q164 226 178 214M96 188L48 178M96 202L48 206M204 188L252 178M204 202L252 206"/>',
  },
];
