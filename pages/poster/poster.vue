<template>
	<view class="body">
		<view class="poster">
			<image v-if="posterId === '1'" src="../../static/bigImg/yonghuzhinan.png" mode="widthFix"></image>
			<image v-if="posterId === '2'" src="../../static/bigImg/qishouzhinan.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				posterId: '',
			}
		},
		onShow() {
			this.posterId = uni.getStorageSync('posterId')
		},
		methods: {

		}
	}
</script>

<style>
	.poster image {
		width: 100%;
	}
</style>