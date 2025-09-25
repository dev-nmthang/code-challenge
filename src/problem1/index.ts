export const sum_to_n_a = (n: number): number => {
  if (n >= 0) {
    return (n * (n + 1)) / 2;
  } else {
    const m = Math.abs(n);
    return -(m * (m + 1)) / 2;
  }
};

export const sum_to_n_b = (n: number): number => {
  let sum = 0;
  
  if (n >= 0) {
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
  } else {
    for (let i = -1; i >= n; i--) {
        sum += i;
    }
  }
  
  return sum;
};

export const sum_to_n_c = (n: number): number => {
  if (n === 0) return 0;
  
  if (n > 0) {
    return n + sum_to_n_c(n - 1);
  } else {
    return n + sum_to_n_c(n + 1);
  }
};
