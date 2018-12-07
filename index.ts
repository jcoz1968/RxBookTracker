import { Observable, of, from, fromEvent, concat, interval, throwError, Subject, asyncScheduler, asapScheduler, queueScheduler, merge } from "rxjs";
import { ajax } from "rxjs/ajax";
import { publish, flatMap, mergeMap, filter, observeOn, tap, catchError, take, publishReplay, publishBehavior, takeUntil, multicast, refCount, publishLast } from 'rxjs/operators';
import { allBooks, allReaders } from "./data";
import { async } from "rxjs/internal/scheduler/async";

//#region creating observables

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

// let source1$ = of('hello', 10, true, allReaders[0].name);
// // source1$.subscribe(value => console.log(value));

// let source2$ = from(allBooks);
// // source2$.subscribe(book => console.log(book.title));

// concat(source1$, source2$)
//   .subscribe(value => console.log(value));

// let button = document.getElementById('readersButton');

// fromEvent(button, 'click')
//   .subscribe(event => {
//     console.log(event);

//     let readersDiv = document.getElementById('readers');

//     for(let reader of allReaders) {
//       readersDiv.innerHTML += reader.name + '<br />';
//     }
//   });

// let button = document.getElementById('readersButton');

// fromEvent(button, 'click')
//   .subscribe(event => {
//     ajax('/api/readers')
//     .subscribe(ajaxResponse => {
//       console.log(ajaxResponse);

//       let readers = ajaxResponse.response;

//     let readersDiv = document.getElementById('readers');

//     for(let reader of readers) {
//       readersDiv.innerHTML += reader.name + '<br />';
//     }

//     });
//   });

//#endregion

//#region subscribing to observables with observers

// let books$ = from(allBooks);

// let booksObserver = {
//     next: book => console.log(`Title: ${book.title}`),
//     error: err => console.log(`ERROR: ${err}`),
//     complete: () => console.log('All done!'),
// };

// books$.subscribe(
//     book => console.log(`Title: ${book.title}`),
//     err => console.log(`ERROR: ${err}`),
//     () => console.log('All done!'),
// );

// let currentTime$ = new Observable(subscriber => {
//     const timeString = new Date().toLocaleTimeString();
//     subscriber.next(timeString);
//     subscriber.complete();
// });

// currentTime$.subscribe(
//     currentTime => console.log(`Observer 1: ${currentTime}`)
// );

// setTimeout(() => {
//     currentTime$.subscribe(
//         currentTime => console.log(`Observer 2: ${currentTime}`)
//     );
// }, 1000);

// setTimeout(() => {
//     currentTime$.subscribe(
//         currentTime => console.log(`Observer 3: ${currentTime}`)
//     );
// }, 2000);

// let timesDiv = document.getElementById("times");
// let button = document.getElementById("timerButton");

// // let timer$ = interval(1000);

// let timer$ = new Observable<any>(subscriber => {
//    let i = 0;
//    let intervalId = setInterval(() => {
//       subscriber.next(i++);
//    }, 1000);

//    return () => {
//       console.log('Executing teardown code.');
//       clearInterval(intervalId);
//    }
// });

// let timerConsoleSubscription = timer$.subscribe(
//    value => console.log(`${new Date().toLocaleTimeString()} (${value})`)
// );

// let timerSubscription = timer$.subscribe(
//   value =>
//     (timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`),
//   null,
//   () => console.log("All done!")
// );

// timerSubscription.add(timerConsoleSubscription);

// fromEvent(button, "click").subscribe(event => timerSubscription.unsubscribe());

//#endregion

//#region using operators

// ajax('/api/errors/500')
//    .pipe(
//       mergeMap(ajaxResponse => ajaxResponse.response),
//       filter<any>(book => book.publicationYear < 1950),
//       tap(oldbook => console.log(`Title: ${oldbook.title}`)),
//       // catchError(err => of({title: 'Corduroy', author: 'Don Freeman'}))
//       // catchError((err, caught) => caught)
//       // catchError(err => throw `Something went wrong - ${err.message}`)
//       catchError(err => return throwError(err.message))
//    )
//    .subscribe(
//       finalValue => console.log(`VALUE: ${finalValue.title}`),
//       error => console.log(`ERROR: ${error}`)
//    );

// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');

// let timer$ = new Observable(subscriber => {
//    let i = 0;
//    let intervalId = setInterval(() => {
//       subscriber.next(i++);
//    }, 1000);

//    return () => {
//       console.log('Executing teardown code.');
//       clearInterval(intervalId)
//    }
// });

// let cancelTimer$ = fromEvent(button, 'click');

// timer$.pipe(
//    // take(3)
//    takeUntil(cancelTimer$)
// ).subscribe(
//    value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
//    null,
//    () => console.log('All done.')
// );

//#endregion

//#region creating operators

// function grabAndLogClassics(year, log) {
//    return source$ => {
//       return new Observable(subscriber => {
//          return source$.subscribe(
//             book => {
//                if (book.publicationYear < year) {
//                   subscriber.next(book);
//                   if(log) {
//                      console.log(`Classic: ${book.title}`);
//                   }
//                }
//             }, 
//             error => subscriber.error(error),
//             () => subscriber.complete()
//          )
//       });
//    }
// }

// function grabClassics(year) {
//    return filter(book => book.publicationYear < year);
// }

// function grabAndLogClassicsWithPipe(year, log) {
//    return source$ => source$.pipe(
//       filter(book => book.publicationYear < year),
//       tap(classicBook => log ? console.log(`Title: ${classicBook.title}`) : null)
//    )
// }

// ajax('/api/books')
//    .pipe(
//       flatMap(ajaxResponse => ajaxResponse.response),
//       // grabAndLogClassics(1930, false)
//       // filter<any>(book => book.publicationYear < 1950),
//       // tap(oldBook => console.log(`Title: ${oldBook.title}`))
//       // grabClassics(1950)
//       grabAndLogClassicsWithPipe(1930, true)
//    )
//    .subscribe(
//       finalValue => console.log(`VALUE: ${finalValue.title}`),
//       error => console.log(`ERROR: ${error}`),
//    );

//#endregion

//#region subjects

// let subject$ = new Subject();

// subject$.subscribe(
//    value => console.log(`Observer 1 ${value}`)
// );

// subject$.subscribe(
//    value => console.log(`Observer 2 ${value}`)
// );

// subject$.next('Hello!');

// let source$ = new Observable(subscriber => {
//    subscriber.next('Greetings!')
// });

// source$.subscribe(subject$);

// let source$ = interval(1000).pipe(
//    take(4),
//    // multicast(new Subject()),
//    // publish(),
//    // publishLast(),
//    // publishBehavior(42),
//    publishReplay(),
//    refCount()
// );

// // let subject$ = new Subject();
// // source$.subscribe(subject$);

// source$.subscribe(
//    value => console.log(`Observer 1: ${value}`)
// );

// setTimeout(() => {
//    source$.subscribe(
//       value => console.log(`Observer 2: ${value}`)
//    );
// }, 1000);

// setTimeout(() => {
//    source$.subscribe(
//       value => console.log(`Observer 3: ${value}`)
//    );
// }, 2000);

// setTimeout(() => {
//    source$.subscribe(
//       value => console.log(`Observer 4: ${value}`),
//       null,
//       () => console.log('Observer 4 complete')
//    );
// }, 4500);

// source$.connect();

//#endregion

//#region schedulers

// console.log('start script.');

// let queue$ = of('QueueScheduler (synchronous)', queueScheduler);

// let asap$ = of('AsapScheduler (async micro task)', asapScheduler);

// let async$ = of('AsyncScheduler (asynchronous)', asyncScheduler);

// merge(queue$, asap$, async$)
//    .subscribe(
//       value => console.log(value)
//    )

// console.log('end script.');

console.log('start script.');

from([1, 2, 3, 4], queueScheduler).pipe(
  tap(value => console.log(`Value: ${value}`)),
  observeOn(asyncScheduler),
  tap(value => console.log(`Doubled value: ${value * 2}`)),
).subscribe();

console.log('end script.');

//#endregion
