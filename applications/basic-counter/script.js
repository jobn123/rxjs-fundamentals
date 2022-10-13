import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

let tick$ = interval(1000);
let subscription$;

start$.subscribe(() => {

  if (subscription$) {
    subscription$.unsubscribe();
  }

  subscription$ = tick$.subscribe(setCount)
})

pause$.subscribe(() => subscription$.unsubscribe())