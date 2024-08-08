<template>
	<view class="body">
		<view class="r-top">
			<view class="r-item">
				<view class="r-img r-text">
					<image src="../../static/rider/yuer.png" mode=""></image>
				</view>
				<view class="r-title r-text">
					余额
				</view>
				<view class="r-content r-text">
					￥{{rider.riderBalance}}
				</view>
			</view>
			<view class="r-item">
				<view class="r-img r-text">
					<image src="../../static/rider/xinyu.png" mode=""></image>
				</view>
				<view class="r-title r-text">
					信誉分
				</view>
				<view class="r-content r-text">
					{{rider.riderCreditPoints}}
				</view>
			</view>
		</view>
		<view class="r-list">
			<uni-list>
				<view @click="openPopup" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/rider/tixian.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">我要提现</text>
						</template>
					</uni-list-item>
				</view>
				<view @click="openRecord" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/rider/tixianjilu.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">提现记录</text>
						</template>
					</uni-list-item>
				</view>
				<view @click="openRider" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/rider/zhinan.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">骑手指南</text>
						</template>
					</uni-list-item>
				</view>
			</uni-list>
		</view>
		<uni-popup ref="sxfPopup">
			<view class="r-popup">
				<view class="rp-top">
					<view class="rp-title">
						提现信息
					</view>
					<view class="r-close" @click="closePopup">
						<uni-icons type="close" size="30"></uni-icons>
					</view>
				</view>
				<view class="form">
					<uni-forms ref="form" :modelValue="formData" label-width="180rpx">
						<uni-forms-item label="提现金额:" name="withdrawalNumber">
							<uni-easyinput :inputBorder="false" :clearable="false" type="digit"
								v-model="formData.withdrawalNumber" placeholder="提现金额不少于10元" @input="getValue()" />
						</uni-forms-item>
						<uni-forms-item label="手续费:">
							<div class="rp-item">{{formData.withdrawalCommission}}</div>
						</uni-forms-item>
						<uni-forms-item label="实际金额:">
							<div class="rp-item">{{formData.withdrawalActualAmount}}</div>
						</uni-forms-item>

						<div class="rp-sm">为了保证平台的可持续发展，将征收提取金额的25%作为手续费用于平台的日常维护</div>

					</uni-forms>
				</view>
				<view class="sub-button" @click="submitForm">
					确认提交
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		data() {
			return {
				userId: null,
				rider: {
					riderId: '',
					userId: '',
					riderName: '',
					riderPhone: '',
					riderStudentCard: '',
					riderBalance: '',
					riderCreditPoints: '',
				},
				formData: {
					riderId: '',
					withdrawalNumber: null,
					withdrawalAmount: 0,
					withdrawalCommission: 0,
					withdrawalActualAmount: 0,
				},
				rules: {
					withdrawalNumber: {
						rules: [{
							required: true,
							errorMessage: '请填写提现金额',
						}, {
							validateFunction: function(rule, value, data, callback) {
								if (parseFloat(value) < 10) {
									callback('提现金额不少于10元')
								}
								return true
							}
						}]
					},
				}
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userId')
			this.rider = uni.getStorageSync('rider')
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			openRider() {
				uni.setStorageSync('posterId', '2')
				uni.navigateTo({
					url: '/pages/poster/poster'
				})
			},
			openRecord() {
				uni.setStorageSync('riderId', this.rider.riderId)
				uni.navigateTo({
					url: '/pages/record/record'
				})
			},
			getValue(event) {

				console.log(event);
				let nub = event * 0.25
				this.formData.withdrawalCommission = parseFloat(nub.toFixed(2))
				this.formData.withdrawalActualAmount = event - this.formData.withdrawalCommission
			},
			openPopup() {
				this.formData = {}
				this.$refs.sxfPopup.open()
			},
			closePopup() {
				this.$refs.sxfPopup.close()
			},
			submitForm() {
				this.formData.withdrawalAmount = parseFloat(this.formData.withdrawalNumber)
				this.formData.riderId = this.rider.riderId
				console.log(this.formData);
				// 校验表单
				this.$refs.form.validate().then(item => {
					if (this.rider.riderBalance < this.formData.withdrawalAmount) {
						uni.showToast({
							title: '余额不足',
							duration: 1000,
							icon: 'error',
						});
					} else {
						this.withdrawal(this.formData)
					}

				})

			},
			// 提现
			async withdrawal(data) {
				const res = await api.withdrawal(data)
				if (res[1].data.code === 200) {
					this.getRiderData()
					this.$refs.sxfPopup.close()
					uni.showToast({
						title: '提现成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			// 获取骑手信息
			async getRiderData() {
				const res = await api.getRiderData(this.userId)
				console.log(res[1].data.data);
				if (res[1].data.data) {
					this.rider = res[1].data.data
					uni.setStorageSync('rider', this.rider)
				}
			}
		}
	}
</script>

<style>
	.r-top {
		display: flex;
		justify-content: space-around;
		margin: 30rpx;
		padding: 30rpx 0;
		background-color: #1296db;
		border-radius: 12rpx;
	}

	.r-item {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 200rpx;
		height: 200rpx;

	}

	.r-text {
		width: 200rpx;
		text-align: center;

	}

	.r-img {
		margin-bottom: 10rpx;
	}

	.r-img image {
		width: 100rpx;
		height: 100rpx;
	}

	.r-title {
		font-weight: 700;
		font-size: 36rpx;
		color: #fff;
	}

	.r-content {
		font-weight: 700;
		font-size: 28rpx;
		color: #fff;
		opacity: 0.5;
	}

	.r-list {
		margin: 0 30rpx;
		padding: 30rpx;
		border-radius: 16rpx;
		background-color: #fff;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		width: 50rpx;
		height: 50rpx;
	}

	.slot-text {
		lex: 1;
		font-size: 16px;
		margin-left: 16px;
		font-family: "Microsoft YaHei";
		letter-spacing: 0.1em;
	}

	.r-popup {
		width: 600rpx;
		height: 740rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.rp-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 40rpx;
	}

	.rp-title {
		font-size: 36rpx;
	}

	.form {
		padding: 0 60rpx;
	}

	.sub-button {
		text-align: center;
		font-size: 36rpx;
		margin: 0 60rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgb(67, 103, 150) 0%, rgb(18, 150, 219) 100%);
		color: #fff;
		letter-spacing: 0.2rem;
		border-radius: 20rpx;
	}

	.rp-item {
		padding-left: 20rpx;
		height: 72rpx;
		line-height: 72rpx;
	}

	.uni-forms-item {
		border-bottom: 1rpx solid #000;
	}

	.rp-sm {
		margin-bottom: 40rpx;
		color: #000;
		font-size: 24rpx;
	}
</style>