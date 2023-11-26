const pad = (n: number) => (n < 10 ? `0${n}` : n);
export const calculateEventTime = (time?: number) => {
  if (time == null) {
    return {
      p: 0,
      m: 0,
      s: pad(0),
    };
  }
  const seconds = Math.floor(time % 60);
  if (time > 1800) {
    return {
      p: 1,
      m: Math.floor((time - 1800) / 60),
      s: pad(seconds),
    };
  } else if (time > 1200) {
    return {
      p: 2,
      m: Math.floor((time - 1200) / 60),
      s: pad(seconds),
    };
  } else if (time > 600) {
    return {
      p: 3,
      m: Math.floor((time - 600) / 60),
      s: pad(seconds),
    };
  } else {
    return {
      p: 4,
      m: Math.floor(time / 60),
      s: pad(seconds),
    };
  }
};
