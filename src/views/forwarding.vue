<template>
  <div></div>
</template>

<script>
import {decryptAES} from "@/utils";

export default {
  name: "forwarding",
  data() {
    return {
      difyLoginKey: 'console_token',
      difyConversationIdInfo: 'conversationIdInfo',
      difyToken: 'token'
    }
  },
  methods: {
    // 处理token相关对象
    handleToken(tokenValue, code, isClear) {
      let currentTokenObj = {}
      // 最终设置的token对象
      let finalTokenObj = {}
      try {
        currentTokenObj = JSON.parse(localStorage.getItem(this.difyToken))
      } catch (e) {
      }
      // 获取当前域名的本地存储是否有token对象
      if (currentTokenObj && Object.keys(currentTokenObj).length > 0) {
        finalTokenObj = {...currentTokenObj}
      }
      // 判断是否为清除操作
      if (isClear) {
        delete finalTokenObj[code]
      } else {
        finalTokenObj[code] = tokenValue
      }
      localStorage.setItem(this.difyToken, JSON.stringify(finalTokenObj))
    },
    // 处理当前会话记录Id相关
    handleConversationIdInfo(val, id, isClear) {
      let currentConversationIdInfo = {}
      let finalConversationIdInfo = {}
      try {
        currentConversationIdInfo = JSON.parse(localStorage.getItem(this.difyConversationIdInfo))
      } catch (e) {
      }
      if (currentConversationIdInfo && Object.keys(currentConversationIdInfo).length > 0) {
        finalConversationIdInfo = {...currentConversationIdInfo}
      }
      // 判断是否为清除操作
      if (isClear) {
        finalConversationIdInfo[id] = ''
      } else {
        finalConversationIdInfo[id] = val
      }
      localStorage.setItem(this.difyConversationIdInfo, JSON.stringify(finalConversationIdInfo))
    },
    // 处理父页面消息
    handleResolve(e) {
      const {data} = e
      // 若未传postType，则无需处理
      if (!data.postType) return
      switch (data.postType) {
          // 接收应用会话选中记录
        case 'sendConversationIdInfo':
          const {conversationIdInfo} = data
          localStorage.setItem(this.difyConversationIdInfo, conversationIdInfo)
          window.parent.postMessage({
            postType: 'setConversationIdInfoOver',
            message: 'conversationIdInfo已设置！'
          }, '*')
          break;
          // 接收应用会话对象
        case 'sendToken':
          const {token} = data
          localStorage.setItem(this.difyToken, token)
          window.parent.postMessage({
            postType: 'setTokenOver',
            message: 'token已设置！'
          }, '*')
          break;
          // 接收consoleToken
        case 'sendConsoleToken':
          const {consoleToken} = data
          localStorage.setItem(this.difyLoginKey, consoleToken)
          window.parent.postMessage({
            postType: 'setConsoleTokenOver',
            message: 'consoleToken已设置！'
          })
          break
          // 跳转
        case 'jump':
          window.parent.postMessage({
            postType: 'startJump',
            message: '即将跳转'
          }, '*')
          // 解除监听
          window.removeEventListener('message', this.handleResolve)
          this.handleForwarding()
          break;
      }
    },
    // 处理正确地址
    handleTargetUrl(url) {
      let newUrl = url;
      // 使用正则表达式匹配所有的 _SLASH_ 并替换为 /#/
      newUrl = newUrl.replace(/_SLASH_/g, '/#/');
      // 使用正则表达式匹配所有的 _AND_ 并替换为 &
      newUrl = newUrl.replace(/_AND_/g, '&');
      // 使用正则表达式匹配所有的 _QUESTION_ 并替换为 ?
      newUrl = newUrl.replace(/_QUESTION_/g, '?');
      return newUrl;
    },
    // 得到正确符号
    restorePlusSigns(inputString) {
      // 使用正则表达式匹配所有的 _PLUS_ 并替换为 +
      return inputString.replace(/_PLUS_/g, '+');
    },
    // 处理转发
    handleForwarding() {
      const queryParams = this.$route.query
      // 判断是否存在登录参数
      if (!queryParams.loginParams) return
      const loginKey = queryParams.loginParams
      if (!queryParams[loginKey]) return
      const loginValue = queryParams[loginKey]
      // 不存在目标地址
      if (!queryParams.path) return
      let targetPath = queryParams.path
      try {
        targetPath = decodeURIComponent(queryParams.path)
      } catch (e) {
      }
      localStorage.setItem(this.difyLoginKey, loginValue)
      // 判断是否传入应用所需Token、应用Code
      if (queryParams.appCode) {
        if (queryParams.appToken) {
          this.handleToken(queryParams.appToken, queryParams.appCode, false)
        } else {
          this.handleToken('', queryParams.appCode, true)
        }
      }
      // 判断是否传入应用会话记录Id、应用id
      if (queryParams.appRelateId) {
        if (queryParams.conversationId) {
          this.handleConversationIdInfo(queryParams.conversationId, queryParams.appRelateId, false)
        } else {
          this.handleConversationIdInfo(queryParams.conversationId, queryParams.appRelateId, true)
        }
      }
      targetPath = decryptAES(this.restorePlusSigns(targetPath))
      targetPath = this.handleTargetUrl(targetPath)
      window.location.href = targetPath
    },
    // 初始化
    init() {
      const isIframe = window.top !== window
      const isAfterJump = this.$route.query.isAfterJump
      // 查看是否稍后跳转
      if (!isAfterJump) {
        this.handleForwarding()
      } else {
        // 加载至iframe中
        if (isIframe) {
          // 向父页面发送消息
          window.parent.postMessage({
            postType: 'forwardMounted',
            message: '跳板系统已加载完成！',
            token: localStorage.getItem(this.difyToken) ?? "",
            conversationIdInfo: localStorage.getItem(this.difyConversationIdInfo) ?? ""
          }, '*')
          window.addEventListener('message', this.handleResolve)
        }
      }
    }
  }
  ,
  mounted() {
    this.init()
  }
}
</script>

<style scoped lang="less">

</style>
