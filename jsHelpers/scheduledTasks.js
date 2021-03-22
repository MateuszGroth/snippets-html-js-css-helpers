synchronous(() => console.log('synchronous 1'));
task(() => console.log('task 1'));
microTask(() => console.log('microtask 1'));
task(() => console.log('task 2'));
synchronous(() => console.log('synchronous 2'));
microTask(() => console.log('microtask 2'));
nanoTask(() => console.log('nanotask 1'));

// ? should print
/*
    synchronous 1
    synchronous 2
    nanotask 1
    microtask 1
    microtask 2
    task 1
    task 2
*/

// synchronous - executes immedietly, does not let the event loop spin without fulfilling the callback
function synchronous(cb) {
  cb();
}

// task - schedules a task and executes when it is free - lowest priority
function task(cb) {
  const mc = new MessageChannel();
  mc.port1.postMessage(null);
  mc.port2.addEventListener(
    'message',
    () => {
      cb();
    },
    { once: true }
  );
  mc.port2.start();

  // !this does not work - when it is postponed multiple times it might get a bigger delay by the browser
  // ! - not 0 ms just like 4ms
  setTimeout(() => cb(), 0);
}

// microTask - schedules a task and executes when it is free - higher priority than task
function microTask(cb) {
  Promise.resolve().then(cb);
  // ? Or
  queueMicrotask(cb);

  // !this does not work - it is called like synchronous cb
  new Promise((resolve) => {
    resolve();
    cb();
  });
}

// ! nanoTask exists only in nodejs (the process.nextTick)
// nanoTask - schedules a task and executes when it is free - higher priority than microTask
function nanoTask(cb) {
  process.nextTick(cb);
}
