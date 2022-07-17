import { div, label } from "./html";

export class Diode {
    _r: number;
    _g: number;
    _b: number;
    _number: number;
    _w: number;
    _s: boolean;
    controls: HTMLDivElement;
    refreshCallback: (d: Diode) => void;

    get r(): number {
        return this._r;
    }
    set r(r: number) {
        this._r = r;
        this.refresh();
    }
    get g(): number {
        return this._g;
    }
    set g(g: number) {
        this._g = g;
        this.refresh();
    }
    get b(): number {
        return this._b;
    }
    set b(b: number) {
        this._b = b;
        this.refresh();
    }

    get number(): number {
        return this._number;
    }
    set number(number: number) {
        this._number = number;
        this.refresh();
    }
    public root: HTMLDivElement;

    constructor(number: number, refreshCallback: (d: Diode) => void) {
        this.refreshCallback = refreshCallback;
        this._number = number;
        let l = label(`${number}`);
        this.root = div('diode', [l]);
        this._r = 0;
        this._g = 0
        this._b = 0;
        this._w = 0;
        this._s = false;

        let input: HTMLInputElement = document.createElement('input');
        input.value = this.getRGB();
        input.type = 'color';
        l.appendChild(input);
        input.addEventListener('change', (_) => {
            this._s = true;
            this.setRGB(input.value);
        });

        let widthInput: HTMLInputElement = document.createElement('input');
        widthInput.type = 'range';
        widthInput.valueAsNumber = this._w;
        widthInput.addEventListener('change', () => {
            this.refresh();
        });

        let deleteLink: HTMLAnchorElement = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.innerText = 'Убрать';
        deleteLink.addEventListener('click', () => {
            this._s = false;
            this.refresh();
        });

        this.controls = div('diode-controls', [widthInput, deleteLink]);

        this.root.appendChild(this.controls);
        this.refresh();
    }

    setRGB(hex: string) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this._r = parseInt(result[1], 16);
            this._g = parseInt(result[2], 16);
            this._b = parseInt(result[3], 16);
            this.refresh();
        }
    }

    getRGB() {
        return `rgb(${this._r}, ${this._g}, ${this._b})`;
    }

    public refresh() {
        this.controls.style.display = this._s ? 'flex' : 'none';
        this.root.style.backgroundColor = this.getRGB();
        this.refreshCallback(this);
    }
}

export class DiodeStrip {
    public diodes: Diode[];
    public root: HTMLDivElement;

    constructor(length: number) {
        this.root = div('diode-strip');

        this.diodes = new Array<Diode>(length);
        for (let i = 0; i < length; i++)
            this.diodes[i] = new Diode(i + 1, this.refreshCallback);

        this.diodes.forEach((d) => this.root.append(d.root));
    }

    refreshCallback(d: Diode): void {

    }
}

