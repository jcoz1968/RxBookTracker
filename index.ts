import { Observable, of, from, fromEvent, concat } from "rxjs";
import { allBooks, allReaders } from "./data";

// let allBooksObservable$ = Observable.create(subscriber => {
//   if(document.title !== 'RxBookTracker') {
//     subscriber.error('Incorrect page title.')
//   }
//   for (let book of allBooks) {
//     subscriber.next(book);
//   }

//   setTimeout(() => {
//     subscriber.complete();
//   }, 2000);

//   return () => console.log('executing teardown code.');

// });

// allBooksObservable$.subscribe(book => console.log(book.title));

let source1$ = of('hello', 10, true, allReaders[0].name);
// source1$.subscribe(value => console.log(value));

let source2$ = from(allBooks);
// source2$.subscribe(book => console.log(book.title));

concat(source1$, source2$)
  .subscribe(value => console.log(value));

