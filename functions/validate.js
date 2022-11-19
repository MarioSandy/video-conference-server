function invalid(required) {
  if (required === false) {
    return undefined;
  }
  return false;
}

function validateParameterString(param, required) {
  if (typeof param === "string" && typeof param !== "undefined") {
    return param;
  } else {
    invalid(required);
  }
}

function validateParameterInteger(param, required) {
  if (Number.isInteger(+param) && param !== "") {
    return +param;
  } else {
    invalid(required);
  }
}

function validateParameterArrayOfInteger(param, required) {
  if (param !== undefined && param.length) {
    if (!param.some(isNaN)) {
      return param;
    }
  } else {
    invalid(required);
  }
}

function validateParameterDecimal(param, required) {
  if (!!param % 1) {
    return param;
  } else {
    invalid(required);
  }
}

function validateParameterBoolean(param, required) {
  if (typeof param === "boolean") {
    return param;
  } else {
    invalid(required);
  }
}

module.exports = {
  validateParameterString,
  validateParameterInteger,
  validateParameterArrayOfInteger,
  validateParameterDecimal,
  validateParameterBoolean,
};
