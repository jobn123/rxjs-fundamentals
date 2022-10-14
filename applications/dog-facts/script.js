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

const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=2';

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  // use exhaustMap instead of mergeMap
  exhaustMap(() => {
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
  })
)

// fetch$.subscribe(addFacts)
fetch$.subscribe(({ facts, error }) => {
  if (error) {
    return setError(error)
  }

  clearFacts()
  addFacts({ facts })
})