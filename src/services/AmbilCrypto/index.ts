export default class AmbilCrypto {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getData() {
    const res = await fetch(this.url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }
}