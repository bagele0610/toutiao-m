// postcss.config.js
module.exports = {
  plugins: {
    /* 配置使用autoprofixer插件
    作用：生成浏览器CS样式规则前缀

    VueCli内部已经配置了autoprefixer插件
    所以又配置了一次，从而产生冲突爆红
     */
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    /* 配置使用postcss-pxtorem插件
    作用：把px转为rem
    */
    'postcss-pxtorem': {
      /*
      lib-flexible的 REM适配方案 把一行分为10份

      所以rootValue应该设置为你的设计稿宽度的十分之一

      设计稿是750，所以应该设为750/10=75

      但是Vant建议设置为37.5.为什么、因为Vant是基于375写的

      所以必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须/2

      更好的办法是
      如果是Vant的样式，就按照37.5来转换
      如果是自己的样式，按照75来转换

      通过查阅文档，发现rootValue支持两种类型：
      数字：固定的数值
      函数：可以动态处理返回
          postcss-pxtorem处理每个CSS文件的时候都会来调用这个函数，它会把处理的CS文件相关的信息通过参数传递给该函数

      */
      // rootValue: 37.5,
      rootValue ({ file }) {
        console.log('处理的CSS文件：' + file)
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      /*
      配置要转换的CSS属性
      表示所有
      */
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdon'
    }
  }
}
