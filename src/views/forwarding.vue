<template>
  <div></div>
</template>

<script>
export default {
  name: "forwarding",
  data(){
    return {
      difyLoginKey: 'console_token',
      difyConversationIdInfo: 'conversationIdInfo',
      difyToken: 'token'
    }
  },
  methods: {
    // 处理转发
    handleForwarding(){
      const queryParams = this.$route.query
      // 判断是否存在登录参数
      if(!queryParams.loginParams) return
      const loginKey = queryParams.loginParams
      if(!queryParams[loginKey]) return
      const loginValue = queryParams[loginKey]
      // 不存在目标地址
      if(!queryParams.path) return
      // 判断是否存在应用会话选中记录
      if(queryParams[this.difyConversationIdInfo]){
        localStorage.setItem(this.difyConversationIdInfo, decodeURI(queryParams[this.difyConversationIdInfo]))
      }
      // 判断是否存在应用会话对象
      if(queryParams[this.difyToken]){
        localStorage.setItem(this.difyToken, decodeURI(queryParams[this.difyToken]))
      }
      localStorage.setItem(this.difyLoginKey, loginValue)
      window.location.href = decodeURIComponent(queryParams.path)
    }
  },
  mounted() {
    this.handleForwarding()
  }
}
</script>

<style scoped lang="less">

</style>
