<template>
	<view class="body">
		<view class="r-top">
		</view>
		<view class="r-list">
			<view class="r-item" v-for="(item,index) in rList" :key="item.receiverId" @click="selectReceiver(item)">
				<view class="r-left">
					<view class="r-name-top r-a-same">
						<view class="r-name">
							{{item.receiverName}}
						</view>
						<view class="r-defuet" v-if="item.receiverDefault === '0'">
							默认
						</view>
					</view>
					<view class="r-iphone r-a-same">
						<view class="r-icon">
							<uni-icons type="phone" size="30"></uni-icons>
						</view>
						<view class="r-text">
							{{item.receiverPhone}}
						</view>

					</view>
					<view class="r-address r-a-same">
						<view class="r-icon">
							<uni-icons type="location" size="30"></uni-icons>
						</view>
						<view class="r-text">
							{{item.receiverAddress}}
						</view>
					</view>
				</view>
				<view class="r-right">
					<view class="r-delete" @click.stop="detReceiver(item.receiverId
					)">
						<uni-icons type="trash" size="50"></uni-icons>
					</view>
					<view class="r-update" @click.stop="openPopup(item.receiverId)">
						<uni-icons type="compose" size="50"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="order-img" v-if="rList.length === 0">
			<image src="../../static/bigImg/zanwushouhuoren.png" mode=""></image>
			<view>
				暂无收货人
			</view>
		</view>
		<view class="r-buttom">
			<view class="r-add" @click.stop="openPopup()">
				新增收货人
			</view>
		</view>
		<uni-popup ref="rPopup">
			<view class="r-content">
				<view class="r-a-top">
					<view class="r-title">
						{{title}}
					</view>
					<view class="r-close" @click="closePopup">
						<uni-icons type="close" size="30"></uni-icons>
					</view>
				</view>
				<view class="form">
					<uni-forms ref="form" :rules="rules" :modelValue="formData" labelWidth="160rpx">
						<uni-forms-item name="receiverName" label="收货人:">
							<uni-easyinput :inputBorder="false" :clearable="false" type="text"
								v-model="formData.receiverName" placeholder="请输入收货人" />
						</uni-forms-item>
						<uni-forms-item name="receiverPhone" label="收货电话:">
							<uni-easyinput :inputBorder="false" :clearable="false" type="text"
								v-model="formData.receiverPhone" placeholder="请输入收货电话" />
						</uni-forms-item>
						<uni-forms-item name="receiverAddress" label="收货地址:">
							<uni-easyinput :inputBorder="false" :clearable="false" type="text"
								v-model="formData.receiverAddress" placeholder="请输入收货地址" />
						</uni-forms-item>
						<uni-forms-item label="默认地址:">
							<view class="r-switch">
								<switch color="#1296db" :checked="checked" @change="switchChange" />
							</view>
						</uni-forms-item>
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
				title: '',
				checked: false,
				rList: [],
				formData: {
					receiverId: '',
					receiverName: '',
					receiverPhone: '',
					receiverAddress: '',
					receiverDefault: '1',
				},
				rules: {
					receiverName: {
						rules: [{
							required: true,
							errorMessage: '请填写收货人姓名',
						}]
					},
					receiverPhone: {
						rules: [{
							format: 'number',
							errorMessage: '请输入数字'
						}, {
							required: true,
							errorMessage: '请填写收货人电话',
						}]
					},
					receiverAddress: {
						rules: [{
							required: true,
							errorMessage: '请填写收货人地址',
						}]
					},
				},
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userId')
			this.getReceiverList()
		},
		methods: {
			//选择收货人
			selectReceiver(item) {
				if (uni.getStorageSync('entryState') === 1) {
					uni.setStorageSync('receiver', item)
					uni.setStorageSync('isdefault', false)
					uni.navigateTo({
						url: '/pages/add_order/add_order'
					})
				}
			},
			//删除收货人
			detReceiver(id) {
				uni.showModal({
					title: '确认删除',
					content: '您确定要删除该收货人吗？',
					success: (res) => {
						if (res.confirm) {
							console.log(id)
							//删除
							this.delReceiver(id)
						}
					},
				});
			},
			//打开新增/修改窗口
			openPopup(id) {
				this.formData = {}
				this.checked = false
				if (id) {
					this.title = '修改收货人'
					//回显
					this.getReceiverById(id)

					this.$refs.rPopup.open()
				} else {
					this.title = '新增收货人'
					this.$refs.rPopup.open()
				}
			},
			//提交表单
			submitForm() {
				//表单校验
				this.$refs.form.validate().then(res => {
					if (this.formData.receiverId) {
						//修改
						this.updateReceiver(this.formData)
						//请求
						this.$refs.rPopup.close()
					} else {
						//新增
						this.formData.userId = this.userId
						this.formData.receiverStatus = '0'
						this.addReceiver(this.formData)
						//请求
						this.$refs.rPopup.close()
					}
				})

			},
			//关闭弹窗
			closePopup() {

				this.$refs.rPopup.close()
			},
			//是否默认按钮
			switchChange(e) {
				this.formData.receiverDefault = e.detail.value === false ? '1' : '0'
				console.log('携带值为', e.detail.value)
			},
			//获取当前收货人列表
			async getReceiverList() {
				const res = await api.getReceiverList({
					userId: this.userId
				})
				if (res[1].data.code === 200) {
					this.rList = []
					res[1].data.data.forEach((item) => {
						if (item.receiverStatus === '0') {
							this.rList.push(item)
						}
					})

				}
			},
			// 根据id获取收货人信息
			async getReceiverById(id) {
				const res = await api.getReceiverById(id)
				if (res[1].data.code === 200) {
					this.formData = res[1].data.data
					this.checked = this.formData.receiverDefault === '1' ? false : true
				}
			},
			//修改收货人信息
			async updateReceiver(data) {
				const res = await api.updateReceiver(data)
				if (res[1].data.code === 200) {
					this.getReceiverList()
					uni.showToast({
						title: '修改成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			// 新增收货人
			async addReceiver(data) {
				const res = await api.addReceiver(data)
				if (res[1].data.code === 200) {
					this.getReceiverList()
					uni.showToast({
						title: '添加成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
			//删除收货人
			async delReceiver(id) {
				const res = await api.delReceiver({
					receiverId: id
				})
				if (res[1].data.code === 200) {
					this.getReceiverList()
					uni.showToast({
						title: '删除成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},

		}
	}
</script>

<style>
	.r-top {
		background-color: #fff;
		height: 60rpx;
		margin-bottom: 30rpx;
	}

	.r-list {
		padding: 0 20rpx 130rpx 20rpx;
	}

	.r-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 70rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
	}

	.r-left {
		width: 700rpx;

	}

	.r-a-same {
		margin-bottom: 26rpx;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.r-name {
		font-size: 36rpx;
	}

	.r-text {
		font-size: 30rpx;
		color: #8a8a8a;
	}

	.r-defuet {
		margin-left: 40rpx;
		text-align: center;
		width: 110rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		color: #8a8a8a;
		letter-spacing: 0.1rem;
		background-color: #cccccc;
	}

	.uni-icons {
		color: #1296db !important;
	}

	.r-delete {
		margin-bottom: 20rpx;
	}

	.r-buttom {
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 30rpx;
		width: 100%;
		background-color: #fff;
		z-index: 99;
	}

	.r-add {
		text-align: center;
		font-size: 36rpx;
		height: 80rpx;
		margin-right: 60rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgb(67, 103, 150) 0%, rgb(18, 150, 219) 100%);
		color: #fff;
		letter-spacing: 0.2rem;
		border-radius: 20rpx;
	}

	.r-content {
		width: 600rpx;
		height: 700rpx;
		background-color: #fff;
		border-radius: 16rpx;
	}

	.r-switch {
		padding: 0 20rpx;
	}

	.r-a-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
	}

	.r-title {
		font-size: 36rpx;
	}

	.uni-forms-item {
		border-bottom: 1rpx solid #000;
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

	.order-img {
		text-align: center;
		font-size: 60rpx;
		color: #8a8a8a;
	}

	.order-img image {
		width: 600rpx;
	}
</style>