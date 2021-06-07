import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { Configuration, ProvidePlugin } from 'webpack';

export default {
  plugins: [
    new NodePolyfillPlugin({}),
    new ProvidePlugin({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Buffer: ['buffer', 'Buffer'],
      global: ['global'],
      process: 'process/browser',
    }),
  ],
} as Configuration;
