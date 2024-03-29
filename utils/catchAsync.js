// CatchAsync to handle error in async functions
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
