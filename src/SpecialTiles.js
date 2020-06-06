const ABRA_ONE = 12;
const ABRA_TWO = 29;
const PIKACHU = 5;
const CATERPIE = 4;
const MISSINGNO = 58;
const BICYCLE = 21;
const HAUNTER = 28;
const EVOLVE = 35;
const GYMFIVE = 44;

const HARD_STOPS = [7, 14, 20, 33, 44, 53, 59, 64, 69, 70, 71, 72];

export const haunter = space => {
  return space === HAUNTER;
};

export const evolve = space => {
  return space === EVOLVE;
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

export const caterpie = space => {
  return space === CATERPIE;
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

export const gymFive = data => {
  return data.oldPosition < GYMFIVE && data.newPosition >= GYMFIVE;
};

export const stopAtGym = data => {
  let oldPosition = data.positions[data.thisPlayer];
  for (const stop of HARD_STOPS) {
    if (oldPosition < stop && data.space >= stop) {
      return { newPosition: stop, gym: true };
    }
  }
  return { newPosition: data.space, gym: false };
};
