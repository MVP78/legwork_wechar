import http from './request.js'

export default {
	//小程序用户
	login(params) {
		return http.post('/lwUser/login', params)
	},
	postAuth(params) {
		return http.post('/lwUser/postAuth', params, true)
	},
	getUserinfo(params) {
		return http.get(`/lwUser/selectUserByUserId/${params}`, {})
	},
	updateUser(params) {
		return http.post('/lwUser/updateUserInfo', params)
	},
	//上传图片
	uploadImage(filePath) {
		return http.uploadImage('/lwUser/file/upload', filePath, 'image', {})
	},
	//收货人
	getReceiverList(params) {
		return http.get(`/receiver/list`, params)
	},
	getReceiverById(params) {
		return http.get(`/receiver/${params}`, {})
	},
	updateReceiver(params) {
		return http.put(`/receiver/updateLwReceiver`, params)
	},
	addReceiver(params) {
		return http.post(`/receiver/add`, params)
	},
	delReceiver(params) {
		return http.put(`/receiver/deleteLwReceiver`, params)
	},
	//代拿
	// 获取快递标准
	getChargesList(params) {
		return http.get(`/charges/charges/wxChargesList`, params)
	},
	// 新增订单
	addOrder(params) {
		return http.post(`/system/order/add`, params)
	},

	// 骑手
	// 获取骑手信息
	getRiderData(params) {
		return http.get(`/rider/rider/getInfoByUserId/${params}`, {})
	},
	// 申请骑手
	applyRider(params) {
		return http.post(`/rider/rider/add`, params)
	},
	//重新申请
	reapplyRider(params) {
		return http.put(`/rider/rider/updateRider`, params)
	},

	//提现
	withdrawal(params) {
		return http.post(`/withdrawal/withdrawal/withdrawal`, params)
	},
	//获取提现信息表
	getWithdrawalList(params) {
		return http.get(`/withdrawal/withdrawal/wxList`, params)
	},

	// 订单
	//获取我发出的列表
	getOrderList(params) {
		return http.get(`/system/order/wxOrderList`, params)
	},
	// 修改订单
	updateOrder(params) {
		return http.put(`/system/order/updateOrder`, params)
	},
	// 确认收货
	confirmOrder(params) {
		return http.put(`/system/order/confirmOrder`, params)
	},
	// 评价订单
	evaluateOrder(params) {
		return http.put(`/system/order/evaluateOrder`, params)
	},
	// 获取订单详情
	getOrderById(params) {
		return http.get(`/system/order/selectOrder/${params}`, {})
	},

}