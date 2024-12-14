// calculator-app.ts

import { ComponentRenderer } from "../mod.ts";

class CalculatorApp {
  private display: string = '0';
  private currentValue: string = '';
  private previousValue: string = '';
  private operator: string | null = null;
  private newNumber: boolean = true;
  private renderer: ComponentRenderer;

  constructor() {
    this.renderer = new ComponentRenderer();
    this.initializeUI();
  }

  private updateDisplay(): void {
    const displayComponent = this.renderer.getComponent('display') as any;
    if (displayComponent) {
      displayComponent.setText(this.display);
    }
  }

  private handleNumber = (num: string): void => {
    if (this.newNumber) {
      this.currentValue = num;
      this.newNumber = false;
    } else {
      if (num === '.' && this.currentValue.includes('.')) {
        return;
      }
      this.currentValue += num;
    }
    this.display = this.currentValue;
    this.updateDisplay();
  }

  private handleOperator = (op: string): void => {
    if (this.operator !== null && !this.newNumber) {
      this.calculate();
    }
    this.previousValue = this.currentValue;
    this.operator = op;
    this.newNumber = true;
  }

  private calculate = (): void => {
    if (this.operator === null || this.newNumber) {
      return;
    }

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    let result: number;

    switch (this.operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.clear();
          this.display = 'Error';
          this.updateDisplay();
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentValue = this.formatNumber(result);
    this.display = this.currentValue;
    this.operator = null;
    this.newNumber = true;
    this.updateDisplay();
  }

  private clear = (): void => {
    this.currentValue = '';
    this.previousValue = '';
    this.operator = null;
    this.newNumber = true;
    this.display = '0';
    this.updateDisplay();
  }

  private formatNumber(num: number): string {
    const str = num.toFixed(10);
    return str.replace(/\.?0+$/, '');
  }

  private initializeUI(): void {
    const ui = {
      type: "window",
      title: "GTK Calculator",
      width: 300,
      height: 400,
      children: [{
        type: "box",
        orientation: "vertical",
        spacing: 10,
        children: [
          {
            type: "entry",
            id: "display",
            placeholder: "0",
          },
          {
            type: "box",
            orientation: "vertical",
            spacing: 5,
            children: [
              // Row 1
              {
                type: "box",
                orientation: "horizontal",
                spacing: 5,
                children: [
                  {
                    type: "button",
                    label: "7",
                    onClick: () => this.handleNumber("7")
                  },
                  {
                    type: "button",
                    label: "8",
                    onClick: () => this.handleNumber("8")
                  },
                  {
                    type: "button",
                    label: "9",
                    onClick: () => this.handleNumber("9")
                  },
                  {
                    type: "button",
                    label: "÷",
                    onClick: () => this.handleOperator("/")
                  }
                ]
              },
              // Row 2
              {
                type: "box",
                orientation: "horizontal",
                spacing: 5,
                children: [
                  {
                    type: "button",
                    label: "4",
                    onClick: () => this.handleNumber("4")
                  },
                  {
                    type: "button",
                    label: "5",
                    onClick: () => this.handleNumber("5")
                  },
                  {
                    type: "button",
                    label: "6",
                    onClick: () => this.handleNumber("6")
                  },
                  {
                    type: "button",
                    label: "×",
                    onClick: () => this.handleOperator("*")
                  }
                ]
              },
              // Row 3
              {
                type: "box",
                orientation: "horizontal",
                spacing: 5,
                children: [
                  {
                    type: "button",
                    label: "1",
                    onClick: () => this.handleNumber("1")
                  },
                  {
                    type: "button",
                    label: "2",
                    onClick: () => this.handleNumber("2")
                  },
                  {
                    type: "button",
                    label: "3",
                    onClick: () => this.handleNumber("3")
                  },
                  {
                    type: "button",
                    label: "-",
                    onClick: () => this.handleOperator("-")
                  }
                ]
              },
              // Row 4
              {
                type: "box",
                orientation: "horizontal",
                spacing: 5,
                children: [
                  {
                    type: "button",
                    label: "0",
                    onClick: () => this.handleNumber("0")
                  },
                  {
                    type: "button",
                    label: ".",
                    onClick: () => this.handleNumber(".")
                  },
                  {
                    type: "button",
                    label: "=",
                    onClick: this.calculate
                  },
                  {
                    type: "button",
                    label: "+",
                    onClick: () => this.handleOperator("+")
                  }
                ]
              },
              // Clear button
              {
                type: "button",
                label: "Clear",
                onClick: this.clear
              }
            ]
          }
        ]
      }]
    };

    this.renderer.render(ui);
  }
}

// Start the application
new CalculatorApp();