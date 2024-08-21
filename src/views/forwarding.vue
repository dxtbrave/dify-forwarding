<template>
  <div></div>
</template>

<script>
export default {
  name: "forwarding",
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
      localStorage.setItem(queryParams.loginParams, loginValue)
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
