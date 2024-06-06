import { build } from "esbuild";

const transpile = async (): Promise<void> => {
  if (process.argv.length !== 4)
    throw new Error(
      "Usage: npm run transpile <path/to/source> <path/to/destination>",
    );

  const entryPoint = process.argv[2];
  const outFile = process.argv[3];

  await build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: outFile,
    platform: "node",
    sourcemap: true,
  });
};

export default transpile;
