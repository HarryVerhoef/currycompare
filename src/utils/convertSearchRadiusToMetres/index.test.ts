import convertSearchRadiusToMetres from ".";
import { SearchRadius } from "../../codecs/SearchRadius";

describe("convertSearchRadiusToMetres", () => {
  it.each([
    [SearchRadius.ONE, 1609.34],
    [SearchRadius.FIVE, 8046.72],
    [SearchRadius.TEN, 16093.4],
    [SearchRadius.FIFTY, 80467.2],
    [SearchRadius.HUNDRED, 160934],
  ])("convertSearchRadiusToMetres(%i) = %i", (radius, expected) => {
    expect(convertSearchRadiusToMetres(radius)).toBe(expected);
  });
});
