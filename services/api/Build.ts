import UnpluginTypia from '@ryoppippi/unplugin-typia/bun';

(async () => {
  await Bun.build({
    target: 'bun',
    entrypoints: ['./src/server.ts'],
    outdir: './dist',
    plugins: [UnpluginTypia(/* options */)],
  });
})();
