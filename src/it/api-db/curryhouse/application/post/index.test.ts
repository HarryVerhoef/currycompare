import { SearchRadius } from "../../../../../codecs/SearchRadius";
import { UserRole } from "../../../../../prisma/generated";
import {
  getCurryhouses,
  submitCurryhouseApplication,
} from "../../../../../utils/api";
import jwt from "jsonwebtoken";

describe.skip("POST /curryhouse/application", () => {
  const authorization = jwt.sign(
    {
      "cognito:groups": [UserRole.CONSUMER],
    },
    "secret-key",
  );

  it("should return a 401 if the user is not authorised", async () => {
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

    expect(response.success).toBe(false);

    if (!response.success) {
      expect(response.reason).toBe(
        "You are not authorized to access this resource.",
      );
      expect(response.status).toBe(401);
    }
  });
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
      authorization,
    });

    expect(response.success).toBe(false);

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
      authorization,
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
      authorization,
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
      authorization,
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
      authorization,
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
      authorization,
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

  it("should insert a curryhouse application submit by an admin", async () => {
    const adminAuthorization = jwt.sign(
      {
        "cognito:groups": [UserRole.ADMIN],
      },
      "secret-key",
    );

    const response = await submitCurryhouseApplication({
      body: {
        title: "Manchester Makhanwalas",
        phoneNumber: "07777777777",
        lat: "45",
        lng: "45",
        contactEmail: "michael@manchestermakhanwalas.com",
        websiteUrl: "https://currycompare.com",
        description: "The best Makhanwala in Manny",
      },
      authorization: adminAuthorization,
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(204);

    const response2 = await getCurryhouses({
      query: {
        lat: "45",
        lng: "45",
        rad: SearchRadius.ONE,
      },
    });

    expect(response2.success).toBe(true);
    expect(response2.status).toBe(200);
    if (response2.success) {
      expect(response2.data.curryhouses[0]).toMatchObject({
        title: "Manchester Makhanwalas",
        phoneNumber: "07777777777",
        lat: 45,
        lng: 45,
        email: "michael@manchestermakhanwalas.com",
        websiteUrl: "https://currycompare.com",
        description: "The best Makhanwala in Manny",
        approved: false,
      });
    }
  });

  it("should insert a curryhouse application submit by a global admin", async () => {
    const adminAuthorization = jwt.sign(
      {
        "cognito:groups": [UserRole.GLOBAL_ADMIN],
      },
      "secret-key",
    );

    const response = await submitCurryhouseApplication({
      body: {
        title: "Birmingham Biryanis",
        phoneNumber: "07777777777",
        lat: "30",
        lng: "30",
        contactEmail: "Bill@BirminghamBhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Brum's finest biryanis",
      },
      authorization: adminAuthorization,
    });

    expect(response.success).toBe(true);
    expect(response.status).toBe(204);

    const response2 = await getCurryhouses({
      query: {
        lat: "30",
        lng: "30",
        rad: SearchRadius.ONE,
      },
    });

    expect(response2.success).toBe(true);
    expect(response2.status).toBe(200);
    if (response2.success) {
      expect(response2.data.curryhouses[0]).toMatchObject({
        title: "Birmingham Biryanis",
        phoneNumber: "07777777777",
        lat: 30,
        lng: 30,
        email: "Bill@BirminghamBhajis.com",
        websiteUrl: "https://currycompare.com",
        description: "Brum's finest biryanis",
        approved: false,
      });
    }
  });
});
