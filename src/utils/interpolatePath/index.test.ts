import { interpolatePath } from ".";

describe("interpolatePath", () => {
  it("should not change a path that passes undefined for pathParams param", () => {
    expect(interpolatePath("/curryhouse")).toBe("/curryhouse");
  });

  it("should not change a path that does not have any path params", () => {
    const pathParams = {
      curryHouseId: "123",
    };

    expect(interpolatePath("/curryhouse/curryHouseId", pathParams)).toBe(
      "/curryhouse/curryHouseId",
    );
  });

  it("should not interpolate a path that uses colons instead of curly braces", () => {
    const pathParams = {
      curryHouseId: "123",
    };

    expect(interpolatePath("/curryhouse/:curryHouseId", pathParams)).toBe(
      "/curryhouse/:curryHouseId",
    );
  });

  it("should interpolate a path with a single path param", () => {
    const pathParams = {
      curryHouseId: "123",
    };

    expect(interpolatePath("/curryhouse/{curryHouseId}", pathParams)).toBe(
      "/curryhouse/123",
    );
  });

  it("should interpolate a path with multiple path params", () => {
    const pathParams = {
      curryHouseId: "123",
      reviewId: "456",
    };

    expect(
      interpolatePath(
        "/curryhouse/{curryHouseId}/review/{reviewId}",
        pathParams,
      ),
    ).toBe("/curryhouse/123/review/456");
  });

  it("should throw an error if the path param is not provided", () => {
    const pathParams = {
      curryHouseId: "123",
    };

    expect(() => interpolatePath("/curryhouse/{reviewId}", pathParams)).toThrow(
      "No value provided for path param reviewId",
    );
  });

  it("should throw an error if the path calls for a path param and pathParams is undefined", () => {
    expect(() => interpolatePath("/curryhouse/{reviewId}")).toThrow(
      "No value provided for path param reviewId",
    );
  });
});
