export class BaseFactory {
  private static library: {[propName: string]: any} = {};

  protected static setToLibrary<ValueType>(type: string, value: ValueType): ValueType {
    return BaseFactory.library[type] = value;
  }

  protected static getFromLibraryByType<ValueType>(type: string): ValueType | undefined {
    return BaseFactory.library[type];
  }
}
