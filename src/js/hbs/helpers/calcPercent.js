module.exports = (currentValue, startValue, endValue) => {
  return Math.round(
    (currentValue - startValue) / ((endValue - startValue) / 100)
  );
};
