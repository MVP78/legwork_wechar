<template>
	<view>
		<view class="top">
		</view>
		<view class="card">
			<uni-card v-for="(item,index) in recordList">
				<view class="o-text">
					<view class="o-left">
						提现金额：
					</view>
					<view class="o-right">
						￥{{item.withdrawalAmount}}
					</view>
				</view>
				<view class="o-text">
					<view class="o-left">
						手续费：
					</view>
					<view class="o-right">
						￥{{item.withdrawalCommission}}
					</view>
				</view>
				<view class="o-text">
					<view class="o-left">
						到账金额：
					</view>
					<view class="o-right">
						￥{{item.withdrawalActualAmount}}
					</view>
				</view>
				<view class="o-text">
					<view class="o-left">
						提现时间：
					</view>
					<view class="o-right">
						{{item.withdrawalTime}}
					</view>
				</view>
			</uni-card>
		</view>

		<view class="order-img" v-if="recordList.length === 0">
			<image src="../../static/bigImg/zanwutixian.png" mode=""></image>
			<view>
				暂无提现信息
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/index.js'
	export default {
		data() {
			return {
				riderId: null,
				recordList: [{
					withdrawalAmount: 10,
					withdrawalCommission: 2,
					withdrawalActualAmount: 8,
					withdrawalTime: '2024-11-12 11:11:11',
				}, ]
			}
		},
		onShow() {
			this.riderId = uni.getStorageSync('riderId')
			this.getWithdrawalList()
		},
		methods: {
			async getWithdrawalList() {
				const res = await api.getWithdrawalList({
					riderId: this.riderId
				})
				if (res[1].data.code === 200) {
					this.recordList = res[1].data.data
				}
			}
		}
	}
</script>

<style>
	.body {
		padding-bottom: 30rpx;
	}

	.card {
		padding-bottom: 20rpx;
	}

	.top {
		height: 60rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
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