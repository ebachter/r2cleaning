import UnpluginTypia from '@ryoppippi/unplugin-typia/bun';

(async () => {
  const result = await Bun.build({
    target: 'node',
    entrypoints: ['./src/server.ts'],
    outdir: './dist',
    plugins: [UnpluginTypia(/* options */)],
  });

  if (!result.success) {
    console.error('Build failed');
    for (const message of result.logs) {
      // Bun will pretty print the message object
      console.error(message);
    }
  }
})();
