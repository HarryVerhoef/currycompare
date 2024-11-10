import { getCurryhouse } from "../../../../../utils/api";

describe("GET /curryhouse/{curryHouseId}", () => {
  it("return a 404 if the curryhouse does not exist", async () => {
    const response = await getCurryhouse({
      pathParams: {
        curryHouseId: "123",
      },
    });

    expect(response.success).toBe(false);
    expect(response.status).toBe(404);
  });

  it("should return a curryhouse if it exists", async () => {
    const response = await getCurryhouse({
      pathParams: {
        curryHouseId: "clapham-curries",
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);

    if (response.success) {
      expect(response.data).toEqual({
        curryhouse: {
          id: "clapham-curries",
          title: "Clapham Curries",
          phoneNumber: "0777777777",
          lat: -0.149302,
          lng: 51.457992,
          email: "clapham.curries@currycompare.com",
          approved: false,
          websiteUrl: undefined,
          description: undefined,
        },
      });
    }
  });
});
