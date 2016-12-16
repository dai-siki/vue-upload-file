import 'babel-polyfill';
import Vue from 'vue';
import myUpload from '../upload.vue';


new Vue({
	el: '#app',
	data: {
		otherParams: {
			token: '123456798',
			name: 'img'
		}
	},
	components: {
		'my-upload': myUpload
	}
});
