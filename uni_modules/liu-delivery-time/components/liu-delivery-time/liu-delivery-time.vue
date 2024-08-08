<template>
	<view v-if="days && days.length">
		<!-- 弹出层 -->
		<view :class="scrollClass">
			<view class="time-title" :style="{ borderRadius: getRadius }">
				<span @click.stop="close">取消</span>
				{{ title }}
				<text @click.stop="confirm" :style="selectedTimeIndex?'color:#007aff;':''">确定</text>
			</view>
			<view class="time-picker" :style="{ height: height }">
				<scroll-view class="date-scroll" scroll-y>
					<view class="date-item" v-for="(item, index) in days" :key="index">
						<view class="date" :class="{ active: selectedIndex === index }" @click="handleDateClick(index)">
							{{ item.day }}
						</view>
					</view>
				</scroll-view>
				<scroll-view class="time-scroll" scroll-y>
					<view class="time-item" v-for="(time, index) in selectedDay.timeList" :key="index">
						<view class="time" :class="{ active: selectedTimeIndex === index }"
							@click="handleTimeClick(index)">
							{{ time.time }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-show="isShow" class="scroll-mask" @click="isMask ? close() : ''"></view>
	</view>
</template>

<script>
	export default {
		props: {
			//标题
			title: {
				type: String,
				default: '请选择预约时间',
			},
			//盒子高度
			height: {
				type: String,
				default: '500rpx',
			},
			//展示近几日时间
			day: {
				type: Number,
				default: 7
			},
			//是否点击阴影关闭
			isMask: {
				type: Boolean,
				default: true,
			},
			//是否开启动画
			animation: {
				type: Boolean,
				default: true,
			},
			//是否开启安全条
			safeArea: {
				type: Boolean,
				default: true,
			},
			//圆角
			radius: {
				type: String,
				default: '24rpx',
			},
		},
		data() {
			return {
				isShow: false,
				selectedIndex: 0,
				selectedDay: {},
				selectedTimeIndex: 999,
				days: []
			};
		},
		mounted() {
			this.days = this.getFutureDays()
			this.selectedDay = this.days[0]
		},
		computed: {
			scrollClass() {
				const classes = ['scroll-popup'];
				if (this.isShow) classes.push('scroll-open');
				if (this.animation) classes.push('scroll-animation');
				if (this.safeArea) classes.push('scroll-temp');
				return classes;
			},
			getRadius() {
				return `${this.radius} ${this.radius} 0 0`;
			},
		},
		methods: {
			//时间数据构造
			getFutureDays() {
				const days = [];
				for (let i = 0; i < this.day; i++) {
					const date = new Date();
					date.setDate(date.getDate() + i);
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					const timeList = [{
							time: '06:00-08:00',
							start: '06:00',
							end: '08:00'
						}, {
							time: '08:00-10:00',
							start: '08:00',
							end: '10:00'
						},
						{
							time: '10:00-12:00',
							start: '10:00',
							end: '12:00'
						},
						{
							time: '12:00-14:00',
							start: '12:00',
							end: '14:00'
						},
						{
							time: '14:00-16:00',
							start: '14:00',
							end: '16:00'
						},
						{
							time: '16:00-18:00',
							start: '16:00',
							end: '18:00'
						},
						{
							time: '18:00-20:00',
							start: '18:00',
							end: '20:00'
						},
						{
							time: '20:00-22:00',
							start: '20:00',
							end: '22:00'
						}
					];
					days.push({
						day: `${year}-${month}-${day}`,
						timeList: timeList
					});
				}
				return days;
			},
			open() {
				this.isShow = true;
				this.init();
			},
			init() {
				this.selectedIndex = 0;
				this.selectedDay = this.days[0];
				this.selectedTimeIndex = 999;
			},
			close() {
				this.isShow = false;
			},
			handleDateClick(index) {
				this.selectedIndex = index;
				this.selectedDay = this.days[index];
				this.selectedTimeIndex = 999;
			},
			handleTimeClick(index) {
				this.selectedTimeIndex = index;
			},
			confirm() {
				if (this.selectedTimeIndex == 999) {
					uni.showToast({
						title: this.title,
						icon: 'none'
					})
					return
				}
				const time = this.selectedDay.timeList[this.selectedTimeIndex]
				this.close();
				this.$emit('change', {
					day: this.selectedDay.day,
					time: time.time,
					startHour: time.start,
					endHour: time.end,
					value: `${this.selectedDay.day} ${time.time}`,
				});
			}
		},
	};
</script>

<style>
	/deep/ ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}
</style>
<style scoped>
	/* 弹出层默认样式 */
	.scroll-popup {
		width: 100%;
		position: fixed;
		bottom: -100%;
		z-index: 999;
	}

	/* 点击按钮是将盒子 bottom 值归零即可实现弹出效果,
	 同理，如需更改弹出方向只需将bottom改成top、left、right即可
	 (默认样式的方向也需一起更改哦) */
	.scroll-open {
		bottom: 0px !important;
	}

	.scroll-animation {
		transition: all 0.25s linear;
	}

	.scroll-temp {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 遮罩层样式 */
	.scroll-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 998;
	}

	.time-picker {
		display: flex;
		align-items: center;
		color: #666666;
		background-color: #fff;
	}

	.time-title {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		background-color: #ffffff;
		text-align: center;
		position: relative;
		border-bottom: 1rpx solid #f6f6f6;
	}

	.time-title span {
		font-size: 28rpx;
		font-weight: 400;
		position: absolute;
		left: 32rpx;
		top: 0;
		bottom: 0;
		margin: auto 0;
		color: #666666;
	}

	.time-title text {
		font-size: 28rpx;
		font-weight: 400;
		position: absolute;
		right: 32rpx;
		top: 0;
		bottom: 0;
		margin: auto 0;
		color: #666666;
	}

	.date-scroll {
		flex: 1;
		height: 100%;
		border-right: 1rpx solid #f6f6f6;
		box-sizing: border-box;
	}

	.date-item {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f6f6f6;
	}

	.date {
		font-size: 28rpx;
	}

	.date.active {
		font-size: 30rpx;
		font-weight: bold;
		color: #007aff;
	}

	.time-scroll {
		flex: 1;
		height: 100%;
	}

	.time-item {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f6f6f6;
	}

	.time {
		font-size: 28rpx;
	}

	.time.active {
		font-size: 30rpx;
		font-weight: bold;
		color: #007aff;
	}
</style>