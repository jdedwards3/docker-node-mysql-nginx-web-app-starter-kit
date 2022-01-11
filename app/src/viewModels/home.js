class HomeViewModel {
  constructor(init = { email }) {
    Object.assign(this, init);
  }
}

module.exports = HomeViewModel;
