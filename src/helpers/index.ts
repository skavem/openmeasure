export class OString extends String {
  truncateTo(length: number): OString {
    return this.length > length ? new OString(this.substring(0, length) + "…") : this;
  }
}