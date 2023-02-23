function WELL512a() {
  var state = new Array(16);
  var index = 0;

  function init(seed) {
    for (var i = 0; i < 16; i++) {
      state[i] = seed & 0xffffffff;
      seed = (1812433253 * (seed ^ (seed >> 30)) + i) & 0xffffffff;
    }
  }

  function random() {
    var a, b, c, d;
    a = state[index];
    c = state[(index+13)&15];
    b = a^c^(a<<16)^(c<<15);
    c = state[(index+9)&15];
    c ^= (c>>11);
    a = state[index] = b^c;
    d = a^((a<<5)&0xDA442D24);
    index = (index + 15) & 15;
    a = state[index];
    state[index] = a^b^d^(a<<2)^(b<<18)^(c<<28);
    return state[index];
  }

  init(+new Date());

  return {
    random: random,
    init: init
  }
}