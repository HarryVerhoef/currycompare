import { SearchRadius } from "../../../../codecs/SearchRadius";
import { getCurryhouses } from "../../../../utils/api";

describe("GET /curryhouses", () => {
  it("should return a 400 if the latitude is below the bottom limit", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "-91",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type",
      );

      expect(response.status).toBe(400);
    }
  });

  it("should return a 400 if the latitude is above the top limit", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "90.0001",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type",
      );

      expect(response.status).toBe(400);
    }
  });

  it("should return a 200 if the latitude is within range", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "75.0023",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
  });

  it("should return a 400 if the longitude is below the bottom limit", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "42",
        lng: "-181",
        rad: SearchRadius.HUNDRED,
      },
    });

    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type",
      );
    }
  });

  it("should return a 400 if the longitude is above the top limit", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "42",
        lng: "180.0000001",
        rad: SearchRadius.HUNDRED,
      },
    });

    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type",
      );
    }
  });

  it("should return a 200 if the longitude is within range", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "42",
        lng: "-179.999",
        rad: SearchRadius.HUNDRED,
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
  });

  it("should return a 400 if the search radius is not one of ONE, FIVE, TEN, FIFTY, HUNDRED", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "42",
        lng: "-179.999",
        rad: "TWELVE" as SearchRadius,
      },
    });

    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
    if (!response.success) {
      expect(response.reason).toBe(
        "Unable to parse request query params: Unexpected type",
      );
    }
  });

  it("should return Clapham Curries when in the search radius", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "-0.149",
        lng: "51.457",
        rad: SearchRadius.ONE,
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    if (response.success) {
      expect(response.data).toEqual({
        curryhouses: [
          {
            id: "clapham-curries",
            title: "Clapham Curries",
            email: "clapham.curries@currycompare.com",
            lat: -0.149302,
            lng: 51.457992,
            phoneNumber: "0777777777",
          },
        ],
      });
    }
  });

  it("should not return Clapham Curries because it's outside the search radius", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "0",
        lng: "51",
        rad: SearchRadius.ONE,
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    if (response.success) {
      expect(response.data).toEqual({ curryhouses: [] });
    }
  });

  it("should return Clapham Curries and Battersea Bhunas when in the search radius", async () => {
    const response = await getCurryhouses({
      query: {
        lat: "-0.14",
        lng: "51.45",
        rad: SearchRadius.HUNDRED,
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    if (response.success) {
      expect(response.data).toEqual({
        curryhouses: [
          {
            id: "clapham-curries",
            title: "Clapham Curries",
            email: "clapham.curries@currycompare.com",
            lat: -0.149302,
            lng: 51.457992,
            phoneNumber: "0777777777",
          },
          {
            id: "battersea-bhunas",
            title: "Battersea Bhunas",
            email: "battersea.bhunas@currycompare.com",
            phoneNumber: "0777777778",
            lat: -0.144589,
            lng: 51.481811,
          },
        ],
      });
    }
  });
});
