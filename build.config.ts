import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    /* eslint-disable @typescript-eslint/naming-convention */
    emitCJS: true,
    /* eslint-enable @typescript-eslint/naming-convention */
  },
});
