<template>
<div class="vue-upload" v-show="value">
	<div class="drop-area"
		@click="handleClick"
		@dragleave="handleDragleave"
		@dragover="handleDragover"
		@dragenter="handleDragenter"
		@click="handleClick"
		@drop="handleDrop">
		<i class="icon" v-show="!loading">
			<i class="icon-arrow"></i>
			<i class="icon-body"></i>
			<i class="icon-bottom"></i>
		</i>
		<span class="hint" v-show="!loading">点击选择，或将图片拖动至此处</span>
		<span class="loading" v-show="loading">正在上传……</span>
		<span class="no-supported-hint" v-show="!isSupported">浏览器不支持该功能，请使用IE10以上或其他现在浏览器！</span>
		<input type="file" v-show="false" @change="handleChange" v-el:fileinput>
	</div>
	<div class="error" v-show="hasError">
		错误：{{ errorMsg }}
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
		}
	},
	data() {
		let isSupported = true;
		if(typeof FormData != 'function'){
			isSupported = false;
		}
		return {
			loading: false,
			isSupported,
			hasError: false,
			files: '',
			errorMsg: ''
		}
	},
	computed: {
		className() {

		}
	},
	methods: {
		handleDragleave(e){
			e.preventDefault();
		},
		handleDrop(e){
			e.preventDefault();
			let that = this,
				files = e.dataTransfer.files;
			that.reset();
			if(that.checkFiles(files)){
				that.files = files;
				that.upload();
			}
		},
		handleDragenter(e){
			e.preventDefault();

		},
		handleDragover(e){
			e.preventDefault();

		},
		handleClick(e){
			if(e.target !== this.$els.fileinput){
				e.preventDefault();
				this.$els.fileinput.click();
			}
		},
		handleChange(e){
			let that = this,
				files = e.target.files;
			that.reset();
			if(that.checkFiles(files)){
				that.files = files;
				that.upload();
			}
		},
		checkFiles(files){
			let that = this,
				{maxSize, onlyImg} = that,
				fileNum = files.length;
			if(fileNum == 0){
				return false;
			}
			for (let i = 0; i < fileNum; i++) {
				if(onlyImg && files[i].type.indexOf('image') === -1){
					that.hasError = true;
					that.errorMsg = '仅限图片上传';
					return false;
				}
				if(files[i].size/1024 > maxSize){
					that.hasError = true;
					that.errorMsg = '单文件大小不能超过' + maxSize + 'kb';
					return false;
				}
			}
			return true;
		},
		reset(){
			let that = this;
			that.hasError = false;
			that.errorMsg = '';
			that.file = '';
		},
		upload(){
			let that = this,
				{url, files, otherParams, onlySingle, field, key} = this,
				fmData = new FormData();
			if(onlySingle){
				fmData.append(field, files[0]);
			}else{
				fmData.append(field, files);
			}
			if(typeof otherParams == 'object' && otherParams){
				Object.keys(otherParams).forEach((k)=>{
					fmData.append(k, otherParams[k]);
				})
			}
			that.loading = true;
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
				client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
				client.send(fmData);
			}).then(function (resData) {
				that.loading = false;
				that.$dispatch('uploadEnd', resData, this.field, this.key);
			}, function (sts) {
				that.loading = false;
				that.hasError = true;
				that.errorMsg = '上传图片失败';
				that.$dispatch('uploadFail', sts, this.field, this.key);
			});
		}
	}
}

</script>

<style lang="sass" scoped>@import "./scss/upload.scss"</style>
