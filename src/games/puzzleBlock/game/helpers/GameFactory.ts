import BaseGameFactory from "./BaseGameFactory.ts";
import Cell from "../entites/cells/Cell.ts";
import Square from "../entites/cellItems/squares/Square.ts";
import SquaresGroupView from "../entites/squaresGroup/SquaresGroupView.ts";
import GridArea from "../entites/grid/GridArea.ts";
import SpawnArea from "../entites/spawn/SpawnArea.ts";
import Hammer from "../entites/boosters/Hammer.ts";
import Ice from "../entites/blockers/Ice.ts";
import Gem from "../entites/gems/Gem.ts";
import Lightning from "../entites/helpers/Lightning.ts";
import Crystal from "../entites/cellItems/crystals/Crystal.ts";
import Star from "../entites/star/Star.ts";
import Shadow from "../entites/shadows/Shadow.ts";

export let gameFactory;

export default class GameFactory extends BaseGameFactory {
  constructor(data) {
    super(data);
  }

  createCell(data) {
    const {row, column, ...rest} = data;

    const id = `${row}-${column}`;
    const name = `cell:${id}`;

    return {props: {id, name, ...rest}, Constructor: Cell};
  }

  createSquare(data) {
    const {id, ...rest} = data;

    const name = `square:${id}`;

    return {props: {id, name, ...rest}, Constructor: Square};
  }

  createSquaresGroupView(data) {
    const {id, shape, squareViewId, ...rest} = data;

    const name = `squaresGroupView:${id}`;

    return {props: {id, shape, name, squareViewId, ...rest}, Constructor: SquaresGroupView};
  }

  createGridArea(data) {
    const {id, ...rest} = data;

    return {props: {id, name: id, ...rest}, Constructor: GridArea};
  }

  createSpawnArea(data) {
    const {id, ...rest} = data;

    return {props: {id, name: id, ...rest}, Constructor: SpawnArea};
  }

  createHammer(data) {
    const {id, ...rest} = data;

    return {props: {id, name: id, ...rest}, Constructor: Hammer};
  }

  createIce(data) {
    return {props: {...data}, Constructor: Ice};
  }

  createGem(data) {
    return {props: {...data}, Constructor: Gem};
  }

  createLightning(data) {
    return {props: {...data}, Constructor: Lightning};
  }

  createCrystal(data) {
    const {id, ...rest} = data;

    const name = `crystal:${id}`;

    return {props: {id, name, ...rest}, Constructor: Crystal};
  }

  createStar(data) {
    return {props: {...data, id: "star", name: "star"}, Constructor: Star};
  }

  createShadow(data) {
    const {id, ...rest} = data;

    const name = `shadow:${id}`;

    return {props: {name, ...rest}, Constructor: Shadow};
  }
}

export const createGameFactory = data => gameFactory ?? (gameFactory = new GameFactory(data));


