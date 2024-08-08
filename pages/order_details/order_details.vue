<template>
	<view class="body">
		<view class="o-top">
			<view class="o-content">
				<view class="o-title">
					{{ getStatusText(orderData.lwOrder.orderStatus,'1') }}
				</view>

			</view>
		</view>
		<uni-card title="代拿信息" thumbnail="/static/orderDetails/daina.png">
			<view class="o-text">
				<view class="o-left">
					代拿类型：
				</view>
				<view class="o-right" v-if="orderData.lwOrder.orderType === '0'">
					快递代拿
				</view>
				<view class="o-right" v-else>
					外卖代拿
				</view>
			</view>
			<view class="o-text" v-if="orderData.lwOrder.orderType === '0'">
				<view class="o-left">
					快递尺寸：
				</view>
				<view class="o-right">
					{{orderData.lwCharges.chargesSize}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					代拿地址：
				</view>
				<view class="o-right">
					{{orderData.lwOrder.orderPickupAddress}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					预约送达时间：
				</view>
				<view class="o-right">
					{{orderData.lwOrder.orderExpectedTime}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					取件内容：
				</view>
				<view class="o-right">
					{{orderData.lwOrder.orderContent}}
				</view>
			</view>
		</uni-card>
		<uni-card title="收货人信息" thumbnail="/static/orderDetails/shouhuoren.png">
			<view class="o-text">
				<view class="o-left">
					姓名：
				</view>
				<view class="o-right">
					{{orderData.lwReceiver.receiverName}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					电话：
				</view>
				<view class="o-right">
					{{orderData.lwReceiver.receiverPhone}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					收货地址：
				</view>
				<view class="o-right">
					{{orderData.lwReceiver.receiverAddress}}
				</view>
			</view>
		</uni-card>
		<uni-card title="骑手信息" thumbnail="/static/orderDetails/qishou.png" v-if="orderData.lwRider">
			<view class="o-text">
				<view class="o-left">
					姓名：
				</view>
				<view class="o-right">
					{{orderData.lwRider.riderName}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					电话：
				</view>
				<view class="o-right">
					{{orderData.lwRider.riderPhone}}
				</view>
			</view>
		</uni-card>
		<uni-card title="送达信息" thumbnail="/static/orderDetails/songda.png" v-if="orderData.lwOrder.orderImage">
			<view class="">
				<view class="">
					送达图片:
				</view>
				<view class="o-img" @click="lookImage(orderData.lwOrder.orderImage)">
					<image :src="orderData.lwOrder.orderImage" mode="widthFix"></image>
				</view>
			</view>
			<view class="o-text" v-if="orderData.lwOrder.orderEvaluate">
				<view class="o-left">
					订单评价：
				</view>
				<view class="o-right">
					{{ getStatusText(orderData.lwOrder.orderEvaluate,'2') }}
				</view>

			</view>
		</uni-card>
		<uni-card title="备注信息" thumbnail="/static/orderDetails/beizhu.png">
			<view v-if="orderData.lwOrder.orderNotes">
				{{orderData.lwOrder.orderNotes}}
			</view>
		</uni-card>
		<uni-card title="订单信息" thumbnail="/static/orderDetails/dingdan.png">
			<view class="o-text">
				<view class="o-left">
					订单编号：
				</view>
				<view class="o-right">
					{{orderData.lwOrder.orderId}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					订单时间：
				</view>
				<view class="o-right">
					{{orderData.lwOrder.orderTime}}
				</view>
			</view>
			<view class="o-text">
				<view class="o-left">
					订单金额：
				</view>
				<view class="o-right o-red">
					￥{{orderData.lwOrder.orderAmount}}
				</view>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		data() {
			return {
				orderId: null,
				title: '订单完成',
				orderData: {
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
				},
				//订单标题
				orderTitleList: [
					'待付款',
					'待接单',
					'待送达',
					'待收货',
					'待评价',
					'订单取消',
					'订单完成'
				],
				//订单评价
				orderEvaluateList: [
					'很差',
					'较差',
					'一般',
					'良好'
				],
			}
		},
		onShow() {
			//本地去订单id
			this.orderId = uni.getStorageSync('orderId')
			//请求订单详情
			this.getOrderById()
		},
		methods: {
			//根据订单状态获取标题
			getStatusText(status, textIndex) {
				const index = parseInt(status, 10); // 将字符串转换为整数
				if (textIndex === '1') {
					return this.orderTitleList[index] || '未知状态';
				} else if (textIndex === '2') {
					return this.orderEvaluateList[index - 1] || '未知状态';
				}

			},
			//预览图片
			lookImage(url) {
				let imgArray = [];
				imgArray[0] = url
				uni.previewImage({
					current: 0,
					urls: imgArray
				})
			},
			// 查看订单详情
			async getOrderById() {
				const res = await api.getOrderById(this.orderId)
				if (res[1].data.code === 200) {
					this.orderData = res[1].data.data
				}
			}
		}
	}
</script>

<style>
	.body {
		padding-bottom: 30rpx;
	}

	.o-top {
		display: flex;
		justify-content: flex-end;
		height: 120rpx;
		background-color: #11b764;
		margin: 30rpx 0;
	}

	.o-content {
		width: 50%;
		height: 120rpx;
		line-height: 120rpx;
		background-color: #1296db;
		text-align: center;
		border-top-left-radius: 76rpx;
		border-bottom-left-radius: 76rpx;
	}

	.o-title {
		color: #fff;
		font-size: 50rpx;
		font-weight: 700;
	}

	.o-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 0;
	}

	.o-left {
		width: 200rpx;
	}

	.o-right {
		width: 406rpx;
		text-align: right;
	}

	.o-img image {
		width: 100%;
		border-radius: 10rpx;
	}

	.o-red {
		color: red;
	}
</style>