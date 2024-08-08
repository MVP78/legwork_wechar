<template>
	<view class="body">
		<view class="a-top">
		</view>
		<view class="form">
			<uni-forms ref="form" :rules="rules" :modelValue="formData" label-width="150rpx">
				<view class="a-item">
					<view class="a-item-title">
						代拿信息
					</view>
					<view class="a-item-content">
						<uni-forms-item label="短信信息:" name="orderContent">
							<uni-easyinput type="textarea" auto-height v-model="formData.orderContent"
								placeholder="填写取件码、订单号、一个快递一个订单" />
						</uni-forms-item>

						<uni-forms-item label="代拿地址:" name="orderPickupAddress">
							<uni-easyinput type="text" v-model="formData.orderPickupAddress" style="text-align: right;"
								placeholder="请输入代拿地址" />
						</uni-forms-item>
						<uni-forms-item label="预约时间:" name="orderExpectedTime">
							<uni-datetime-picker type="datetime" :start="nowDate" return-type="timestamp"
								placeholder="请选择预约送达时间" v-model="formData.orderExpectedTime" />
						</uni-forms-item>
						<uni-forms-item label="代拿金额:" v-if="orderType === '1'" name="orderAmount">
							<uni-easyinput type="text" v-model="formData.orderAmount" style="text-align: right;"
								placeholder="请输入代拿金额/元" />
						</uni-forms-item>
					</view>
				</view>
				<view class="a-item" v-if="orderType === '0'">
					<view class="a-item-title">
						选择快递标准
					</view>
					<view class="a-item-standard">
						<view class="a-item-s" v-for="(item , index) in chargesList" :key="index"
							:class="{ a_active: currentIndex === item.chargesId }" @click="toggleActive(item)">
							<view class="a-item-text" :class="{ b_active: currentIndex === item.chargesId }">
								{{item.chargesSize}}
							</view>
							<view class="a-item-text" :class="{ b_active: currentIndex === item.chargesId }">
								￥{{item.chargesAmount}}元
							</view>
							<view class="a-item-s-notes a-item-text"
								:class="{ b_active: currentIndex === item.chargesId }">
								{{item.chargesIntroduce}}
							</view>
						</view>
					</view>
					<uni-forms-item name="chargesId" label-width="30rpx">
						<input style="display: none;" type="text" v-model="formData.chargesId" />
					</uni-forms-item>
				</view>
				<view class="a-item">
					<view class="a-item-title">
						选择收货人
					</view>
					<view class="a-item-bgc" @click="openReceiver(1)">
						<uni-list :border="false">
							<uni-list-item v-if="rData.receiverId" :border="false" ellipsis="1"
								:title="rData.receiverPhone+' '+rData.receiverName" :note="rData.receiverAddress"
								showArrow />
							<uni-list-item v-else :border="false" title="请选择收货人" showArrow />
						</uni-list>
						<uni-forms-item name="receiverId" label-width="0">
							<input style="display: none;" type="text" v-model="formData.receiverId" />
						</uni-forms-item>

					</view>
				</view>
				<view class="a-item">
					<view class="a-item-title">
						订单备注
					</view>
					<view class="a-item-notes">
						<uni-easyinput type="textarea" auto-height v-model="formData.orderNotes"
							placeholder="填写备注可提醒骑手哦!!!" />
					</view>
				</view>
			</uni-forms>
			<view class="a-sumbint">
				<view class="sub-button" @click="submitForm">
					确认提交
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		computed
	} from "vue"
	import api from '../../api/index.js'
	export default {
		computed: {
			nowDate() {
				return new Date();
			}
		},
		data() {
			return {
				userId: null,
				orderType: '',
				currentIndex: '',
				chargesId: '',
				formData: {
					userId: '',
					receiverId: '',
					orderType: '',
					orderContent: '',
					orderPickupAddress: '',
					orderExpectedTime: '',
					orderNotes: '',
					orderAmount: '',
					orderStatus: '',
				},
				chargesList: [{
						chargesId: '1',
						chargesSize: '超小件',
						chargesIntroduce: '拳头大小',
						chargesAmount: 2,
					},
					{
						chargesId: '2',
						chargesSize: '小件',
						chargesIntroduce: '鞋盒大小',
						chargesAmount: 5,
					},

				],
				rData: {
					receiverId: '1',
					receiverName: '方杰锋',
					receiverPhone: '15521917952',
					receiverAddress: '海安A302',
					receiver_default: '0',
				},
				dfDa: {},
				rules: {
					orderContent: {
						rules: [{
							required: true,
							errorMessage: '请填写短信信息',
						}]
					},
					orderPickupAddress: {
						rules: [{
							required: true,
							errorMessage: '请填写代拿地址',
						}]
					},
					orderExpectedTime: {
						rules: [{
							required: true,
							errorMessage: '请填写预约时间',
						}]
					},
					orderAmount: {
						rules: [{
							required: true,
							errorMessage: '请填写代拿金额',
						}, {
							format: 'number',
							errorMessage: '请输入数字'
						}]
					},
					chargesId: {
						rules: [{
							required: true,
							errorMessage: '请选择快递标准',
						}]
					},
					receiverId: {
						rules: [{
							required: true,
							errorMessage: '请选择收货人',
						}]
					},
				},
			}
		},
		onShow() {
			this.orderType = uni.getStorageSync('orderType')
			this.formData.orderType = this.orderType
			this.userId = uni.getStorageSync('userId')
			//请求获取快递标准
			this.getChargesList()
			// 获取默认收货人
			this.getdefaultReceiver()

			if (uni.getStorageSync('order')) {
				this.formData = uni.getStorageSync('order')
				this.currentIndex = this.formData.chargesId
			}

		},
		onUnload() {
			uni.reLaunch({
				url: '/pages/index/index'
			})
		},
		methods: {
			toggleActive(item) {
				this.currentIndex = item.chargesId
				this.formData.chargesId = item.chargesId
				console.log(this.chargesId);
				this.formData.orderAmount = item.chargesAmount
			},
			// 选择收货人
			openReceiver(entryState) {
				uni.setStorageSync('entryState', entryState);
				uni.setStorageSync('order', this.formData)
				uni.navigateTo({
					url: '/pages/receiver/receiver'
				})
			},
			// 提交表单
			submitForm() {
				this.formData.userId = this.userId
				this.formData.orderStatus = '1'
				console.log(this.formData);

				// 校验表单
				this.$refs.form.validate().then(item => {
					this.addOrder(this.formData)
				})

			},
			// 获取快递标准
			async getChargesList() {
				const res = await api.getChargesList()
				if (res[1].data.code === 200) {
					this.chargesList = res[1].data.data
				}
			},
			// 获取默认收货人
			async getdefaultReceiver() {
				const res = await api.getReceiverList({
					userId: this.userId,
					receiverDefault: '0'
				})
				if (res[1].data.code === 200) {
					// 判断选择是否为默认地址
					if (uni.getStorageSync('isdefault')) {
						if (res[1].data.data[0]) {
							this.rData = res[1].data.data[0]
							this.formData.receiverId = this.rData.receiverId
						} else {
							this.rData = {}
						}
					} else {
						this.rData = uni.getStorageSync('receiver')
						this.formData.receiverId = this.rData.receiverId
					}
				}
			},
			//下单
			async addOrder(data) {
				const res = await api.addOrder(data)
				if (res[1].data.code === 200) {
					console.log(111);
					setTimeout(function() {
						uni.switchTab({
							url: `/pages/index/index`,
						});
					}, 1000)
					//弹窗
					uni.showToast({
						title: '下单成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},

		}
	}
</script>

<style>
	.a-top {
		height: 60rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
	}

	.form {
		margin: 0 30rpx;
	}

	.name-red {
		color: #f56c6c;
		font-size: 24rpx;
		padding: 20rpx;
	}

	.a-item {
		padding: 30rpx 0;
		margin-bottom: 30rpx;
		background-color: #fff;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
		border-radius: 10rpx;
	}

	.a-item-title {
		border-left: 10rpx solid #1296db;
		padding: 10rpx 24rpx;
		margin: 0 30rpx 30rpx 30rpx;
	}

	.a-item-content {
		margin: 0 60rpx;
	}

	.a-item-standard {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.a-item-s {
		display: flex;
		justify-content: space-around;
		align-content: space-around;
		flex-wrap: wrap;
		width: 250rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #b5efff;
		border-radius: 10rpx;
	}

	.a-item-text {
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		margin-bottom: 20rpx;
		color: #8a8a8a;
	}

	.a-item-s-notes {
		font-size: 30rpx;
		font-weight: 400;
		margin-bottom: 0;
	}

	.a_active {
		background-color: #1296db;
	}

	.b_active {
		color: #fff;
	}

	.a-item-bgc {
		margin: 0 30rpx;
	}

	.uni-list-item {
		background-color: #b5efff !important;
		border-radius: 10rpx;
	}

	.a-item-notes {
		margin: 0 30rpx;
	}

	.a-sumbint {
		padding: 30rpx 0;
	}

	.sub-button {
		text-align: center;
		font-size: 36rpx;

		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgb(67, 103, 150) 0%, rgb(18, 150, 219) 100%);
		color: #fff;
		letter-spacing: 0.2rem;
		border-radius: 20rpx;
	}
</style>