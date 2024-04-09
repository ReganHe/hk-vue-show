<template>
  <div class="breakpoint-resume">
    <div class="header-commands">
      <Input
        class="file-select"
        type="file"
        :disabled="model.status !== Status.wait"
        @change="handleFileChange"
      />
      <div class="commands">
        <Button
          @click="handleUpload"
          :disabled="!model.container.file || [Status.uploading].includes(model.status)"
          >upload</Button
        >
        <Button
          :disabled="!model.container.file || [Status.uploading].includes(model.status)"
          @click="handleDelete"
          >delete</Button
        >
      </div>
    </div>
    <div class="total-chunk">
      <div> 文件大小 {{ totalFileSizeRef }} MB，上传进度： </div>
      <Progress :percent="model.hashPercentage" />
    </div>
    <div class="common-table-container">
      <ca-common-table v-bind="table" />
    </div>
  </div>
</template>

<script setup>
  import { reactive, computed } from 'vue';
  import { Input, Button, Progress, message } from 'ant-design-vue';

  /** 切片大小 (chunk size) */
  const SIZE = 10 * 1024 * 1024;
  const Status = {
    wait: 'wait',
    uploading: 'uploading',
  };
  const columnsRef = computed(() => {
    return [
      {
        type: 'index',
        label: '序号',
        elementProps: {
          width: '40px',
        },
      },
      {
        type: 'default',
        label: 'ChunkHash',
        dataField: 'hash',
        elementProps: {
          width: '100px',
        },
      },
      {
        type: 'default',
        label: 'Size(MB)',
        dataField: 'size',
        elementProps: {
          width: '100px',
        },
      },
      {
        type: 'progess',
        label: '上传百分比',
        dataField: 'percentage',
        elementProps: {
          width: '120px',
        },
      },
    ];
  });

  const table = reactive({
    loading: false,
    dataSource: [],
    columns: columnsRef.value,
    pagination: false,
  });

  const model = reactive({
    container: {
      file: null,
      hash: '',
      worker: null,
    },
    hashPercentage: 0,
    requestList: [],
    status: Status.wait,
  });

  const totalFileSizeRef = computed(() => {
    const totalSizeBit = model.container?.file?.size || 0;
    return totalSizeBit === 0 ? 0 : (totalSizeBit / 1024 / 1024).toFixed(2);
  });

  const handleFileChange = (e) => {
    console.log('handleFileChange', e);
    const [file] = e.target?.files;
    if (!file) return;
    resetData();
    model.container.file = file;
  };

  const handleUpload = async () => {
    if (!model.container.file) return;
    model.status = Status.uploading;
    const fileChunkList = createFileChunk(model.container.file);
    console.log('handleUpload fileChunkList', fileChunkList);
    model.container.hash = await calculateHash(fileChunkList);
    const { shouldUpload, uploadedList } = await verifyUpload(
      model.container.file.name,
      model.container.hash
    );
    console.log('handleUpload uploadedList', uploadedList);
    if (!shouldUpload) {
      message.success('skip upload：file upload success, check /target directory');
      model.status = Status.wait;
      return;
    }

    table.dataSource = fileChunkList.map(({ file }, index) => ({
      fileHash: model.container.hash,
      index,
      hash: model.container.hash + '-' + index,
      chunk: file,
      size: (file.size / 1024 / 1024).toFixed(2),
      percentage: uploadedList.includes(index) ? 100 : 0,
    }));

    await uploadChunks(uploadedList);
  };

  const handleDelete = async () => {
    const { data } = await request({
      url: 'http://localhost:3000/delete',
    });
    if (JSON.parse(data).code === 0) {
      resetData();
      message.success('delete success');
    }
  };

  const resetData = () => {
    model.requestList.forEach((xhr) => xhr?.abort());
    model.requestList = [];
    if (model.container.worker) {
      model.container.worker.onmessage = null;
    }
    model.hashPercentage = 0;
    table.dataSource = [];
  };

  // xhr
  const request = ({
    url,
    method = 'post',
    data,
    headers = {},
    onProgress = (e) => e,
    requestList,
  }) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = onProgress;
      xhr.open(method, url);
      Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
      xhr.send(data);
      xhr.onload = (e) => {
        // 将请求成功的 xhr 从列表中删除
        // remove xhr which status is success
        if (requestList) {
          const xhrIndex = requestList.findIndex((item) => item === xhr);
          requestList.splice(xhrIndex, 1);
        }
        resolve({
          data: e.target.response,
        });
      };
      // 暴露当前 xhr 给外部
      // export xhr
      requestList?.push(xhr);
    });
  };

  /** 生成文件切片(create file chunk) */
  const createFileChunk = (file, size = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  };

  /**
   * 生成文件 hash（web-worker）
   * use web-worker to calculate hash
   * @param {*} fileChunkList 文件切片集合
   */
  const calculateHash = (fileChunkList) => {
    return new Promise((resolve) => {
      model.container.worker = new Worker('/hash.js');
      model.container.worker.postMessage({ fileChunkList });
      model.container.worker.onmessage = (e) => {
        const { percentage, hash } = e.data;
        model.hashPercentage = percentage;
        if (hash) {
          resolve(hash);
        }
      };
    });
  };

  // 上传切片，同时过滤已上传的切片
  // upload chunks and filter uploaded chunks
  const uploadChunks = async (uploadedList = []) => {
    const requestList = table.dataSource
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ chunk, hash, index }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', model.container.file.name);
        formData.append('fileHash', model.container.hash);
        return { formData, index };
      })
      .map(({ formData, index }) =>
        request({
          url: 'http://localhost:3000',
          data: formData,
          onProgress: createProgressHandler(table.dataSource[index]),
          requestList: model.requestList,
        })
      );
    await Promise.all(requestList);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时合并切片
    // merge chunks when the number of chunks uploaded before and
    // the number of chunks uploaded this time
    // are equal to the number of all chunks
    if (uploadedList.length + requestList.length === table.dataSource.length) {
      await mergeRequest();
    }
  };

  // 通知服务端合并切片
  // notify server to merge chunks
  const mergeRequest = async () => {
    await request({
      url: 'http://localhost:3000/merge',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        size: SIZE,
        fileHash: model.container.hash,
        filename: model.container.file.name,
      }),
    });
    message.success('upload success, check /target directory');
    model.status = Status.wait;
  };

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  // verify that the file has been uploaded based on the hash
  // skip if uploaded
  const verifyUpload = async (filename, fileHash) => {
    const { data } = await request({
      url: 'http://localhost:3000/verify',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        filename,
        fileHash,
      }),
    });
    return JSON.parse(data);
  };

  // 用闭包保存每个 chunk 的进度数据
  // use closures to save progress data for each chunk
  const createProgressHandler = (item) => {
    return (e) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100));
    };
  };
</script>

<style lang="scss">
  .breakpoint-resume {
    .header-commands {
      background: #ffffff;
      padding: 8px 16px 8px 0;
      display: flex;
      align-items: center;

      .file-select {
        border: none;
        flex: 1;
      }
    }
    .total-chunk {
      padding: 16px;
    }
  }
</style>
