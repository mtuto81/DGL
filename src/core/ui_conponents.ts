
export abstract class UIComponent {
  constructor(
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number
  ) {}

  abstract toHTML(): string;
  abstract toJS(): string;
  abstract handleEvent(event: Event): void;

  protected getInlineStyles(): string {
    return `position: absolute; left: ${this.x}px; top: ${this.y}px; width: ${this.width}px; height: ${this.height}px;`;
  }
}