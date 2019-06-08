module.exports = class ApplicationPolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    console.log('DEBUG: applicationPolicy -> isOwner user.id');
    console.log(this.user.id);
    console.log('DEBUG: applicationPolicy -> isOwner record.userId');
    console.log(this.record.userId);
    return this.record && this.user && (this.record.userId === this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role === 2;
  }

  _isPremium() {
    return this.user && this.user.role === 1;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new();
  }

  update() {
    console.log('DEBUG: applicationPolicy -> update user.id');
    console.log(this.user.id);
    return this.new();
  }

  destroy() {
    return (this._isOwner() || this._isAdmin());
  }
};
