import { Configuration, ProvidePlugin } from 'webpack';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

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
