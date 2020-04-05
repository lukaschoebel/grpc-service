// Set of helper functions

/**
 * Returns a promise which times out after a specified interval
 * @param {number} interval Timeout interval
 * @return {Promise}
 */
export async function sleep(interval) {
    return new Promise ((resolve) => {
        setTimeout(() => resolve(), interval);
    });
}

/**
 * Determines if a given variable is a string or not.
 * @param {any} x Variable that has to be determined
 * @return {Boolean} returns true if x is a string
 */
export function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
}

/**
 * Specifies a deadline for a provided gRPC service.
 * @param {number} timeOut Optional deadline parameter in ms (default: 5000ms)
 * @return {Date} returns time after which the action is 
 */
export function getRPCDeadline(timeOut=5000) {
    return new Date(Date.now() + timeOut);
}

/**
 * Converts temperature in Fahrenheit to Celcius
 * @param {string} fahrenheit Specifies temperature in Fahrenheit
 * @return {string} returns converted temperature in Celcius
 */
export function convertF2C(fahrenheit) {
    return ((( fahrenheit - 32 ) * ( 5 / 9 )).toFixed(2)).toString();
}

/**
 * Converts temperature in Fahrenheit to Kelvin
 * @param {string} fahrenheit Specifies temperature in Fahrenheit
 * @return {string} returns converted temperature in Kelvin
 */
export function convertF2K(fahrenheit) {
    return ((( fahrenheit + 459.67 ) * ( 5 / 9 )).toFixed(2)).toString();
}
