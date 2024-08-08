<template>
	<view class="body">
		<view class="a-top">

		</view>
		<view class="ar_1" v-if="formData.riderStatus ==='0'">
			<view class="ar_img">
				<image src="../../static/bigImg/shenhe.png" mode=""></image>
			</view>
			<view class="ar_text">
				等待审核
			</view>
		</view>
		<view class="ar_2" v-else>
			<view class="ar_3" v-if="formData.riderStatus === '2'">
				审核未通过，请重新申请
			</view>
			<view class="form">
				<uni-forms ref="form" :rules="rules" :modelValue="formData" label-width="150rpx">
					<view class="a-item">
						<view class="a-item-title">
							填写申请信息
						</view>
						<view class="a-item-content">
							<uni-forms-item name="riderName" label="真实姓名:">
								<uni-easyinput type="text" v-model="formData.riderName" placeholder="填写真实姓名" />
							</uni-forms-item>
							<uni-forms-item name="riderPhone" label="电话号码:">
								<uni-easyinput type="text" v-model="formData.riderPhone" placeholder="填写电话号码" />
							</uni-forms-item>
							<uni-forms-item name="riderStudentCard" label="学生证件:">
							</uni-forms-item>
							<view class="a-item-paper">
								<view class="a-item-box">
									<view class="a-item-img" @click="lookImage(paperImg)">
										<image :src="paperImg" mode=""></image>
									</view>
									<view class="a-item-t a-text">
										示例
									</view>
								</view>
								<view class="a-item-box">
									<view class="a-item-img">
										<image v-if="formData.riderStudentCard" :src="formData.riderStudentCard">
											<view v-if="formData.riderStudentCard" class="a-item-clear"
												@click="clearImage">
												<uni-icons type="clear" size="30"></uni-icons>
											</view>
										</image>
										<view v-else class="a-item-icon" @click="chooseImage">
											+
										</view>
									</view>
									<view class="a-item-t a-text">
										上传
									</view>
								</view>
							</view>
							<view class="a-item-notes a-text">
								证件照片中需清晰展示证件学号、真实姓名和个人图像。且能够证明学籍。
							</view>
						</view>
					</view>
				</uni-forms>
			</view>
			<view class="a-agree">
				<view class="a-agree-box">
					<uni-data-checkbox multiple v-model="checkbox" :localdata="hobby"></uni-data-checkbox>
				</view>
				<view class="a-agree-box">
					我已阅读<text style="color: red;">《申请骑手协议》</text>,勾选表示同意协议
				</view>
			</view>
			<view class="a-sumbint">
				<view class="sub-button" @click="submitForm">
					确认提交
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
				isApply: false,
				paperImg: '../../static/bigImg/id-card.png',
				formData: {
					userId: '',
					riderName: '',
					riderPhone: '',
					riderStudentCard: '',
				},
				checkbox: [],
				hobby: [{
					text: '',
					value: 0
				}, ],
				rules: {
					riderName: {
						rules: [{
							required: true,
							errorMessage: '请填写真实姓名',
						}]
					},
					riderPhone: {
						rules: [{
							required: true,
							errorMessage: '请填写电话号',
						}, {
							format: 'number',
							errorMessage: '请输入数字'
						}, ]
					},
					riderStudentCard: {
						rules: [{
							required: true,
							errorMessage: '请选择证件图片',
						}]
					},
				},
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userId')
			//请求获取骑手数据
			//有申请
			if (uni.getStorageSync('rider')) {
				this.formData = uni.getStorageSync('rider')
				this.isApply = true
			}

		},
		methods: {
			submitForm() {
				// 表单校验
				this.$refs.form.validate().then(item => {
					this.formData.userId = this.userId
					this.formData.riderStatus = '0'
					console.log(this.formData);
					if (this.isApply === true) {
						console.log('重新申请');
						this.reapplyRider(this.formData)
					} else {
						console.log('申请');
						this.applyRider(this.formData)
					}
				})

			},
			//选择照片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						this.uploadImage(tempFilePaths[0])
					},
					fail: (err) => {
						console.error(err.errMsg);
					},
				});
			},

			//上传图片
			async uploadImage(filePath) {
				const res = await api.uploadImage(filePath)
				if (res.statusCode === 200) {
					let temp = JSON.parse(res.data);
					this.formData.riderStudentCard = temp.data.url
				}
			},
			//清除图片
			clearImage() {
				this.formData.riderStudentCard = null;
			},
			//预览图片
			lookImage(url) {
				let imgArray = [];
				imgArray[0] = url
				//无法预览本地图片
				uni.previewImage({
					current: 0,
					urls: imgArray
				})
			},
			// 申请骑手 新增
			async applyRider(data) {
				const res = await api.applyRider(data)
				if (res[1].data.code === 200) {

				}
			},
			// 重新申请 修改
			async reapplyRider(data) {
				const res = await api.reapplyRider(data)
				if (res[1].data.code === 200) {
					setTimeout(function() {
						uni.switchTab({
							url: `/pages/index/index`,
						});
					}, 1000)
					uni.showToast({
						title: '申请成功',
						duration: 1000,
						icon: 'true',
					});
				}
			},
		}
	}
</script>

<style>
	.body {}

	.a-top {
		height: 60rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
	}

	.form {
		margin: 0 30rpx;
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

	.a-item-paper {
		display: flex;
		justify-content: space-between;
	}

	.a-item-img {
		width: 276rpx;
		height: 200rpx;
		position: relative;
		text-align: center;
		border: 1rpx dashed #8a8a8a;
		border-radius: 10rpx;
	}

	.a-item-img image {
		width: 275rpx;
		height: 200rpx;
	}

	.a-item-icon {
		width: 275rpx;
		height: 200rpx;
		line-height: 200rpx;
		text-align: center;
		font-size: 70rpx;
		color: #8a8a8a;
	}

	.a-item-t {
		text-align: center;
		padding: 20rpx 0;

	}

	.a-text {
		color: #8a8a8a;
		font-size: 26rpx
	}

	.a-item-clear {
		position: absolute;
		right: 0;
		top: 0;
	}

	.a-agree {
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.a-agree-box {
		height: 52rpx;
		line-height: 52rpx;
		font-size: 26rpx;
	}

	.a-agree-box:nth-child(2) {
		margin-left: -40rpx;
	}

	.a-sumbint {

		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 30rpx;
	}

	.sub-button {
		text-align: center;
		font-size: 36rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-right: 60rpx;
		background: linear-gradient(90deg, rgb(67, 103, 150) 0%, rgb(18, 150, 219) 100%);
		color: #fff;
		letter-spacing: 0.2rem;
		border-radius: 20rpx;
	}

	.ar_1 {
		text-align: center;
		font-size: 80rpx;
		color: #8a8a8a;
	}

	.ar_1 image {
		width: 600rpx;
	}

	.ar_3 {
		text-align: center;
		margin-bottom: 24rpx;
		color: #8a8a8a;
		letter-spacing: 4rpx;
	}
</style>