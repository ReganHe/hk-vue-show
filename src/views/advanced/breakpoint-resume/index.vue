<template>
  <div id="app">
    <div>
      <input type="file" :disabled="status !== Status.wait" @change="handleFileChange" />
      <el-button @click="handleUpload" :disabled="uploadDisabled">upload</el-button>
      <el-button @click="handleResume" v-if="status === Status.pause">resume</el-button>
      <el-button
        v-else
        :disabled="status !== Status.uploading || !container.hash"
        @click="handlePause"
        >pause</el-button
      >
      <el-button @click="handleDelete">delete</el-button>
    </div>
    <div>
      <div>
        <div>calculate chunk hash</div>
        <el-progress :percentage="hashPercentage" />
      </div>
      <div>
        <div>percentage</div>
        <el-progress :percentage="fakeUploadPercentage" />
      </div>
    </div>
    <el-table :data="model.dataList">
      <el-table-column prop="hash" label="chunk hash" align="center" />
      <el-table-column label="size(KB)" align="center" width="120">
        <!-- <template #default="{ row }"> -->
        <!-- {{ row.size | transformByte }} -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="percentage" align="center">
        <template #default="{ row }">
          <el-progress :percentage="row.percentage" color="#909399" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  import { reactive, computed, watch } from 'vue';
  // 切片大小
  // chunk size
  const SIZE = 10 * 1024 * 1024;

  const Status = {
    wait: 'wait',
    pause: 'pause',
    uploading: 'uploading',
  };
  // filters: {
  //   transformByte(val) {
  //     return Number((val / 1024).toFixed(0));
  //   },
  // },

  const model = reactive({
    container: {
      file: null,
      hash: '',
      worker: null,
    },
    hashPercentage: 0,
    dataList: [],
    requestList: [],
    status: Status.wait,
    // 当暂停时会取消 xhr 导致进度条后退
    // 为了避免这种情况，需要定义一个假的进度条
    // use fake progress to avoid progress backwards when upload is paused
    fakeUploadPercentage: 0,
  });
  const uploadDisabled = computed(() => {
    return !model.container.file || [Status.pause, Status.uploading].includes(model.status);
  });
  const uploadPercentage = computed(() => {
    if (!model.container.file || !model.dataList.length) return 0;
    const loaded = model.dataList
      .map((item) => item.size * item.percentage)
      .reduce((acc, cur) => acc + cur);
    return parseInt((loaded / model.container.file.size).toFixed(2));
  });
  watch(uploadPercentage, (now) => {
    if (now > model.fakeUploadPercentage) {
      model.fakeUploadPercentage = now;
    }
  });

  const handleDelete = async () => {
    const { data } = await request({
      url: 'http://localhost:3000/delete',
    });
    if (JSON.parse(data).code === 0) {
      // this.$message.success('delete success');
    }
  };
  const handlePause = () => {
    model.status = Status.pause;
    resetData();
  };
  const resetData = () => {
    model.requestList.forEach((xhr) => xhr?.abort());
    model.requestList = [];
    if (model.container.worker) {
      model.container.worker.onmessage = null;
    }
  };
  const handleResume = async () => {
    model.status = Status.uploading;
    const { uploadedList } = await verifyUpload(model.container.file.name, model.container.hash);
    await uploadChunks(uploadedList);
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
  // 生成文件切片
  // create file chunk
  const createFileChunk = (file, size = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  };
  // 生成文件 hash（web-worker）
  // use web-worker to calculate hash
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
  const handleFileChange = (e) => {
    console.log('handleFileChange', e);
    const [file] = e.target.files;
    if (!file) return;
    resetData();
    // console.log('this.$data', this.$data);
    // console.log('this.$options.data()', this.$options.data());
    // 重置状态-使用默认状态覆盖现有状态
    // Object.assign(this.$data, this.$options.data());
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
      // this.$message.success('skip upload：file upload success, check /target directory');
      model.status = Status.wait;
      return;
    }

    model.dataList = fileChunkList.map(({ file }, index) => ({
      fileHash: model.container.hash,
      index,
      hash: model.container.hash + '-' + index,
      chunk: file,
      size: file.size,
      percentage: uploadedList.includes(index) ? 100 : 0,
    }));

    await uploadChunks(uploadedList);
  };
  // 上传切片，同时过滤已上传的切片
  // upload chunks and filter uploaded chunks
  const uploadChunks = async (uploadedList = []) => {
    const requestList = model.dataList
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
          onProgress: createProgressHandler(model.dataList[index]),
          requestList: model.requestList,
        })
      );
    await Promise.all(requestList);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时合并切片
    // merge chunks when the number of chunks uploaded before and
    // the number of chunks uploaded this time
    // are equal to the number of all chunks
    if (uploadedList.length + requestList.length === model.dataList.length) {
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
    // this.$message.success('upload success, check /target directory');
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