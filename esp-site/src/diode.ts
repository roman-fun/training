import { div, label } from "./html";

export class Diode {
    static maxWidth: number = 100;

    r: number;
    g: number;
    b: number;
    index: number;
    width: number;
    manual: boolean;

    mr: number;
    mg: number;
    mb: number;

    controls: HTMLDivElement;
    strip: DiodeStrip | undefined;

    public root: HTMLDivElement;
    public thumbRoot: HTMLDivElement;

    constructor(index: number, strip?: DiodeStrip | undefined) {
        this.strip = strip;
        this.index = index;
        let l = label(`${index + 1}`);
        this.root = div('diode', [l]);
        this.thumbRoot = div('diode-thumb');
        this.r = 0;
        this.g = 0
        this.b = 0;
        this.mr = 0;
        this.mg = 0
        this.mb = 0;
        this.width = 10;
        this.manual = false;

        let input: HTMLInputElement = document.createElement('input');
        input.value = this.getRGB();
        input.type = 'color';
        l.appendChild(input);
        input.addEventListener('change', (_) => {
            this.setRGB(input.value);
        });

        let widthInput: HTMLInputElement = document.createElement('input');
        widthInput.type = 'range';
        widthInput.max = Diode.maxWidth.toString();
        widthInput.min = '1';
        widthInput.valueAsNumber = this.width;
        widthInput.addEventListener('change', () => {
            this.width = widthInput.valueAsNumber;
            this.refresh();
        });

        let deleteLink: HTMLAnchorElement = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.innerText = 'Убрать';
        deleteLink.addEventListener('click', () => {
            this.manual = false;
            this.refresh();
        });

        this.controls = div('diode-controls', [widthInput, deleteLink]);

        this.root.appendChild(this.controls);
        this.refresh(false);
    }

    setRGB(hex: string) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this.manual = true;
            this.mr = parseInt(result[1], 16);
            this.mg = parseInt(result[2], 16);
            this.mb = parseInt(result[3], 16);
            this.refresh();
        }
    }

    getRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    public refresh(notify: boolean = true) {
        this.controls.style.display = this.manual ? 'flex' : 'none';
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
        for (let d of this.diodes) {
                let mr = 0;
                let mg = 0;
                let mb = 0;
                for (let md of this.diodes) {
                    if (!md.manual)
                      continue;
                    let distance = Math.abs(md.index - d.index);
                    let maxWidth = ((md.width) * this.length / 50);
                    let q = (maxWidth - distance) / maxWidth;

                    mr += Math.max(0, md.mr * q);
                    mg += Math.max(0, md.mg * q);
                    mb += Math.max(0, md.mb * q);                  
                    //r = md.r * distance / ((md.width) * this.length / 100);
                }
                d.r = Math.min(mr, 255);
                d.g = Math.min(mg, 255);
                d.b = Math.min(mb, 255);
                d.refresh(false);
        }
    }
}

