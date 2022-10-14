import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

// const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=0';

const endpoint = 'http://localhost:3333/api/facts';

const fetchData = () => {
  return fromFetch(endpoint).pipe(
    tap(clearError),
    mergeMap((response) => {
      if (response.ok) {
        return response.json()
      } else {
        // return of({ error: 'Something went wrong.'})
        throw new Error('Something went wrong happened')
      }
    }),
    retry(3),
    catchError((error) => {
      console.log("catch error")
      return of({ error: error.message})
    })
  )
}

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true))
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false))

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap(shouldFetch => {
    if (shouldFetch) {
      return timer(0, 5000).pipe(
        tap(clearError),
        tap(clearFacts),
        exhaustMap(fetchData)
      )
    } else {
      return NEVER
    }
  })
)

factStream$.subscribe(addFacts)

// fetch$.subscribe(addFacts)
// fetch$.subscribe(({ facts, error }) => {
//   if (error) {
//     return setError(error)
//   }

//   clearFacts()
//   addFacts({ facts })
// })