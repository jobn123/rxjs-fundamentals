import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import { pluck, concatMap, take, map, mergeMap } from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

// pick one by one
// const character$ = from(getCharacter(1)).pipe(pluck('name'));

// pick four
const character$ = of(1, 2, 3, 4).pipe(
  mergeMap((n) => from(getCharacter(n))), 
);
character$.subscribe(render);
