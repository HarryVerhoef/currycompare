import { SearchRadius } from "../../../../../codecs/SearchRadius";
import {
  getCurryhouses,
  submitCurryhouseApplication,
} from "../../../../../utils/api";

describe("POST /curryhouse/application", () => {
  it("should return a 400 if an invalid phone number is given", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "0123",
        lat: "90",
        lng: "90",
        contactEmail: "benjamin@billingshurstbhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
      },
    });

    console.log(response);

    expect(response.success).toBe(false);
    console.log(response);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type",
      );
      expect(response.status).toBe(400);
    }
  });

  it("should return a 400 if a latitude out of range is given", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: "95",
        lng: "90",
        contactEmail: "benjamin@billingshurstbhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
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

  it("should return a 400 if a longitude out of range is given", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "190",
        contactEmail: "benjamin@billingshurstbhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
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

  it("should return a 400 if the provided contact email is invalid", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "benjamin@billingshurst@bhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
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

  it("should return a 400 if the provided website URL is invalid", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "benjamin@billingshurstbhajis.com",
        websiteUrl: "postgres://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
      },
    });

    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.reason).toBe(
        "There was an error parsing the request: Unexpected type, Unexpected type",
      );
      expect(response.status).toBe(400);
    }
  });

  it("should insert a curryhouse application", async () => {
    const response = await submitCurryhouseApplication({
      body: {
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "benjamin@billingshurstbhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
      },
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(204);

    const response2 = await getCurryhouses({
      query: {
        lat: "90",
        lng: "90",
        rad: SearchRadius.ONE,
      },
    });

    expect(response2.success).toBe(true);
    expect(response2.status).toBe(200);
    if (response2.success) {
      console.log(response2);
      expect(response2.data.curryhouses[0]).toMatchObject({
        title: "Billingshurst Bhajis",
        phoneNumber: "07777777777",
        lat: 90,
        lng: 90,
        email: "benjamin@billingshurstbhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Your local bhaji focussed curryhouse",
        approved: false,
      });
    }
  });
});
