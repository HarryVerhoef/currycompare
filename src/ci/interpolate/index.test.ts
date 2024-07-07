import { resolve } from "path";
import interpolate from ".";
import { readFile, writeFile } from "fs/promises";

describe("interpolate", () => {
  const restoreToSnapshot = async (filename: string): Promise<void> => {
    const testFileRelativePath = `./test-params/${filename}`;
    const snapshotRelativePath = `./test-params/snapshots/${filename}`;

    const snapshotContents = await readFile(
      resolve(__dirname, snapshotRelativePath),
      { encoding: "utf8" },
    );

    const snapshotJson = JSON.parse(snapshotContents);

    await writeFile(
      resolve(__dirname, testFileRelativePath),
      JSON.stringify(snapshotJson, null, 2),
      { encoding: "utf8" },
    );
  };

  afterAll(async () => {
    process.env.TEST_VAR_0 = undefined;
    process.env.TEST_VAR_1 = undefined;
    process.env.TEST_VAR_2 = undefined;
    process.env.TEST_VAR_3 = undefined;
    process.env.TEST_VAR_4 = undefined;
    process.env.TEST_VAR_5 = undefined;
    process.env.TEST_VAR_6 = undefined;
    await restoreToSnapshot("interpolation-1.json");
    await restoreToSnapshot("interpolation-2.json");
    await restoreToSnapshot("interpolation-3.json");
  });

  it("should throw an error if the file does not exist", async () => {
    await expect(interpolate("./test.json")).rejects.toThrow();
  });

  it("should throw an error if the file extension is not .json", async () => {
    await expect(
      interpolate("./test-params/wrong-file-type.txt"),
    ).rejects.toThrow("CloudFormation parameters file must be JSON");
  });

  it("should throw an error if the JSON object is not an array", async () => {
    await expect(
      interpolate("./test-params/wrong-json-schema-1.json"),
    ).rejects.toThrow("Could not parse CloudFormation params");
  });

  it("should throw an error if the JSON array does not contain objects", async () => {
    await expect(
      interpolate("./test-params/wrong-json-schema-2.json"),
    ).rejects.toThrow("Could not parse CloudFormation params");
  });

  it("should throw an error if the JSON array objects do not contain ParameterKey", async () => {
    await expect(
      interpolate("./test-params/wrong-json-schema-3.json"),
    ).rejects.toThrow("Could not parse CloudFormation params");
  });

  it("should throw an error if the JSON array objects do not contain ParameterValue", async () => {
    await expect(
      interpolate("./test-params/wrong-json-schema-4.json"),
    ).rejects.toThrow("Could not parse CloudFormation params");
  });

  it("should not modify a JSON array with a single entry that does not need interpolation", async () => {
    const filePath = "./test-params/no-interpolation-1.json";
    const absolutePath = resolve(__dirname, filePath);

    const contentsBefore = await readFile(absolutePath, { encoding: "utf8" });
    const jsonBefore = JSON.parse(contentsBefore);

    await interpolate(filePath);

    const contentsAfter = await readFile(absolutePath, { encoding: "utf8" });
    const jsonAfter = JSON.parse(contentsAfter);

    expect(jsonBefore).toEqual(jsonAfter);
  });

  it("should not modify a JSON array with multiple entries that dont need interpolation", async () => {
    const filePath = "./test-params/no-interpolation-2.json";
    const absolutePath = resolve(__dirname, filePath);

    const contentsBefore = await readFile(absolutePath, { encoding: "utf8" });
    const jsonBefore = JSON.parse(contentsBefore);

    await interpolate(filePath);

    const contentsAfter = await readFile(absolutePath, { encoding: "utf8" });
    const jsonAfter = JSON.parse(contentsAfter);

    expect(jsonBefore).toEqual(jsonAfter);
  });

  it("should throw an error if an attempt is made to interpolate an undefined environment variable", async () => {
    await expect(
      interpolate("./test-params/undefined-env-var.json"),
    ).rejects.toThrow("Environment variable TEST_VAR_0 is not set");
  });

  it("should interpolate a single entry with a single interpolation", async () => {
    process.env.TEST_VAR_1 = "Lamb Bhuna";
    const filePath = "./test-params/interpolation-1.json";
    const absolutePath = resolve(__dirname, filePath);

    await interpolate(filePath);

    const contentsAfter = await readFile(absolutePath, { encoding: "utf8" });
    const jsonAfter = JSON.parse(contentsAfter);

    expect(jsonAfter).toEqual([
      {
        ParameterKey: "TestVar",
        ParameterValue:
          "According to many, the most reliable curry is a Lamb Bhuna!",
      },
    ]);
  });

  it("should interpolate over mutliple entries", async () => {
    process.env.TEST_VAR_2 = "Lamb Bhuna";
    process.env.TEST_VAR_3 = "Chicken Biryani";
    const filePath = "./test-params/interpolation-2.json";
    const absolutePath = resolve(__dirname, filePath);

    await interpolate(filePath);

    const contentsAfter = await readFile(absolutePath, { encoding: "utf8" });
    const jsonAfter = JSON.parse(contentsAfter);

    expect(jsonAfter).toEqual([
      {
        ParameterKey: "TestVar",
        ParameterValue:
          "According to many, the most reliable curry is a Lamb Bhuna!",
      },
      {
        ParameterKey: "TestVar2",
        ParameterValue: "But",
      },
      {
        ParameterKey: "TestVar3",
        ParameterValue: "I'm more partial to a Chicken Biryani",
      },
    ]);
  });

  it("should interpolate multiple times in a single ParameterValue", async () => {
    process.env.TEST_VAR_4 = "Lamb Bhuna";
    process.env.TEST_VAR_5 = "Chicken Biryani";
    process.env.TEST_VAR_6 = "Chicken Tikka Masala";
    const filePath = "./test-params/interpolation-3.json";
    const absolutePath = resolve(__dirname, filePath);

    await interpolate(filePath);

    const contentsAfter = await readFile(absolutePath, { encoding: "utf8" });
    const jsonAfter = JSON.parse(contentsAfter);

    expect(jsonAfter).toEqual([
      {
        ParameterKey: "TestVar",
        ParameterValue:
          "According to many, the most reliable curry is a Lamb Bhuna!",
      },
      {
        ParameterKey: "TestVar2",
        ParameterValue: "But",
      },
      {
        ParameterKey: "TestVar3",
        ParameterValue:
          "I'm more partial to a Chicken Biryani or a Chicken Tikka Masala",
      },
    ]);
  });
});
