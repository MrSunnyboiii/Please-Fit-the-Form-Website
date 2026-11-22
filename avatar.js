'use strict';

const palette = {
  Fern: ['#7cb899', '#c7dfab'], Lavender: ['#ae94cc', '#e2c6ef'],
  Coral: ['#e78d83', '#f4c6a6'], Sky: ['#77b9d5', '#c2e9ed'],
  Gold: ['#e7b85f', '#f7dc9d'], Beige: ['#c9ad86', '#f3daba'],
  Berry: ['#ad7096', '#f2b7d3'], Midnight: ['#65789e', '#a3b3dd']
};

function drawAvatar(avatar, scene = 'create') {
  const [color, light] = palette[avatar.color];
  const ink = '#233c3a';
  const width = {Round: 1, Slender: .8, Broad: 1.18, Custom: 1.04}[avatar.shape];
  const size = .82 + (avatar.height - 60) / 540;
  const has = feature => avatar.features.includes(feature);
  const pieces = {
    Dragon: '<path d="M-47 -27l-13 -28 27 9m67 1 25 -13 -10 32M-45 55q-54 18 -49 -27 14 28 49 10"/><circle cx="0" cy="-10" r="53"/>',
    Unicorn: '<ellipse cy="-12" rx="48" ry="55"/><path d="M-32 -43l-12 -31 30 15m32 0 24 -14 -6 28"/>',
    Fairy: '<circle cy="-14" r="48"/><path d="M-36 -37q-16 -25 5 -42m53 32q27 -35 37 -15" fill="none"/><circle cx="-28" cy="-81" r="5"/><circle cx="60" cy="-64" r="5"/>',
    Griffin: '<circle cy="-13" r="50"/><path d="M-35 -47l-18 -26 34 12m34 -1 32 -16 -13 30"/><path d="M-16 7Q0 -5 18 7L2 23Z" fill="#f5cb74"/>',
    Slime: '<path d="M-62 48C-70 18 -42 16 -31 -20S-3 -69 20 -44 39 -12 56 7 70 46 57 58 -55 68 -62 48Z"/>',
    Human: '<circle cy="-15" r="49"/><path d="M-47 -25q-1 -47 38 -49 39 -4 59 43 -28 -2 -49 -20 -14 18 -48 26" fill="#3d4a55"/>',
    Custom: '<path d="M-58 -7q1 -51 58 -56 53 5 58 54 3 40 -58 43 -59 -4 -58 -41Z"/><path d="M-48 -41l-18 -11m117 12 17 -14" fill="none"/>'
  };
  const eyes = {
    Cheerful: '<circle cx="-17" cy="-12" r="4"/><circle cx="17" cy="-12" r="4"/><path d="M-9 3q9 10 18 0" fill="none"/>',
    Serious: '<path d="M-25 -18l15 5m20 0 15 -5M-7 7h14" fill="none"/><circle cx="-17" cy="-8" r="3"/><circle cx="17" cy="-8" r="3"/>',
    Sleepy: '<path d="M-24 -10q7 7 14 0m20 0q7 7 14 0" fill="none"/><circle cy="7" r="4" fill="none"/>',
    Mischievous: '<path d="M-24 -10q7 -7 14 0m7 5q8 9 18 1" fill="none"/><circle cx="18" cy="-13" r="4"/>'
  };
  const stars = [[49,49],[85,98],[325,57],[371,102],[123,39],[279,34],[36,142],[347,151]];
  const background = scene === 'sandbox' ? '#eadcf5' : '#dceade';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
    <rect width="420" height="300" fill="${background}"/>
    <circle cx="210" cy="142" r="110" fill="#f3f0d6" stroke="#ffffff" stroke-width="2"/>
    <circle cx="210" cy="142" r="122" fill="none" stroke="#f8faf3" stroke-dasharray="2 6"/>
    <path d="M0 253Q60 191 128 239T258 230T420 231V300H0Z" fill="#a9c9b2"/>
    <path d="M0 276q78 -44 152 -13t147 -9 121 10v36H0Z" fill="#779b89"/>
    ${stars.map(([x,y],i) => `<path d="M${x} ${y-6}l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2Z" fill="${i % 2 ? '#fdf7d8' : '#638d79'}"/>`).join('')}
    <ellipse cx="210" cy="246" rx="${70*width}" ry="13" fill="#3f6658" opacity=".33"/>
    <g transform="translate(210 155) scale(${size*width} ${size})" stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      ${has('Wings') ? `<path fill="${light}" d="M-34 38Q-74 -14 -112 -27q20 30 9 64 29 -13 24 15 27 -11 43 4M34 38Q74 -14 112 -27q-20 30 -9 64 -29 -13 -24 15 -27 -11 -43 4"/>` : ''}
      ${avatar.creature !== 'Slime' ? `<ellipse cy="49" rx="52" ry="43" fill="${color}"/><ellipse cy="53" rx="29" ry="28" fill="${light}"/><path d="M-51 54q-17 29 17 33 17 -3 15 -19m70 -14q17 29 -17 33 -17 -3 -15 -19" fill="${color}"/>` : ''}
      <g fill="${color}">${pieces[avatar.creature]}</g>
      ${has('Horns') && avatar.creature === 'Unicorn' ? '<path d="M-6 -63l7 -35 14 37" fill="#f2cf78"/>' : has('Horns') ? '<path d="M-34 -46Q-55 -54 -54 -79q12 15 28 20m60 13q21 -8 20 -33 -12 15 -28 20" fill="#f5ce7f"/>' : ''}
      ${has('Fur') ? `<path d="M-47 -10l-14 12 12 3 -9 13 18 -2m87 -26 14 12 -12 3 9 13 -18 -2" fill="${light}"/>` : ''}
      ${has('Scales') ? '<path d="M-17 -34q5 7 10 0m2 -4q5 7 10 0m2 4q5 7 10 0M-13 47q5 7 10 0m5 0q5 7 10 0" fill="none" opacity=".65" stroke-width="2"/>' : ''}
      <ellipse cx="-29" cy="1" rx="7" ry="4" fill="#ed9e96" stroke="none"/><ellipse cx="29" cy="1" rx="7" ry="4" fill="#ed9e96" stroke="none"/>
      <g fill="${ink}" stroke-width="2.5">${eyes[avatar.expression]}</g>
      ${has('Sparkles') ? '<path d="M-78 -46l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4Zm158 2 4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4Z" fill="#f1ca68" stroke-width="1.5"/>' : ''}
    </g></svg>`;
}
