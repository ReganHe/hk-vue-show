import { getStorageShortName } from '/@/utils/env';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  };
};

export const WebStorage = create(createOptions(localStorage));

export const createStorage = (storage: Storage = localStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
