import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  pluck,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/search/';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  // if last value same as previous value not fire
  distinctUntilChanged(),
  // switchMap can ignore previous results
  switchMap((searchTerm) => {
    return fromFetch(endpoint + searchTerm).pipe(
      mergeMap((response) => response.json())
    )
  }),
  tap(clearResults),
  pluck('pokemon'),
  tap(addResults)
);

search$.subscribe()