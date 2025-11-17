export class Player {
  constructor(
    public id?: string,
    public name: string = '',
    public lastName: string = '',
    public position: string = '',
    public age: number=18,
    public height: string = '',
    public weight?: number,
    public alias: string = '',
    public teams: string = '',
    public headshot: string = '',
    public initials: string = '',
    public video: string = ''
  ) {}
}   