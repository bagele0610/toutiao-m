<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  // 自定义v-model的数据名称
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed'// 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onFollow () {
      this.loading = true // 展示关注按钮的loading状态
      try {
        if (this.isFollowed) {
          // 已关注,就取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注，就关注用户
          await addFollow(this.userId)
        }
        // this.isFollowed = !this.isFollowed;
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false // 展示关注按钮的loading状态
    }
  }
}
</script>

<style scoped lang='less'></style>
