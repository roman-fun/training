
export function div(cls: string, children: Element[] = []): HTMLDivElement {
    let d = document.createElement('div');
    d.classList.add(cls);
    children.forEach((c) => d.appendChild(c));
    return d;
}

export function label(text: string): HTMLSpanElement {
    let d = document.createElement('label');
    d.innerText = text;
    return d;
}