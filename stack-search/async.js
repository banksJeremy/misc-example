(function() {
'use strict';

/**
 * Await/async-style async functions using generators, using `yield` for `await`.
 * 
 * const getName = async(function*(dataUrl) {
 *   const response = yield fetch(dataUrl);
 *   const data = yield response.json();
 *   return data.name;
 * });
 */
const async = (generator) => () => {
  const args = arguments
  return new Promise((resolve, reject) => {
    const iterator = generator.apply(null, args);

  	const runNext = (lastResult) => {
  		try {
  			const next = iterator.next(lastResult);

  			if (next.done) {
  				resolve(next.value);
  	      iterator = null;
  			} else {
  				next.value.then((result) => {
  					runNext(result)
  				}, (error) => {
  					reject(error);
  				});
  			}
  		} catch (ex) {
  			reject(ex);
  		}
  	};

    async.do(() => runNext(undefined));
  });
}

/**
 * Promise-calls a function in a microtask.
 * @param {function()} f
 * @return {Promise}
 */
async.do = (f) => Promise.resolve().then(() => f());

/**
 * @param {duration} A duration in milliseconds.
 * @return {Promise} A promise that will resolve after duration has elasped.
 */
async.waitForDuration = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
};

/**
 * @param {EventTarget} target The target where we're waiting for the event.
 * @param {string} eventName The name of the event we're listening for.
 * @return {Promise} A promise that will resolve with event instance the next
 *     time the named event fires on target.
 */
async.waitForEvent = (target, eventName) => {
  return new Promise(resolve => {
    const listener = (event) => {
      resolve(event);
      target.removeEventListener(eventName, listener);
    };
    target.addEventListener(eventName, listener);
  });
};

window.async = async;

}());
