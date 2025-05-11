const cachedStorages: { [key: string]: Storage } = {};

const emergencyStorage: { [key: string]: string } = {};

class Storage {

  readonly name: string;

  constructor({name}: { name: string }) {
    if (cachedStorages[name])
      return cachedStorages[name];

    cachedStorages[name] = this;

    this.name = name;
  }

  get(): any {
    try {
      return JSON.parse(localStorage.getItem(this.name));
    } catch {
      return JSON.parse(emergencyStorage[this.name]);
    }
  }

  set(data: any): void {
    try {
      localStorage.setItem(this.name, JSON.stringify(data));
    } catch {
      emergencyStorage[this.name] = JSON.stringify(data);
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.name);
    } catch {
      delete emergencyStorage[this.name];
    }
  }
}

export const storage = (name: string): Storage => new Storage({name});