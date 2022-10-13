import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setTextArea,
  setStatus,
} from './utilities';

// bounce time is ingore all events in xx seconds and operate last event
// throttle time is doing sth per xx seconds
// const buttonClicks$ = fromEvent(button, 'click').pipe(throttleTime(2000));

const panicClicks$ = fromEvent(panicButton, 'click')

const buttonClicks$ = fromEvent(button, 'click').pipe(debounce(() => panicClicks$));

// panicClicks$.subscribe();
buttonClicks$.subscribe(addMessageToDOM);
