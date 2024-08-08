<template>
	<view class="body">
		<!-- 选项卡1 -->
		<view class="o-top">
			<view class="o-top-title o-top-title-border-left" :class="{o_top_active :roleIndex === '0'}"
				@click="toggleActive('0')">
				<view class="o-top-img" v-if="roleIndex==='0'">
					<image src="../../static/order/xiadan1.png" mode=""></image>
				</view>
				<view class="o-top-img" v-else>
					<image src="../../static/order/xiadan.png" mode=""></image>
				</view>
				<view class="o-top-text" :class="{o_top_active :roleIndex === '0'}">
					我发布的
				</view>
			</view>
			<view class="o-top-title o-top-title-border-right" :class="{o_top_active :roleIndex === '1'}"
				@click="toggleActive('1')">
				<view class="o-top-img" v-if="roleIndex==='1'">
					<image src="../../static/order/jieshou1.png" mode=""></image>
				</view>
				<view class="o-top-img" v-else>
					<image src="../../static/order/jieshou.png" mode=""></image>
				</view>
				<view class="o-top-text" :class="{o_top_active :roleIndex === '1'}">
					我接收的
				</view>
			</view>
		</view>
		<!-- 选项卡2-1 -->
		<view class="tab-bar">
			<uni-segmented-control :current="currentTab" @clickItem="onClickItem" :values="tabOptions"
				styleType="button" activeColor="#1296db" />
		</view>

		<view class="order-list">
			<orderItem :orderList="seletOrderList" :roleIndex="roleIndex" :statusIndex="statusIndex"
				@resetValue="updateValue"></orderItem>
			<view class="order-img" v-if="seletOrderList.length === 0">
				<image src="../../static/bigImg/zanwudingdan.png" mode=""></image>
				<view>
					暂无相关订单
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		data() {
			return {
				userId: null,
				roleIndex: '0',
				statusIndex: '0',
				currentTab: 0,
				tabOptions: ['全部', '待支付', '待接单', '待送达', '待收货', '待评价'],
				orderList: [{
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
				}],
				seletOrderList: [],
				//用户tab栏订单状态码
				orderStatusList: ['-1', '0', '1', '2', '3', '4'],
				//骑手tab栏订单状态码，
				riderStatusList: ['-1', '2', '3'],
				rider: {},
			}
		},
		onShow() {
			//请求获取列表
			this.userId = uni.getStorageSync('userId')
			this.roleIndex = '0'
			this.tabOptions = ['全部', '待支付', '待接单', '待送达', '待收货', '待评价']
			this.statusIndex = '0'
			this.currentTab = 0
			this.getOrderListByUserId()
		},
		methods: {
			//一级选项卡
			toggleActive(index) {
				if (index === '0') {
					this.tabOptions = ['全部', '待支付', '待接单', '待送达', '待收货', '待评价']
					this.getOrderListByUserId()
				} else if (index === '1') {
					this.tabOptions = ['全部', '待送达', '待收货']
					this.getOrderListByRiderId()
				}
				this.roleIndex = index
				this.currentTab = 0
				this.statusIndex = '0'
				this.getSeletOredrList(this.roleIndex, this.statusIndex)
			},
			//二级选项卡
			onClickItem(e) {
				if (this.currentTab != e.currentIndex) {
					this.currentTab = e.currentIndex;
					this.statusIndex = this.currentTab.toString()
					this.getSeletOredrList(this.roleIndex, this.statusIndex)
				}
			},
			//            roleIndex  statusIndex
			//计算获取当前  角色状态    订单状态 的订单数量
			getSeletOredrList(roleIndex, statusIndex) {
				console.log('一级：' + roleIndex, '二级：' + statusIndex);
				this.seletOrderList = []

				//我发布的（用户）
				if (roleIndex === '0') {
					//请求查寻用户所有订单

					if (statusIndex === '0') {
						this.seletOrderList = this.orderList
					} else {
						const index = parseInt(statusIndex, 10); // 将字符串转换为整数
						//获取当前用户订单状态码
						let status = this.orderStatusList[index] || '-1'
						this.orderList.forEach((item) => {
							if (item.lwOrder.orderStatus === status) {
								this.seletOrderList.push(item)
							}
						})

					}

					//我接收的（骑手）
				} else if (roleIndex === '1') {
					//请求查询当前骑手所有订单

					if (statusIndex === '0') {
						this.seletOrderList = this.orderList
					} else {
						const index = parseInt(statusIndex, 10); // 将字符串转换为整数
						//获取当前骑手订单状态码
						let status = this.riderStatusList[index] || '-1'
						this.orderList.forEach((item) => {
							if (item.lwOrder.orderStatus === status) {
								this.seletOrderList.push(item)
							}
						})

					}
				}
				// console.log(this.seletOrderList);
			},
			// 获取我发出的列表
			async getOrderListByUserId() {
				const res = await api.getOrderList({
					userId: this.userId
				})
				if (res[1].data.code === 200) {
					this.orderList = res[1].data.data
					this.getSeletOredrList('0', '0')
				}
			},
			// 切换我接受的
			getOrderListByRiderId() {
				// 判断是否为骑手
				this.getRiderData()
			},

			// 获取我接收的列表
			async isGetOrderList(riderId) {
				const res = await api.getOrderList({
					riderId: riderId
				})
				if (res[1].data.code === 200) {
					this.orderList = res[1].data.data
					this.getSeletOredrList('1', '0')
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
						this.isGetOrderList(this.rider.riderId)
					} else if (this.rider.riderStatus === '2') {
						console.log('未通过');
					} else {
						console.log('无权限');
						this.isGetOrderList(this.rider.riderId)
					}
				} else {
					console.log('无申请');
				}
				console.log(this.canTask);
			},
			// 完成各个操作时，重置二级选项卡
			updateValue(newValue) {
				console.log(newValue);
				this.statusIndex = newValue;
				this.currentTab = 0
			},
		}
	}
</script>

<style>
	.o-top {
		display: flex;
		background-color: #fff;
		margin: 20rpx;
		border-radius: 10rpx;
	}

	.o-top-title {
		display: flex;
		padding: 30rpx 0;
		justify-content: center;
		width: 50%;
		text-align: center;
	}

	.o-top-title-border-left {
		border-bottom-left-radius: 10rpx;
		border-top-left-radius: 10rpx;
	}

	.o-top-title-border-right {
		border-bottom-right-radius: 10rpx;
		border-top-right-radius: 10rpx;
	}

	.o-top-img image {
		width: 50rpx;
		height: 50rpx;
	}

	.o-top-text {
		height: 50rpx;
		line-height: 50rpx;
		margin-left: 10rpx;
		font-size: 36rpx;
		color: #1296db;
	}

	.o_top_active {
		background-color: #1296db;
		color: #fff;
	}

	.tab-bar {
		margin: 20rpx;
	}

	.order-list {
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