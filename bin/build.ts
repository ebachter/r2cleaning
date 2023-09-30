import {build} from 'esbuild';
import * as path from 'node:path';
import {copy} from 'esbuild-plugin-copy';

const absWorkingDir = path.join(__dirname, '..');

const jsServiceBanner = `
  const [require, __filename, __dirname] = await Promise.all([
    import('node:url'),
    import('node:path'),
    import('node:module'),
  ]).then(([url, path, module]) => {
    const require = module.createRequire(import.meta.url);
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return [require, __filename, __dirname];
  });
`.trim();

(async () => {
  build({
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outExtension: {'.js': '.mjs'},
    absWorkingDir,
    bundle: true,
    treeShaking: true,
    entryPoints: [
      'services/jobs/src/lambda_inactive_user.ts',
      'services/jobs/src/lambda_payments.ts',
      'services/jobs/src/lambda_services.ts',
      'services/jobs/src/lambda_terminations.ts',
      'services/jobs/src/lambda_timers.ts',
    ],
    outdir: `dist/lambda-functions`,
    banner: {
      js: jsServiceBanner,
    },
    plugins: [
      './libraries/mysql/prisma/schema.prisma',
      './libraries/mysql/prisma/pclient/libquery_engine-rhel-openssl-1.0.x.so.node',
      'node_modules/vm2/lib/bridge.js',
      'node_modules/vm2/lib/setup-sandbox.js',
    ].map((fileloc) =>
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: [fileloc],
          to: [`dist/lambda-functions`],
        },
        watch: true,
      }),
    ),
  });
})();
