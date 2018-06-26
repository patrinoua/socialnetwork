const gaga = { name: 'Lady Gaga' };

const paparazzi = { name: 'Paparazzi' };
const badRomance = { name: 'Bad Romance' };

const map = new Map;

map.set(paparazzi, gaga);

map.set(badRomance, gaga);

map.get(paparazzi).name; //"Lady Gaga"

console.log(map);
