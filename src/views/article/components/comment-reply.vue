<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-warp">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />

      <!-- 评论回复列表 -->
      <van-cell title="全部回复" />
      <CommentList :list="CommentList" :source="comment.com_id" type="c" />
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button size="small" round @click="isPostShow = true" class="post-btn"
        >写评论</van-button
      >
    </div>

    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost @post-success="onPostSuccess" :target="comment.com_id" />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  components: { CommentItem, CommentList, CommentPost },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      CommentList: [] // 评论回复数据
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新的回复内容展示到列表的顶部
      this.CommentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang='less'>
.scroll-warp {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
