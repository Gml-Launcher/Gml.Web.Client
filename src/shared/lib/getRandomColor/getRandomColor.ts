import {faker} from '@faker-js/faker';
import {colord} from 'colord';
import {tychei} from 'seedrandom';

interface getRandomColorScheme {
  length: number
}

function makeNumberRangeGenerator(seed: string) {
  const rng = tychei(seed);
  return ({min, max}: { min: number; max: number }) => {
    return Math.floor(
      min > max
        ? max + rng.double() * (min - max + 1)
        : min + rng.double() * (max - min + 1)
    );
  };
}

export const getRandomColor = ({length}: getRandomColorScheme) => {
  return Array.from({length}, (_, i) => {
    const value = faker.word.words();
    const getRange = makeNumberRangeGenerator(value);
    const lightness = getRange({min: 75, max: 90});
    const chroma = getRange({min: 10, max: 120});
    const hue = getRange({min: 0, max: 360});
    const bg = colord({
      l: lightness,
      c: chroma,
      h: hue,
    });
    const fgColor = bg.isLight() ? 'black' : 'white';
    return {id: i, value: hue, bgColor: bg.toHex(), fgColor};
  });
};
