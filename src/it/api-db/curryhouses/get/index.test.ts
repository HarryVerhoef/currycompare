import { SearchRadius } from "../../../../codecs/SearchRadius";
import { getCurryhouses } from "../../../../utils/api";

describe("GET /curryhouses", () => {
  it("should return a 400 if the latitude is below -91", async () => {
    // Need to wrap HTTP response with status code etc, maybe a tagged union
    const curryhouses = await getCurryhouses({
      query: {
        lat: -91,
        lng: 10,
        rad: SearchRadius.FIVE,
      },
    });
  });
});
