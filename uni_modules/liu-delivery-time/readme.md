# liu-delivery-time适用于uni-app项目的时间区间选择组件，用于预约场景
### 本组件目前兼容微信小程序、H5
### 本组件支持自定义，源码简单易修改
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式
``` html
<liu-delivery-time @change="changeTime" ref="chooseTime" title="请选择预约时间"></liu-delivery-time>
<button @click="open">打开时间选择{{ dayTime }}</button>
```
``` javascript
	export default {
		data() {
			return {
				dayTime: '',
			};
		},
		methods: {
			open() {
				this.$refs.chooseTime.open()
			},
			//选择的时间
			changeTime(e) {
				this.dayTime = e.value
			},
		},
	}
```

### 属性说明
| 名称      | 类型    | 默认值           | 描述           |
| --------- | ------- | -------------- | --------------|
| title     | String  | 请选择预约时间   | 标题           |
| height    | String  | 500rpx         | 盒子高度       |
| day       | Number  | 7              | 展示近几日时间  |
| isMask    | Boolean | true           | 是否点击阴影关闭 |
| animation | Boolean | true           | 是否开启动画    |
| safeArea  | Boolean | true           | 是否开启安全条  |
| radius    | String  | 24rpx          | 圆角           |
