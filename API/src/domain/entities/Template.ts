export class Template {
  constructor(
    public id: number,
    public type_template: 'email' | 'prompt',
    public content: string
  ) {}
}