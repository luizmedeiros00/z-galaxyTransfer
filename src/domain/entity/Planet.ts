export default class Planet {
  constructor(
    readonly id: number,
    readonly name: string
  ) {
  }

  getId(): number {
    return this.id
  }

  getName(): string {
    return this.name
  }
}