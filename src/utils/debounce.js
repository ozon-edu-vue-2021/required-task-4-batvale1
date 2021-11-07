export function debounce(f, t) {
  let lastCallTimer = null;

  return function (args) {
    if (lastCallTimer) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => f(args), t);
  };
}
