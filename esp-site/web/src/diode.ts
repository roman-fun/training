import { div, label } from "./html";

export class Diode {
    _r: number;
    _g: number;
    _b: number;
    _i: number;
    _w: number;
    _m: boolean;
    controls: HTMLDivElement;
    strip: DiodeStrip | undefined;
    static maxWidth: number = 100;

    get r(): number {
        return this._r;
    }
    set r(r: number) {
        this._r = r;
        this.refresh(false);
    }
    get g(): number {
        return this._g;
    }
    set g(g: number) {
        this._g = g;
        this.refresh(false);
    }
    get b(): number {
        return this._b;
    }
    set b(b: number) {
        this._b = b;
        this.refresh(false);
    }

    get index(): number {
        return this._i;
    }
    set index(index: number) {
        this._i = index;
        this.refresh(false);
    }

    get manual(): boolean {
        return this._m;
    } 
    get width(): number {
        return this._w;
    }

    public root: HTMLDivElement;
    public thumbRoot: HTMLDivElement;

    constructor(index: number, strip?: DiodeStrip | undefined) {
        this.strip = strip;
        this._i = index;
        let l = label(`${index + 1}`);
        this.root = div('diode', [l]);
        this.thumbRoot = div('diode-thumb');
        this._r = 0;
        this._g = 0
        this._b = 0;
        this._w = 10;
        this._m = false;

        let input: HTMLInputElement = document.createElement('input');
        input.value = this.getRGB();
        input.type = 'color';
        l.appendChild(input);
        input.addEventListener('change', (_) => {
            this._m = true;
            this.setRGB(input.value);
        });

        let widthInput: HTMLInputElement = document.createElement('input');
        widthInput.type = 'range';
        widthInput.max = Diode.maxWidth.toString();
        widthInput.min = '0';
        widthInput.valueAsNumber = this._w;
        widthInput.addEventListener('change', () => {
            this._w = widthInput.valueAsNumber;
            this.refresh();
        });

        let deleteLink: HTMLAnchorElement = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.innerText = 'Убрать';
        deleteLink.addEventListener('click', () => {
            this._m = false;
            this.refresh();
        });

        this.controls = div('diode-controls', [widthInput, deleteLink]);

        this.root.appendChild(this.controls);
        this.refresh(false);
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

    public refresh(notify: boolean = true) {
        this.controls.style.display = this._m ? 'flex' : 'none';
        this.root.style.backgroundColor = this.getRGB();
        this.thumbRoot.style.backgroundColor = this.getRGB();
        if (this.strip != null && notify)
          this.strip.refresh(this);
    }
}

export class DiodeStrip {
    public diodes: Diode[];
    public root: HTMLDivElement;
    public thumbRoot: HTMLDivElement;
    length: number;

    constructor(length: number) {
        this.length = length;
        this.root = div('diode-strip');
        this.thumbRoot = div('diode-strip-thumb');
        this.diodes = new Array<Diode>(length);
        for (let i = 0; i < length; i++)
            this.diodes[i] = new Diode(i, this);

            this.diodes.forEach((d) => this.root.append(d.root));
            this.diodes.forEach((d) => this.thumbRoot.append(d.thumbRoot));
        }

    public refresh(d: Diode): void {
        let manualDiodes:Array<Diode> = [];
        this.diodes.forEach((d) => {
            if (d.manual)
              manualDiodes.push(d);
        });

        for (let d of this.diodes) {
            if (!d.manual) {
                let mr = 0;
                let mg = 0;
                let mb = 0;
                for (let md of manualDiodes) {
                    let distance = Math.abs(md.index - d.index);
                    let maxWidth = ((md.width) * this.length / 100);
                    let q = (maxWidth - distance) / maxWidth;
                    mr = Math.max(md.r * q, mr);
                    mg = Math.max(md.g * q, mg);
                    mb = Math.max(md.b * q, mb);
                  
                    //r = md.r * distance / ((md.width) * this.length / 100);
                }
                d._r = mr;
                d._g = mg;
                d._b = mb;
                d.refresh(false);
            }

        }

    }
}

