<template>
	<view class="body">
		<view class="top">

		</view>
		<view class="content">
			<view class="item" v-for="(item,index) in orderList" :key="index">
				<view class="item-top">
					<view class="item-type-1" v-if="item.lwOrder.orderType === '0'">
						快递代拿
					</view>
					<view class="item-type-2" v-else>
						外卖代拿
					</view>
					<view class="item-status">
						待接单
					</view>
				</view>
				<view class="item-center">
					<view class="item-img" v-if="item.lwOrder.orderType === '0'">
						<image src="../../static/content/kuaidi.png" mode=""></image>
					</view>
					<view class="item-img" v-else>
						<image src="../../static/content/waimai.png" mode=""></image>
					</view>
					<view class="item-content">
						<view class="item-text">
							<view class="qu">取</view>
							<view class="item-address">{{item.lwOrder.orderPickupAddress}}</view>
						</view>
						<view class="item-text">
							<view class="song">送</view>
							<view class="item-address">{{item.lwReceiver.receiverAddress}}</view>
						</view>
					</view>
				</view>
				<view class="item-buttom">
					<view class="item-time">
						<view class="">
							期望送达时间：
						</view>
						<view class="">
							{{item.lwOrder.orderExpectedTime}}
						</view>
					</view>
					<view class="item-time">
						<view class="">
							下单时间：
						</view>
						<view class="">
							{{item.lwOrder.orderTime}}
						</view>
					</view>
					<view class="item-amount">
						<view class="amount-img">
							<view class="img">
								<image src="../../static/order/xuanshang.png" style="width: 80rpx;height: 70rpx;">
								</image>
							</view>
							<view class="amount">
								{{item.lwOrder.orderAmount}}元
							</view>
						</view>
						<view class="help-button" @click="takOrder(item.lwOrder)">
							帮助TA
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-img" v-if="orderList.length === 0">
			<image src="../../static/bigImg/zanwudingdan.png" mode=""></image>
			<view>
				暂无相关订单
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
				canTask: false,
				userId: null,
				orderList: [
					/* 	{
							lwCharges: {
								chargesAmount: 10,
								chargesCreateTime: "2024-03-20",
								chargesId: 2,
								chargesIntroduce: "小件",
								chargesSize: "小",
								chargesStatus: "0",
							},
							lwOrder: {
								chargesId: 2,
								orderAmount: 10,
								orderContent: null,
								orderEvaluate: "4",
								orderExpectedTime: "2024-03-13 00:00:00",
								orderId: "40894995301002569509832",
								orderImage: null,
								orderNotes: "麻烦快一点",
								orderPickupAddress: "驿站",
								orderStatus: "5",
								orderTime: "2024-03-20",
								orderType: "0",
								receiverId: 2,
								riderId: 1,
								userId: 1,
							},
							lwReceiver: {
								receiverAddress: "a302",
								receiverCreateTime: "2024-03-20",
								receiverDefault: "0",
								receiverId: 2,
								receiverName: "小李",
								receiverPhone: "15521917952",
								receiverStatus: "0",
								userId: 1,
							},
							lwRider: {
								riderBalance: 0,
								riderCreateTime: "2024-03-20",
								riderCreditPoints: 80,
								riderId: 1,
								riderName: "测试",
								riderPhone: "15521917952",
								riderStatus: "2",
								riderStudentCard: "证件照片",
								userId: 2,
							}
						} */
				],
				rider: {},
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync('isLogin')
			this.userId = uni.getStorageSync('userId')
			this.getOrderListByUserId()
			this.getRiderData()
		},
		methods: {
			// 获取待接单的列表
			async getOrderListByUserId() {
				const res = await api.getOrderList({
					orderStatus: '1'
				})
				if (res[1].data.code === 200) {
					// 筛选不是自己的订单
					this.orderList = []
					res[1].data.data.forEach((item) => {
						if (item.lwOrder.userId !== this.userId) {
							this.orderList.push(item)
						}
					})
				}
			},
			// 帮助TA
			takOrder(order) {
				if (this.isLogin !== true) {
					uni.showToast({
						title: '请先登录',
						duration: 1000,
						icon: 'error',
					});
					return
				}
				console.log(this.canTask + '能否接单');
				console.log(order);
				if (this.canTask === true && order.userId !== this.userId) {
					this.updateOrder(order.orderId)
				} else if (this.canTask === true && order.userId === this.userId) {
					uni.showToast({
						title: '无法接自己订单',
						duration: 1000,
						icon: 'error',
					});
				} else if (this.canTask === true && this.rider.riderCreditPoints < 70) {
					uni.showToast({
						title: '信誉分低于70',
						duration: 1000,
						icon: 'error',
					});
				} else if (this.canTask === true && this.rider.riderStatus === '3') {
					uni.showToast({
						title: '骑手账号已停用',
						duration: 1000,
						icon: 'error',
					});
				} else {
					uni.showToast({
						title: '您还不是骑手',
						duration: 1000,
						icon: 'error',
					});
				}
			},
			// 接单
			async updateOrder(orderId) {
				const res = await api.updateOrder({
					orderId: orderId,
					riderId: this.rider.riderId,
					orderStatus: '2'
				})
				if (res[1].data.code === 200) {
					this.getOrderListByUserId()
					uni.showToast({
						title: '接单成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			//获取骑手信息
			async getRiderData() {
				const res = await api.getRiderData(this.userId)
				if (res[1].data.data) {
					console.log('有申请');
					this.rider = res[1].data.data
					if (this.rider.riderStatus === '0') {
						console.log('未审核');
					} else if (this.rider.riderStatus === '1') {

						console.log('通过');
						if (this.rider.riderCreditPoints < 70) {
							console.log('信誉分小于70，无法接单');
							this.canTask = true
						} else {
							console.log('可接单');
							this.canTask = true
						}
					} else {
						console.log('未通过');
					}
				} else {
					console.log('无申请');
				}
				console.log(this.canTask);
			}
		}
	}
</script>

<style>
	.body {
		width: 100%;
		height: 100%;
	}

	.top {

		height: 60rpx;
		background-color: #fff;
	}

	.item {
		margin: 30rpx 20rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
	}

	.item-type-1,
	.item-type-2,
	.item-status {
		display: inline-block;
		text-align: center;
		font-size: 40rpx;
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.item-type-1 {

		background-color: #d6f7fb;
		color: #1296db;
		border-radius: 12rpx;
	}

	.item-type-2 {

		background-color: #dafbe7;
		color: #11b764;
		border-radius: 12rpx;
	}

	.item-status {
		color: red;
		float: right;
	}

	.item-center {
		padding: 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-img image {
		width: 200rpx;
		height: 200rpx;
	}

	.item-content {
		display: inline-block;
		width: 420rpx;
		height: 200rpx;
	}

	.item-text {
		display: flex;
		padding: 10rpx;
		align-items: center;
	}

	.qu,
	.song {
		display: inline-block;
		text-align: center;
		width: 90rpx;
		height: 75rpx;
		line-height: 75rpx;
		font-size: 36rpx;
		color: #fff;
		border-radius: 6rpx;
		margin-right: 20rpx;
	}

	.qu {
		background-color: #11b764;
	}

	.song {
		background-color: #1296db;
	}

	.item-address {
		width: 320rpx;
	}

	.item-time {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		color: #8a8a8a;
		margin-top: 10rpx;
	}

	.item-amount {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.amount-img {
		display: flex;
		align-items: center;
	}

	.amount {
		font-size: 46rpx;
		margin-left: 14rpx;
		font-weight: 700;
		color: red;
		letter-spacing: 0.1rem;
	}

	.help-button {
		display: inline-block;
		text-align: center;
		font-size: 36rpx;
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #1296db;
		border-radius: 40rpx;
		color: #fff;
	}

	.content {
		padding-bottom: 30rpx;
	}

	.order-img {
		margin-top: 80rpx;
		text-align: center;
		font-size: 60rpx;
		color: #8a8a8a;
	}

	.order-img image {
		width: 600rpx;
	}
</style>