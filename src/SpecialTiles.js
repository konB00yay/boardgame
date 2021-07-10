const ABRA_ONE = 12;
const ABRA_TWO = 29;
const PIKACHU = 5;
const CATERPIE = 4;
const MISSINGNO = 58;
const BICYCLE = 21;
const HAUNTER = 26;
const EVOLVE = 35;
const GYMFIVE = 44;

const ILEX = [15, 16, 17, 18];
const SLOWPOKE = 12;
const SWAP = 4;
const SNUBBULL = 31;
const MANTINE = 35;

const HARD_STOPS_GEN1 = [7, 14, 20, 33, 44, 53, 59, 64, 69, 70, 71, 72];
const HARD_STOPS_GEN2 = [7, 13, 21, 27, 33, 36, 51, 62, 69, 70, 71, 72];

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
  if(data.gen === 1){
    for (const stop of HARD_STOPS_GEN1) {
      if (oldPosition < stop && data.space >= stop) {
        return { newPosition: stop, gym: true };
      }
    }
  }
  if(data.gen === 2){
    for (const stop of HARD_STOPS_GEN2) {
      if (oldPosition < stop && data.space >= stop) {
        return { newPosition: stop, gym: true };
      }
    }
  }
  return { newPosition: data.space, gym: false };
};

export const ilexReset = data => {
  if(ILEX.includes(data.position) && [5,6].includes(data.roll)){
    return 15;
  }
  else{
    return data.newPosition;
  }
}

export const slowpoke = space => {
  return space === SLOWPOKE;
}

export const swap = space => {
  return space === SWAP;
}

export const snubbull = space => {
  return space === SNUBBULL;
}

export const mantine = space => {
  return space === MANTINE;
}