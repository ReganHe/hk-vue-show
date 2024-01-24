import { defineStore } from 'pinia';
import { store } from '/@/store';

interface ValidatorsState {
  validators: Object;
}
export const useValidatorsStore = defineStore({
  id: 'custom-validator',
  state: (): ValidatorsState => ({
    validators: {},
  }),
  getters: {
    getValidators(): Object {
      return this.validators;
    },
  },
  actions: {
    setValidators(val: String, fun: Function) {
      this.validators[val as any] = fun;
    },
    clear() {
      this.validators = {};
    },
  },
});

// Need to be used outside the setup
export function useValidatorsStoreWithOut() {
  return useValidatorsStore(store);
}
