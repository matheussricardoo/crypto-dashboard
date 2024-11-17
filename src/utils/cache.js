class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutos em milissegundos
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const data = this.cache.get(key);
    if (!data) return null;
    
    if (Date.now() - data.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return data.value;
  }

  clear() {
    this.cache.clear();
  }
}

export const chartCache = new Cache(); 