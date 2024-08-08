import Vue from 'vue';
//全局配置
const http = {
	baseUrl: Vue.prototype.$baseUrl,
	//请求方法 config：配置对象	
	request(config) {
		config = beforeRequest(config)
		config.url = this.baseUrl + config.url
		return new Promise((resolve, reject) => {
			uni.request(config)
				.then(res => {
					// console.log(res)
					const response = beforeResponse(res)
					resolve(response)
				})
				.catch(err => {
					errorHandle(err)
					reject(err)
				})
		})
	},
	upload(config) {
		config = beforeRequest(config)
		config.url = this.baseUrl + config.url
		return new Promise((reslove, reject) => {
			uni.uploadFile({
				url: config.url,
				filePath: config.filePath,
				name: config.name,
				header: {
					'Content-Type': 'multipart/form-data',
				},
				formData: config.formData,
				success: (res) => {
					console.log(res);
					const response = beforeResponse(res)
					reslove(res)
				},
				fail: (err) => {
					console.error('上传失败', err);
					// 处理上传失败的逻辑
					reject(err)
				},
			});
		})
	},
	get(url, data, auth) {
		return this.request({
			url: url,
			data: data,
			auth: auth,
			method: 'GET'
		})
	},
	post(url, data, auth) {
		return this.request({
			url: url,
			data: data,
			auth: auth,
			method: 'POST'
		})
	},
	put(url, data, auth) {
		return this.request({
			url: url,
			data: data,
			auth: auth,
			method: 'PUT'
		})
	},
	delete(url, data, auth) {
		return this.request({
			url: url,
			data: data,
			auth: auth,
			method: 'DELETE'
		})
	},
	uploadImage(url, filePath, name, formData, auth) {
		return this.upload({
			url: url,
			filePath: filePath,
			name: name,
			formData: formData,
			auth: auth
		})
	},



}

//请求拦截器
const beforeRequest = (config) => {
	//请求之前需要的操作
	if (config.auth) {
		if (uni.getStorageSync('token')) {
			let token = uni.getStorageSync('token')
			config.header = {
				'Authorization': 'wx ' + token
			};
		} else {
			console.log('未登录，无访问权限')
			uni.switchTab({
				url: '/pages/my/my'
			})
		}
	}
	console.log('请求拦截器', config)
	return config
}

//响应拦截器
const beforeResponse = (response) => {
	console.log('响应拦截器', response)
	return response
}

//异常处理器
const errorHandle = (err) => {
	console.log('网络异常,请求失败', err)
}

export default http