<template>
<div class="vue-upload-file" v-show="value">
	<div class="vuf-drop-area"
		@click="handleClick"
		@dragleave="handleDragleave"
		@dragover="handleDragover"
		@dragenter="handleDragenter"
		@drop="handleDrop">
		<i class="vuf-icon1" v-show="loading != 1">
			<i class="vuf-icon1-arrow"></i>
			<i class="vuf-icon1-body"></i>
			<i class="vuf-icon1-bottom"></i>
		</i>
		<span class="vuf-hint" v-show="loading !== 1">{{ lang.hint }}</span>
		<span class="vuf-loading" v-show="loading === 1">{{ lang.loading }}</span>
		<div class="vuf-progress-wrap" v-show="loading === 1">
			<span class="vuf-progress" :style="progressStyle"></span>
		</div>
		<span class="vuf-no-supported-hint" v-show="!isSupported">{{ lang.noSupported }}</span>
		<input type="file" v-show="false" @change="handleChange" v-el:fileinput>
	</div>
	<div class="vuf-error" v-show="hasError">
		<i class="vuf-icon2"></i>
		{{ errorMsg }}
	</div>
	<div class="vuf-success" v-show="loading === 2">
		<i class="vuf-icon3"></i>
		{{ lang.success }}
	</div>
</div>
</template>

<script>
'use strict';

export default {
	props: {
		// 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
		field: {
			type: String,
			'default': 'upload'
		},
		// 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
		key: {
			'default': 0
		},
		// 显示该控件与否
		value: {
			'default': true
		},
		// 单文件大小限制
		maxSize: {
			'default': 2048
		},
		// 仅限图片
		onlyImg: {
			'default': false
		},
		// 仅限单文件上传
		onlySingle: {
			'default': false
		},
		url: {
			type: String,
			'default': ''
		},
		// 其他要上传文件附带的数据，对象格式
		otherParams: {
			'default': null
		},
		langConf: {
			type: Object,
			'default': null
		}
	},
	data() {
		let that = this,
			{langConf} = that,
			isSupported = true,
			lang = {
				hint: '点击，或将文件拖动至此处',
				loading: '正在上传……',
				noSupported: '浏览器不支持该功能，请使用IE10以上或其他现代浏览器！',
				success: '上传成功',
				fail: '上传失败',
				error: {
					onlyImg: '仅限图片格式',
					onlySingle: '仅限单文件上传',
					outOfSize: '单文件大小不能超过 ',
				}
			};
		if(langConf){
			Object.assign(lang, langConf);
		}
		if(typeof FormData != 'function'){
			isSupported = false;
		}
		return {
			loading: 0, //0未开始 1正在 2成功 3错误
			lang,
			isSupported,
			hasError: false,
			files: '',
			progress: 0,
			errorMsg: ''
		}
	},
	computed: {
		progressStyle() {
			let {progress} = this;
			return {
				width: progress + '%'
			}
		}
	},
	watch: {
		'value': function(newValue){
			if(newValue){
				this.reset();
			}
		}
	},
	methods: {
		handleDragleave(e){
			e.preventDefault();
		},
		handleDrop(e){
			e.preventDefault();
			if(this.loading !== 1){
				let files = e.dataTransfer.files;
				this.reset();
				if(this.checkFiles(files)){
					this.upload(files);
				}
			}
		},
		handleDragenter(e){
			e.preventDefault();

		},
		handleDragover(e){
			e.preventDefault();

		},
		handleClick(e){
			if(this.loading !== 1){
				if(e.target !== this.$els.fileinput){
					e.preventDefault();
					this.$els.fileinput.click();
				}
			}
		},
		handleChange(e){
			if(this.loading !== 1){
				let files = e.target.files;
				this.reset();
				if(this.checkFiles(files)){
					this.upload(files);
				}
			}
		},
		checkFiles(files){
			let that = this,
				{lang, maxSize, onlyImg, onlySingle} = that,
				fileNum = files.length;
			// 是否文件为空
			if(fileNum == 0){
				return false;
			}

			// 仅限单文件？
			if(onlySingle && fileNum > 1){
				that.hasError = true;
				that.errorMsg = lang.error.onlySingle;
				return false;
			}

			for (let i = 0; i < fileNum; i++) {
				// 仅限图片
				if(onlyImg && files[i].type.indexOf('image') === -1){
					that.hasError = true;
					that.errorMsg = lang.error.onlyImg;
					return false;
				}

				// 超出大小
				if(files[i].size/1024 > maxSize){
					that.hasError = true;
					that.errorMsg = lang.error.outOfSize + maxSize + 'kb';
					return false;
				}
			}
			return true;
		},
		reset(){
			let that = this;
			that.loading = 0;
			that.hasError = false;
			that.errorMsg = '';
			that.progress = 0;
		},
		upload(files){
			let that = this,
				{url, otherParams, onlySingle, field, key, lang} = this,
				fmData = new FormData();

			// 判断是否单文件
			if(onlySingle){
				fmData.append(field, files[0]);
			}else{
				fmData.append(field, files);
			}

			// 添加其他参数
			if(typeof otherParams == 'object' && otherParams){
				Object.keys(otherParams).forEach((k)=>{
					fmData.append(k, otherParams[k]);
				})
			}

			// 监听进度回调
			const uploadProgress = function(event){
				if(event.lengthComputable) {
					that.progress = 100 * Math.round(event.loaded) / event.total;
				}
			};

			// 上传文件
			that.loading = 1;
			new Promise(function (resolve, reject) {
				let client = new XMLHttpRequest();
				client.open('POST', url, true);
				client.onreadystatechange = function () {
					if (this.readyState !== 4) {
						return;
					}
					if (this.status === 200) {
						resolve(JSON.parse(this.responseText));
					} else {
						reject(this.status);
					}
				};
		        client.upload.addEventListener("progress", uploadProgress, false); //监听进度
				client.send(fmData);
			}).then(
				// 上传成功
				function (resData) {
					that.loading = 2;
					that.$dispatch('uploadSuccess', resData, field, key);
				},
				// 上传失败
				function (sts) {
					that.loading = 3;
					that.hasError = true;
					that.errorMsg = lang.fail;
					that.$dispatch('uploadFail', sts, field, key);
				}
			);
		}
	}
}

</script>

<style lang="sass" scoped>@import "./scss/upload.scss"</style>
