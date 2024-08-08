<template>
	<view class="body">
		<view class="banner">
			<swiper class="swiper" circular indicator-dots autoplay :interval="2000">
				<view class="swiper-item" v-for="(item,index) in bannerurlList" :key="index">
					<swiper-item @click="openPoster(item.id)">
						<image :src="item.src"></image>
					</swiper-item>
				</view>
			</swiper>
		</view>
		<view class="announce">
			<uni-notice-bar show-icon scrollable color="#1296db" background-color="#8bdbff"
				text="如有问题或需要反馈,请与平台客服联系,客服将会及时为您解决." />
		</view>
		<view class="content">
			<view class="content-item" @click="openPage('0')">
				<image src="../../static/content/kuaidi.png" mode=""></image>
				<text>快递代拿</text>
			</view>
			<view class="content-item" @click="openPage('1')">
				<image src="../../static/content/waimai.png" mode=""></image>
				<text>外卖代拿</text>
			</view>
			<view class="content-item" @click="openPage('2')">
				<image src="../../static/content/qishou.png" mode=""></image>
				<text>骑手中心</text>
			</view>
			<view class="content-item" @click="openPage('3')">
				<image src="../../static/content/dingdan.png" mode=""></image>
				<text>我的订单</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		data() {
			return {
				isLogin: false,
				userId: null,
				bannerurlList: [{
					id: '1',
					src: '../../static/banner/banner.png'
				}, {
					id: '2',
					src: '../../static/banner/banner_apply.png'
				}],

			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync('isLogin')
			this.userId = uni.getStorageSync('userId')

		},
		methods: {
			//功能跳转
			openPage(nub) {
				if (this.isLogin !== true) {
					uni.showToast({
						title: '请先登录',
						duration: 1000,
						icon: 'error',
					});
					return
				}
				if (nub === '0' || nub === '1') {
					//清除存储的地址 订单信息
					uni.removeStorageSync('receiver')
					uni.removeStorageSync('order')

					// 订单类型
					uni.setStorageSync('orderType', nub)
					// 默认地址
					uni.setStorageSync('isdefault', true)
					uni.navigateTo({
						url: '/pages/add_order/add_order'
					})
				} else if (nub === '2') {
					// 骑手
					this.getRiderData()

				} else if (nub === '3') {
					//订单
					uni.navigateTo({
						url: '/pages/order_list/order_list'
					})
				}
			},
			//轮播图跳转
			openPoster(id) {
				if (id === '1') {
					//介绍图
					uni.setStorageSync('posterId', id)
					uni.navigateTo({
						url: '/pages/poster/poster'
					})
				} else if (id === '2') {
					if (this.isLogin !== true) {
						uni.showToast({
							title: '请先登录',
							duration: 1000,
							icon: 'error',
						});
					} else {
						//骑手
						this.getRiderData()
					}

				}

			},
			// 获取骑手信息
			async getRiderData() {
				const res = await api.getRiderData(this.userId)
				if (res[1].data.data) {
					console.log('有申请');
					let rider = res[1].data.data
					uni.setStorageSync('rider', rider)
					if (rider.riderStatus === '0') {
						console.log('未审核');
						uni.navigateTo({
							url: '/pages/apply_rider/apply_rider'
						})
					} else if (rider.riderStatus === '1') {
						console.log('通过');
						uni.navigateTo({
							url: '/pages/rider/rider'
						})

					} else if (rider.riderStatus === '3') {
						console.log('停用');
						uni.navigateTo({
							url: '/pages/rider/rider'
						})

					} else {
						console.log('未通过');
						uni.navigateTo({
							url: '/pages/apply_rider/apply_rider'
						})
					}
				} else {
					uni.removeStorageSync('rider')
					console.log('无申请');
					uni.navigateTo({
						url: '/pages/apply_rider/apply_rider'
					})
				}
			}
		}
	}
</script>

<style>
	.body {
		padding: 20rpx 0;
		width: 100%;
		height: 100%;
	}

	.swiper {
		padding: 0 20rpx;
		height: 400rpx;
	}

	.swiper-item {
		width: 100%;
	}

	.swiper-item image {
		width: 710rpx;
		height: 400rpx;
		border-radius: 12rpx;
	}

	.announce {
		margin-top: 30rpx;
		padding: 0 20rpx;
		border-radius: 12rpx;
	}

	.uni-noticebar {
		border-radius: 12rpx;
	}

	.content {
		display: flex;
		padding: 0 30rpx;
		margin: 20rpx;
		background-color: #fff;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-around;
		align-content: space-around;
		border-radius: 12rpx;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
	}

	.content-item {
		padding-top: 35rpx;
		text-align: center;
		width: 220rpx;
		height: 220rpx;
		margin-bottom: 30rpx;
	}

	.content-item image {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 16rpx;
	}

	.content-item text {
		display: block;
	}
</style>