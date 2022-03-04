<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        class="edit-btn"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in MyChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          name="clear"
          slot="icon"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        class="grid-item"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'

import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    MyChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async onAddChannel (channel) {
      this.MyChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 一登陆,把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.MyChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败,请稍后重试')
        }
      } else {
        // 未登录,把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.MyChannels)
      }
    },
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onMyChannelClick (channel, index) {
      // 编辑状态，执行删除频道
      if (this.isEdit) {
        if (this.fiexChannels.includes(channel.id)) {
          return
        }

        // 删除频道项
        this.MyChannels.splice(index, 1)

        if (index <= this.active) {
          // 让激活频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }

        // 处理持久化
        console.log(this.MyChannels)
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登陆，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，更新到本地
          setItem('TOUTIAO_CHANNELS', this.MyChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // 数组的filter方法：遍历数组，把符合条件的元素存储到新数组中
      return this.allChannels.filter((channel) => {
        // const channels=[]

        // 数组的find方法:遍历数组，把符合条件的第一个元素返回
        return !this.MyChannels.find(
          (myChannel) => myChannel.id === channel.id
        )
      })
    }
    // recommendChannels() {
    //   const channels = [];
    //   this.allChannels.forEach((channel) => {
    //     const ret = this.MyChannels.find((myChannel) => {
    //       return myChannel.id === channel.id;
    //     });
    //     if (!ret) {
    //       channels.push(channel);
    //     }
    //   });
    //   return channels;
    // },
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
