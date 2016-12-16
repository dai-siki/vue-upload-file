# vue-upload-file

a file upload component for vue. (vue文件上传组件)

## 正在完善，可以参考，不推荐使用

## demo

[click me](http://dai-siki.github.io/vue-upload-file/example/demo.html).


## Env

vue.js@1.0 + webpack + es6 + scss


## install

#### npm （还未上传

```shell
$ npm install vue-upload-file
```

## Usage

#### 相关参数

| 名称              | 类型               | 默认             | 说明                                         |
| ----------------- | ----------------- | ---------------- | --------------------------------------------- |
| field             | String            | 'upload'                 | 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分    |
| url             | String            |  ''                | 上传地址    |
| otherParams             | Object            |  null                | 要附带的其他数据，如 {k:v}    |
| value             | Boolean            |                  | 是否显示控件    |
| key             |             |   0               | 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分    |
| maxSize             | Number            |  2048                | 单文件大小限制    |
| onlyImg             | Boolean            |  false                | 仅限图片    |
| onlySingle             | Boolean            | false                 | 仅限单文件上传    |



#### 示例(vue@1.0+)

```html
<style media="screen">
	#app {
		position: relative; /*控件上级容器必须是相对定位或绝对定位*/
	}
</style>

<div id="app">
	<a class="btn">上传图片</a>
	<my-upload url="/temp" :only-single="true"
		:value="true" field="img" key="0" max-size="500" :only-img="true" :other-params="otherParams"></my-upload>
</div>

<script>
	import 'babel-polyfill'; //因为使用了es6的一些方法，需要babel垫片，如果你项目中已有相关兼容性方案，可忽略
	import Vue from 'vue';
	import mySwitch from 'vue-upload-file';

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

</script>


```
