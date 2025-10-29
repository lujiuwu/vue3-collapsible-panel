import type { App } from 'vue';
import { Demo } from './components/demo';

export { Demo };

export default {
  install(app: App) {
    app.component('Demo', Demo);
  }
};


