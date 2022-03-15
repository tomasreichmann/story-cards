import { PlaceEnum } from '../../gameModel';
import { CharacterTypeEnum } from '../../types';

export type PlaceType = {
  type: PlaceEnum;
  isLit?: boolean;
  characters: CharacterType[];
};

export type CharacterType = {
  type: CharacterTypeEnum;
  placeIndex: number | null;
};

export type PlayerType = CharacterType & {
  name: string;
  type: CharacterTypeEnum.Player;
  hp: number;
};

export enum FacingEnum {
  Left = 'Left',
  Front = 'Front',
  Right = 'Right',
}

export type GuardType = CharacterType & {
  type: CharacterTypeEnum.Guard;
  hp: number;
  facing: FacingEnum;
  placeIndex: number | null;
};
