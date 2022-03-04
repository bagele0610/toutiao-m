<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-duration="1500"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
      <ArticleItem v-for="(article, index) in list"
          :key="index" :article="article"/>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), //
          with_top: 1
        })
        // 模拟失败情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("asdsad");
        // }
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符(...)，他会把数组元素一个一个拿出来例:results[0],results[1],results[2]
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true，不在load加载更多
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 请求失败，loading也需要关闭
        this.loading = false
      }
    },
    // 当下啦刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 // 是否包含指定，进入页面第一次请求时要包含置顶文章，0否，1是
        })
        // 模拟失败情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("asdsad");
        // }
        // 2将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...data.data.results)

        // 3关闭下拉刷新的loading状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
