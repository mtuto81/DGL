import { Event } from "./event.ts";
import { SDL2Renderer } from "../platform/sdl2/renderer.ts";
import { Layout } from "./Layout.ts";
import { Theme } from "./Theme.ts";

export interface ComponentProps {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible?: boolean;
  layout?: Layout;
  theme?: Theme;
}

export abstract class Component extends Event {
  protected props: ComponentProps;
  protected children: Component[] = [];
  protected parent: Component | null = null;

  constructor(props: ComponentProps) {
    super();
    this.props = {
      visible: true,
      ...props
    };
  }

  abstract render(renderer: SDL2Renderer): void;

  update(deltaTime: number): void {
    if (this.props.visible) {
      for (const child of this.children) {
        child.update(deltaTime);
      }
    }
  }

  addChild(child: Component): void {
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child: Component): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  setLayout(layout: Layout): void {
    this.props.layout = layout;
    this.applyLayout();
  }

  applyLayout(): void {
    if (this.props.layout) {
      this.props.layout.apply(this);
    }
  }

  setTheme(theme: Theme): void {
    this.props.theme = theme;
  }

  getTheme(): Theme {
    return this.props.theme || (this.parent ? this.parent.getTheme() : Theme.default);
  }

  setBounds(x: number, y: number, width: number, height: number): void {
    this.props.x = x;
    this.props.y = y;
    this.props.width = width;
    this.props.height = height;
    this.applyLayout();
  }

  isVisible(): boolean {
    return this.props.visible || false;
  }

  setVisible(visible: boolean): void {
    this.props.visible = visible;
  }
}