function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function mongooseValidationMessage(err) {
  return Object.values(err.errors).map((e) => e.message).join(' ');
}

module.exports = {
  httpError,
  mongooseValidationMessage,
};
