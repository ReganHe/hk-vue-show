import type { App } from 'vue';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
  Input,
  Layout,
  Spin,
} from 'ant-design-vue';

import { CaCommonQuery } from '/@/components/CaCommonQuery';
import { CaCommonTable } from '/@/components/CaCommonTable';
import { CaCommonForm } from '/@/components/CaCommonForm';

const compList = [AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app.use(Input).use(Button).use(Layout).use(Spin);

  app.component('CaCommonQuery', CaCommonQuery);
  app.component('CaCommonTable', CaCommonTable);
  app.component('CaCommonForm', CaCommonForm);
}
