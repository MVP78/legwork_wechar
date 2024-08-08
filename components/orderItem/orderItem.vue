<template>
	<view>
		<view class="content">
			<view class="item" v-for="(item,index) in orderList" :key="index" @click="openOrder(item.lwOrder.orderId)">
				<view class="item-top">
					<view class="item-type-1" v-if="item.lwOrder.orderType === '0'">
						快递代拿
					</view>
					<view class="item-type-2" v-else>
						外卖代拿
					</view>
					<view class="item-status">
						{{getStatusText(item.lwOrder.orderStatus)}}
					</view>
				</view>
				<view class="item-center">
					<view class="item-img" v-if="item.lwOrder.orderType === '0'">
						<image src="../../static/content/kuaidi.png" mode=""></image>
					</view>
					<view class="item-img" v-else>
						<image src="../../static/content/waimai.png" mode=""></image>
					</view>
					<!-- 送达图片
					<view class="item-img">
						<image src="../../static/content/waimai.png" mode=""></image>
					</view> -->
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
						<!-- 用户部分 -->
						<view class="help-button" v-if="item.lwOrder.orderStatus === '0' && roleIndex === '0'"
							@click.stop="openEdit('1',item.lwOrder.orderId)">
							前往付款
						</view>
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '1'&& roleIndex === '0'"
							@click.stop="openEdit('2',item.lwOrder.orderId)">
							取消订单
						</view>
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '2'&& roleIndex === '0'">
							等待送达
						</view>
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '3'&& roleIndex === '0'"
							@click.stop="openEdit('3',item.lwOrder.orderId)">
							确认收货
						</view>
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '4'&& roleIndex === '0'"
							@click.stop="openEdit('4',item.lwOrder.orderId)">
							立即评价
						</view>
						<!-- 骑手部分 -->
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '2' && roleIndex === '1'"
							@click.stop="openEdit('5',item.lwOrder.orderId)">
							确认送达
						</view>
						<view class="help-button" v-else-if="item.lwOrder.orderStatus === '3' && roleIndex === '1'">
							等待收货
						</view>
						<!-- 相同部分 -->
						<view class="help-button" v-else>
							查看详情
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<uni-popup ref="ratePopup">
			<view class="o-rate">
				<view class="o-xin">
					<uni-rate v-model="rateValue" :size="36" :max="4" @change="onChange" />
				</view>
				<view class="o-title">
					{{title}}
				</view>
				<view class="submit-btn" @click="rateSubmit">
					确认评价
				</view>
			</view>
		</uni-popup>
		<!-- 送达 -->
		<uni-popup ref="imgPopup">
			<view class="o-img">
				<view class="o-img-close" @click="closeImgPopup">
					<uni-icons type="closeempty" size="30"></uni-icons>
				</view>
				<view class="o-img-title">
					上传送达照片
				</view>
				<view v-if="src" class="o-img-src">
					<image :src="src" mode=""></image>
					<view class="o-img-clear" @click.stop="clearImage">
						<uni-icons type="clear" size="30"></uni-icons>
					</view>
				</view>
				<view v-else class="o-img-src" @click="chooseImage">
					<view class="o-img-add">
						+
					</view>
				</view>

				<view class="submit-btn" @click="imgSubmit">
					确认送达
				</view>
			</view>

		</uni-popup>

	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		name: "orderItem",
		props: {
			orderList: [],
			roleIndex: {},
			statusIndex: {},
		},
		data() {
			return {
				rateValue: 4,
				title: '良好',
				src: '',
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
				orderId: '',
			};
		},
		methods: {
			closeImgPopup() {
				this.$refs.imgPopup.close()
			},
			//选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						console.log(res)
						const tempFilePaths = res.tempFilePaths;
						this.uploadImage(tempFilePaths[0])

					},
					fail: (err) => {
						console.error(err.errMsg);
					},
				});
			},
			//清除图片
			clearImage() {
				this.src = null;
			},

			onChange(e) {
				if (this.rateValue === 4) {
					this.title = '良好'
				} else if (this.rateValue === 3) {
					this.title = '一般'
				} else if (this.rateValue === 2) {
					this.title = '较差'
				} else if (this.rateValue === 1) {
					this.title = '很差'
				}

			},
			openEdit(index, orderId) {
				if (index === '1') {
					//付款
					this.updateOrder({
						orderId: orderId,
						orderStatus: '1'
					})
					this.resetOptions()
					uni.showToast({
						title: '付款成功',
						duration: 1000,
						icon: 'true',
					});
				} else if (index === '2') {
					//取消
					uni.showModal({
						title: '取消订单',
						content: '您确定要取消该订单吗？',
						success: (res) => {
							if (res.confirm) {
								//删除
								this.updateOrder({
									orderId: orderId,
									orderStatus: '5'
								})
								this.resetOptions()
								uni.showToast({
									title: '取消成功',
									duration: 1000,
									icon: 'true',
								});
							}
						},
					});
				} else if (index === '3') {
					//确认收货
					uni.showModal({
						title: '确认收货',
						content: '您确定要已接收到货件吗？',
						success: (res) => {
							if (res.confirm) {
								//收货
								this.confirmOrder({
									orderId: orderId,
									orderStatus: '4'
								})
								this.resetOptions()
								uni.showToast({
									title: '确认成功',
									duration: 1000,
									icon: 'true',
								});
							}
						},
					});
				} else if (index === '4') {
					//评价
					this.orderId = orderId
					this.$refs.ratePopup.open()
				} else {
					//确认送达
					this.orderId = orderId
					this.clearImage()
					this.$refs.imgPopup.open()
				}
			},
			// 确认送达
			imgSubmit() {
				this.updateGetOrder({
					orderId: this.orderId,
					orderImage: this.src,
					orderStatus: '3'
				})
			},
			//评价订单
			rateSubmit() {
				this.evaluateOrder({
					orderId: this.orderId,
					orderEvaluate: this.rateValue,
					orderStatus: '6'
				})
			},
			//打开订单详情
			openOrder(orderId) {
				uni.setStorageSync('orderId', orderId)
				//存到本地
				uni.navigateTo({
					url: '/pages/order_details/order_details'
				})
			},
			//根据订单状态获取标题
			getStatusText(status) {
				const index = parseInt(status, 10); // 将字符串转换为整数
				return this.orderTitleList[index] || '未知状态';
			},

			// 更改我发起的订单
			async updateOrder(data) {
				const res = await api.updateOrder(data)
				if (res[1].data.code === 200) {
					//更新订单
					this.$parent.getOrderListByUserId()
				}
			},
			// 更改我接受的订单
			async updateGetOrder(data) {
				const res = await api.updateOrder(data)
				if (res[1].data.code === 200) {
					this.$refs.imgPopup.close()
					//更新订单
					this.$parent.getOrderListByRiderId()
					this.resetOptions()
					uni.showToast({
						title: '送达成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			// 确认收货
			async confirmOrder(data) {
				const res = await api.confirmOrder(data)
				if (res[1].data.code === 200) {
					//更新订单
					this.$parent.getOrderListByUserId()
				}
			},
			// 评价订单
			async evaluateOrder(data) {
				const res = await api.evaluateOrder(data)
				if (res[1].data.code === 200) {
					this.$refs.ratePopup.close()
					//更新订单
					this.$parent.getOrderListByUserId()
					this.resetOptions()
					uni.showToast({
						title: '评价成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			//上传图片
			async uploadImage(filePath) {
				const res = await api.uploadImage(filePath)
				if (res.statusCode === 200) {
					let temp = JSON.parse(res.data);
					this.src = temp.data.url
				}
			},
			//二级选项卡归0
			resetOptions() {
				this.$emit('resetValue', '0');
			}
		}
	}
</script>

<style scoped>
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

	.o-rate {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding: 60rpx 30rpx 0 30rpx;
		background-color: #fff;
		width: 500rpx;
		height: 350rpx;
		border-radius: 20rpx;
	}

	.o-xin {}

	.o-title {
		width: 500rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 36rpx;

		color: #1296db;
		font-weight: 700;
	}

	.submit-btn {
		text-align: center;
		font-size: 36rpx;
		width: 100%;
		margin-top: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgb(67, 103, 150) 0%, rgb(18, 150, 219) 100%);
		color: #fff;
		letter-spacing: 0.2rem;
		border-radius: 20rpx;
	}

	.o-img {
		position: relative;
		width: 500rpx;
		height: 500rpx;
		padding: 60rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.o-img-close {
		position: absolute;
		right: 36rpx;
		top: 14px;
	}

	.o-img-title {
		margin-bottom: 60rpx;
		font-size: 36rpx;
		color: #1296db;
		font-weight: 700;
	}

	.o-img-src {
		position: relative;
		height: 300rpx;
		font-size: 114rpx;
		line-height: 300rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #1296db;
		border: 1px solid #1296db;
	}

	.o-img-src image {
		width: 100%;
		height: 300rpx;
	}

	.o-img-clear {
		position: absolute;
		right: 10rpx;
		top: -64px;
	}
</style>