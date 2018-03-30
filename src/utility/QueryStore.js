export default class QueryStore {
  constructor(key, storage) {
    this.key = key;
    this.storage = storage;
    this.items = this.fetchAll();
  }

  get length() {
    return this.items.length;
  }

  contains(item) {
    return this.items.some(
      x =>
        x.query === item.query
          ? !!x.variables && !!item.variables
            ? x.variables === item.variables ? true : false
            : true
          : false
    );

    //   if(x.query === item.query) {
    //     if (!!x.variables && !!item.variables) {
    //       if (x.variables === item.variables)
    //         return true;
    //     } else {
    //       return true;
    //     }
    //   }
    //   return false;
    // });
  }

  delete(item) {
    const index = this.items.findIndex(
      x => x.query === item.query && x.variables === item.variables
      // x.operationName === item.operationName
    );
    if (index !== -1) {
      this.items.splice(index, 1);
      this.save();
    }
  }

  fetchRecent() {
    return this.items[this.items.length - 1];
  }

  fetchAll() {
    const raw = this.storage.get(this.key);
    if (raw) {
      return JSON.parse(raw)[this.key];
    }
    return [];
  }

  push(item) {
    this.items.push(item);
    this.save();
  }

  concat(newItems) {
    for (let i = newItems.length - 1; i >= 0; i--) {
      this.items.push(newItems[i]);
    }
    this.save();
  }

  shift() {
    this.items.shift();
    console.log(this.items);
    this.save();
  }

  unshift(item) {
    this.items.unshift(item);
    this.save();
  }

  save() {
    this.storage.set(this.key, JSON.stringify({ [this.key]: this.items }));
  }
}
