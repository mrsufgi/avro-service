function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return (Number(n) === n && n % 1 !== 0) || isInt(n);
}

// safe long
function isLong(n) {
  return Number(n) === n && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER;
}

function isBool(bool) {
  Boolean(bool) === bool;
}

// lodash implemntation
function isString(val) {
  return (
    typeof val === 'string' ||
    (!!val && typeof val === 'object' && Object.prototype.toString.call(val) === '[object String]')
  );
}

module.exports = {
  isInt,
  isFloat,
  isLong,
  isBool,
  isString,
};
