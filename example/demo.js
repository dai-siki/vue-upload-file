import 'babel-polyfill';
import Vue from 'vue';
import myUpload from '../upload.vue';


new Vue({
	el: '#app',
	data: {
		show1: false,
		show2: false,
		otherParams: {
			token: '123456798',
			name: 'img'
		}
	},
	components: {
		'my-upload': myUpload
	},
	methods: {
		toggleShow1() {
			this.show1 = !this.show1;
		},
		toggleShow2() {
			this.show2 = !this.show2;
		}
	},
	events: {
		uploadSuccess(data, field, key){
			console.log('-------- 上传成功 --------');
			console.log(data);
			console.log('field: ' + field);
			console.log('key: ' + key);
		},
		uploadFail(status, field, key){
			console.log('-------- 上传失败 --------');
			console.log(status);
			console.log('field: ' + field);
			console.log('key: ' + key);
		}
	}
});
