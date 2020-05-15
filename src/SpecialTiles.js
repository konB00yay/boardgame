const ABRA_ONE = 12;
const ABRA_TWO = 29;
const PIKACHU = 5;
const MISSINGNO = 58;
// const LAPRAS = 39;
// const SS_ANNE = 19;
const BICYCLE = 21;
const HAUNTER = 28;
// const RARE_CANDY = 42;

const HARD_STOPS = [7, 14, 20, 33, 44, 53, 59, 64, 69, 70, 71, 72];

export const haunter = space => {
  return space === HAUNTER;
};

export const missingnoReset = space => {
  return space === MISSINGNO;
};

export const pikachu = space => {
  return space === PIKACHU;
};

export const bike = space => {
  if (space === BICYCLE) {
    return 2;
  }
  return 1;
};

export const onAbra = space => {
  if (space === ABRA_ONE) {
    return ABRA_TWO;
  } else if (space === ABRA_TWO) {
    return ABRA_ONE;
  } else {
    return space;
  }
};

export const stopAtGym = data => {
  let oldPosition = data.positions[data.thisPlayer];
  for (const stop of HARD_STOPS) {
    if (oldPosition < stop && data.space > stop) {
      return { newPosition: stop, gym: true };
    }
  }
  return { newPosition: data.space, gym: false };
};
