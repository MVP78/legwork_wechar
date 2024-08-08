<template>
	<view class="body">
		<view class="m-top">

		</view>
		<view class="top">
			<view class="login" v-if="isLogin">
				<view class="left">
					<image :src="userData.avatarUrl"></image>
				</view>
				<view class="m-center">
					<view class="message">
						{{userData.nickname}}
					</view>
					<view class="message" v-if="userData.userPhone">
						{{userData.userPhone}}
					</view>
				</view>
				<view class="right" @click="openPopup">
					<image src="../../static/my/bianji.png" mode=""></image>
				</view>
			</view>
			<view class="toLogin" v-else @click="wxLogin">
				<view class="weixin">
					<image src="../../static/my/weixin.png" mode=""></image>
				</view>
				<view class="text">
					点击登录
				</view>
			</view>

		</view>
		<view class="c-content">
			<uni-list>
				<view @click="chooseOrder()" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/my/dingdan.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">订单管理</text>
						</template>
					</uni-list-item>
				</view>
				<view @click="chooseReceiver(0)" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/my/shouhuoren.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">收货人管理</text>
						</template>
					</uni-list-item>
				</view>
				<view @click="chooseRider()" hover-class="navigator-hover">
					<uni-list-item showArrow>
						<template v-slot:header>
							<view class="slot-box">
								<image class="slot-image" src="../../static/my/qishou.png" mode="widthFix">
								</image>
							</view>
						</template>
						<template v-slot:body>
							<text class="slot-box slot-text">骑手中心</text>
						</template>
					</uni-list-item>
				</view>
				<view @click="" hover-class="navigator-hover">
					<button open-type="contact" plain="true" style="border:none;padding: 0;">
						<uni-list-item showArrow>
							<template v-slot:header>
								<view class="slot-box">
									<image class="slot-image" src="../../static/my/kefu.png" mode="widthFix">
									</image>
								</view>
							</template>
							<template v-slot:body>
								<text class="slot-box slot-text">联系客服</text>
							</template>
						</uni-list-item>
					</button>
				</view>
			</uni-list>
		</view>
		<!-- 弹窗 -->
		<uni-popup ref="editPopup">
			<view class="p-content">
				<view class="p-top">
					<view class="p-title">
						编辑个人信息
					</view>
					<view class="p-close" @click="closePopup">
						<uni-icons type="close" size="30"></uni-icons>
					</view>
				</view>
				<view class="form">
					<uni-forms ref="form" :rules="rules" :modelValue="formData">
						<uni-forms-item name="nickname" label="用户名:">
							<uni-easyinput :inputBorder="false" :clearable="false" type="text"
								v-model="formData.nickname" placeholder="请输入用户名" />
						</uni-forms-item>
						<uni-forms-item name="userPhone" label="电话:">
							<uni-easyinput :inputBorder="false" :clearable="false" type="text"
								v-model="formData.userPhone" placeholder="请输入电话" />
						</uni-forms-item>
						<uni-forms-item label="头像:">
							<view class="uimg" e v-if="formData.avatarUrl">
								<image :src="formData.avatarUrl"></image>
								<view class="clear-button" @tap="clearImage">
									<uni-icons type="closeempty" size="30"></uni-icons>
								</view>
							</view>
							<view class="uimg" v-else @tap="chooseImage">
								+
							</view>
						</uni-forms-item>

					</uni-forms>
				</view>
				<view class="sub-button" @click="submit()">
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
				isLogin: false,
				userId: null,
				userData: {
					userId: '123',
					nickname: '方杰锋',
					userPhone: '15521917952',
				},
				formData: {
					userId: '',
					nickname: '',
					userPhone: '',
					avatarUrl: null,
				},
				rules: {
					nickname: {
						rules: [{
							required: true,
							errorMessage: '请填写姓名',
						}]
					},
					userPhone: {
						rules: [{
							format: 'number',
							errorMessage: '请输入数字'
						}, ]
					},
				},
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync('isLogin')
			if (this.isLogin) {
				this.userId = uni.getStorageSync('userId')
				this.userData = uni.getStorageSync('userData')
			}

		},
		methods: {
			//点击登录
			wxLogin() {
				let _this = this
				// this.isLogin = true
				uni.login({
					provider: 'weixin', //使用微信登录
					success: function(loginRes) {
						console.log(loginRes);
						_this.toLogin(loginRes.code)
					}
				});
			},
			//登录
			async toLogin(code) {
				let _this = this
				const response = await api.login({
					appid: 'wxe89b4fbdb57c4d9d',
					code: code
				})
				//已登录过
				if (response[1].data.code === 200) {
					console.log(response[1].data.data);
					uni.setStorageSync('token', response[1].data.data.token);
					//获取用户信息
					uni.setStorageSync('userId', response[1].data.data.user.userId)
					this.userData = response[1].data.data.user
					uni.setStorageSync('userData', response[1].data.data.user)
					this.isLogin = true
					uni.setStorageSync('isLogin', true)
					//弹窗
					uni.showToast({
						title: '登录成功',
						duration: 1000,
						icon: 'true',
					});
				} else {
					//未登录过
					uni.showModal({
						title: '授权',
						content: '您确定授权登录该小程序吗？',
						success: (res) => {
							if (res.confirm) {
								uni.setStorageSync('token', response[1].data.data.token);
								//wx获取用户信息接口
								uni.getUserInfo({
									provider: 'weixin',
									success: function(infoRes) {
										//授权
										console.log(infoRes)
										_this.auth(infoRes.userInfo)
									}
								});
							}
						},
					});
				}
			},
			//授权
			async auth(userInfo) {
				const res = await api.postAuth({
					avatarUrl: "http://localhost:8080/lwUser/file/download/f5a6e6f1-b.png",
					nickname: userInfo.nickName
				})
				if (res.data.code === 200) {
					//用户id存入本地
					uni.setStorageSync('userId', res.data.data.userId)
					uni.setStorageSync('isLogin', true)
					this.getUserinfo()
				}
			},
			//获取用户信息
			async getUserinfo() {
				const res = await api.getUserinfo(this.userId)
				if (res[1].data.code === 200) {
					this.userData = res[1].data.data
					//存入本地
					uni.setStorageSync('userData', res[1].data.data)
				}
			},
			submit() {
				// 进行校验
				this.$refs.form.validate().then(item => {
					this.updateUser()
				})

			},
			// 修改信息
			async updateUser(_this) {
				console.log('111111111');
				const res = await api.updateUser(this.formData)
				if (res[1].data.code === 200) {
					this.$refs.editPopup.close()
					//弹窗
					uni.showToast({
						title: '修改成功',
						duration: 1000,
						icon: 'true',
					});
					this.getUserinfo()
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
			//上传图片
			async uploadImage(filePath) {
				const res = await api.uploadImage(filePath)
				if (res.statusCode === 200) {
					let temp = JSON.parse(res.data);
					this.formData.avatarUrl = temp.data.url
				}
			},
			//清除图片
			clearImage() {
				this.formData.avatarUrl = null;
			},
			openPopup() {
				this.formData = uni.getStorageSync('userData')
				this.$refs.editPopup.open()
			},
			closePopup() {
				this.$refs.editPopup.close()
			},
			//打开订单
			chooseOrder() {
				if (this.isLogin === true) {
					uni.navigateTo({
						url: '/pages/order_list/order_list'
					})
				} else {
					uni.showToast({
						title: '请先登录',
						duration: 1000,
						icon: 'error',
					});
				}

			},
			//打开收货人管理
			chooseReceiver(entryState) {
				if (this.isLogin === true) {
					uni.setStorageSync('entryState', entryState)
					uni.navigateTo({
						url: '/pages/receiver/receiver',
					});
				} else {
					uni.showToast({
						title: '请先登录',
						duration: 1000,
						icon: 'error',
					});
				}

			},
			//打开骑手中心
			chooseRider() {
				if (this.isLogin === true) {
					this.getRiderData()
				} else {
					uni.showToast({
						title: '请先登录',
						duration: 1000,
						icon: 'error',
					});
				}
			}
		}
	}
</script>

<style>
	.m-top {
		height: 60rpx;
		background-color: #fff;
	}

	.top {
		margin: 30rpx 20rpx;
		padding: 30rpx 60rpx;
		border-radius: 16rpx;
		background-color: #fff;
		box-shadow: 5rpx 5rpx 10rpx #9bcddb;
	}

	.login {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.left image {
		width: 150rpx;
		height: 150rpx;
	}

	.m-center {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 240rpx;
		height: 200rpx;
		font-size: 36rpx;
	}

	.message {
		width: 240rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-weight: 700;
		color: #175373;
	}

	.right image {
		width: 80rpx;
		height: 80rpx;
	}

	.toLogin {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1296db;

		border-radius: 60rpx;

	}

	.weixin image {
		width: 100rpx;
		height: 100rpx;
	}

	.text {
		margin-left: 10rpx;
		color: #fff;
		font-size: 36rpx;
		letter-spacing: 0.5rem;
	}

	.c-content {
		margin: 60rpx 20rpx;
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

	.p-content {
		width: 600rpx;
		height: 740rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.uni-forms-item {
		border-bottom: 1rpx solid #000;
	}

	.uni-forms-item:nth-child(3) {
		border-bottom: 0;
	}

	.p-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 30rpx;
	}

	.p-title {
		font-size: 36rpx;
	}

	.form {
		padding: 0 60rpx;
	}

	.uimg {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		line-height: 200rpx;
		text-align: center;
		border-radius: 10rpx;
		border: 1px solid #8a8a8a;
		font-size: 100rpx;
		color: #8a8a8a;
	}

	.uimg image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
	}

	.clear-button {
		position: absolute;
		right: -34px;
		top: -46px;
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
</style>