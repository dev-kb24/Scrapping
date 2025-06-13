export class Scrape {
  constructor(
    public id: string,
    public name: string,
    public keyword: string,
    public city: string,
    public progress: 'in progress' | 'failed' | 'success'
  ) {}
}