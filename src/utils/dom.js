import { fromEvent } from 'rxjs';
import { share } from 'rxjs/operators';

// https://github.com/vuejs/vue-rx
export const resizeObserver = fromEvent(global, 'resize').pipe(share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }));
export const keyPressObserver = fromEvent(global, 'keypress').pipe(share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }));
export const keyUpObserver = fromEvent(global, 'keyup').pipe(share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }));

// keyUpObserver

// // ArrowDown, ArrowUp

// //   .pipe(filter(({ key }) => key === 'PrintScreen'))
//   .subscribe((e) => {
//     console.log(e);
//   });
