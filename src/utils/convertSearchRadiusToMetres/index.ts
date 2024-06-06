import { SearchRadius } from "../../codecs/SearchRadius";

const convertSearchRadiusToMetres = (s: SearchRadius): number =>
  ({
    [SearchRadius.ONE]: 1609.34,
    [SearchRadius.FIVE]: 8046.72,
    [SearchRadius.TEN]: 16093.4,
    [SearchRadius.FIFTY]: 80467.2,
    [SearchRadius.HUNDRED]: 160934,
  })[s];

export default convertSearchRadiusToMetres;
