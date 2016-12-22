# vue-upload-file

A file upload component for vue. (vue文件上传组件)


## Demo（示例）
[Click me （点我）](http://dai-siki.github.io/vue-upload-file/example/demo.html).


## Brower compatibility（浏览器兼容）
IE10+


## Env（配置环境）
vue@1.0 + webpack + es6


## Install（安装）
#### npm
```shell
$ npm install vue-upload-file
```


## Usage（使用）
#### Props（参数）
| 名称              | 类型               | 默认             | 说明                                         |
| ----------------| ---------------- | ---------------| ------------------------------------------|
| field       | String   | 'upload'     | 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分    |
| key             |             |   0               | 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分    |
| value             | Boolean            |                  | 是否显示控件    |
| url             | String            |  ''                | 上传地址    |
| otherParams             | Object            |  null                | 要附带的其他数据，如 {k:v}    |
| maxSize             | Number            |  2048               | 单文件大小限制（kb）    |
| onlyImg             | Boolean            |  false                | 仅限图片    |
| onlySingle             | Boolean            | false                 | 仅限单文件上传    |
| langConf             | Object            | defaultLang                 | 语言包配置    |

#### Default Lang（默认语言包）
```js
let defaultLang = {
	hint: '点击，或将文件拖动至此处',
	loading: '正在上传……',
	noSupported: '浏览器不支持该功能，请使用IE10以上或其他现代浏览器！',
	success: '上传成功',
	error: {
		onlyImg: '仅限图片格式',
		onlySingle: '仅限单文件上传',
		outOfSize: '单文件大小不能超过 ',
	}
};
```

#### Example(使用示例)
```html
<style media="screen">
	#app {
		position: relative; /*控件上级容器必须是相对定位或绝对定位*/
	}
</style>

<div id="app">
	<a class="btn" @click="toggleShow">上传图片</a>
	<my-upload url="/upload" field="img" key="1" max-size="500"
		:only-single="true"
		:value="true"
		:only-img="true"
		:other-params="otherParams"></my-upload>
</div>

<script>
	import 'babel-polyfill'; //因为使用了es6的一些方法，需要babel垫片，如果你项目中已有相关兼容性方案，可忽略
	import Vue from 'vue';
	import mySwitch from 'vue-upload-file';

	new Vue({
		el: '#app',
		data: {
			show: true,
			otherParams: {
				token: '123456798',
				name: 'img'
			}
		},
		components: {
			'my-upload': myUpload
		},
		methods: {
			toggleShow() {
				this.show = !this.show;
			}
		},
		events: {
			/**
			 * 上传成功
			 *
			 * [param] jsonData 返回的数据（-----注意：已进行json转码-----）
			 * [param] field 你设置的域
			 * [param] key 你设置的键
			 */
			uploadSuccess(jsonData, field, key){
				console.log('-------- 上传成功 --------');
				console.log(jsonData);
				console.log('field: ' + field);
				console.log('key: ' + key);
			},
			/**
			 * 上传失败
			 *
			 * [param] status 返回的状态值
			 * [param] field 你设置的域
			 * [param] key 你设置的键
			 */
			uploadFail(status, field, key){
				console.log('-------- 上传失败 --------');
				console.log(status);
				console.log('field: ' + field);
				console.log('key: ' + key);
			}
		}
	});

</script>
```
