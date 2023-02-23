class WELL512a {
  constructor(seed) {
    this.N = 16;
    this.M = 13;
    this.mat1 = 16;
    this.mat2 = 15;
    this.mat3 = 11;
    this.upper_mask = 0xFFFFFFFFU << 32 - this.N;
    this.lower_mask = 0xFFFFFFFFU >> this.N;
    this.state = new Array(this.N);

    if (seed == undefined) {
      seed = new Date().getTime();
    }
    this.seed(seed);
  }

  seed(seed) {
    if (seed instanceof Array) {
      this.state = seed.slice();
    } else {
      const randInt = (max) => Math.floor(Math.random() * Math.floor(max));
      this.state[0] = seed >>> 0;
      for (let i = 1; i < this.N; i++) {
        this.state[i] = randInt(0x100000000);
      }
    }
  }

  _vrm1(i) {
    return this.state[(i + this.N - 1) % this.N];
  }

  _vrm2(i) {
    return this.state[(i + this.M) % this.N];
  }

  _vrm3(i) {
    return this.state[(i + this.N - this.M) % this.N];
  }

  _mat0pos(t, v) {
    return v ^ (v >>> t);
  }

  _mat0neg(t, v) {
    return v ^ (v << -t);
  }

  _mat3neg(t, v) {
    return v << -t;
  }

  random() {
    const indexRm1 = this.N - 1;
    const indexRm2 = this.N - 2;

    let z0, z1, z2;

    for (let i = 0; i < this.N - this.M; i++) {
      z0 = (this.state[i] & this.upper_mask) | (this.state[i + 1] & this.lower_mask);
      z1 = this._vrm1(i) ^ this._mat0pos(15, z0);
      z2 = this._vrm2(i) ^ this._mat0neg(-15, z1);
      this.state[i] = z2 ^ this._mat3neg(21, z2);
    }

    for (let i = this.N - this.M; i < indexRm1; i++) {
      z0 = (this.state[i] & this.upper_mask) | (this.state[i + 1] & this.lower_mask);
      z1 = this._vrm1(i) ^ this._mat0pos(15, z0);
      z2 = this._vrm2(i) ^ this._mat0neg(-15, z1);
      this.state[i] = z2 ^ this._mat3neg(21, z2);
    }

    z0 = (this.state[indexRm1] & this.upper_mask) | (this.state[0] & this.lower_mask);
    z1 = this._vrm1(indexRm1) ^ this._mat0pos(15, z0);
   
