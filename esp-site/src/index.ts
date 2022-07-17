import '../css/style.css';
import {DiodeStrip} from './diode';
import { div } from './html';

let strip = new DiodeStrip(64);
let container = div('container', [strip.root]);

document.body.appendChild(container);   
document.body.appendChild(strip.thumbRoot);   