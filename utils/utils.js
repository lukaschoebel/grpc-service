// Set of helper functions

/**
 * Returns a promise which times out after a specified interval
 * @param {number} interval Timeout interval.
 * @return {Promise}
 */
export async function sleep(interval) {
    return new Promise ((resolve) => {
        setTimeout(() => resolve(), interval);
    });
}