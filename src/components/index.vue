<template>
    <el-container  class="index">
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="title"><h1>电商后台管理系统</h1></div>
        <div class="out"><strong>欢迎光临~~</strong>
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
           <!-- default-active="1" 高亮的提示 -->
           <!-- <el-menu>整个包裹着全部 -->
                <!-- <el-submenu> 导航一 -->
                   <!-- <el-menu-item-group> 导航下面的分组 -->
                      <!-- <el-menu-item 导航下面的分组下面的选项 -->
      <el-menu
      unique-opened
        router
      :default-active = "defaultActive"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu :index="menu.path" v-for="menu in userList" :key="menu.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ menu.authName }}</span>
        </template>
          <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.authName }}</span>
          </el-menu-item>
      </el-submenu>

    </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
// 退出的点击事件,logout 点击退出的时候,弹出框,点击确认的时候,移除本地的令牌数据,并且调到登录页面
export default {
  data () {
    return {
      userList: []
    }
  },
  // 进入页面发送请求,拿到侧边栏的数据,根据模板渲染,高亮,路径
  async created () {
    const { data, meta } = await this.$axios.get('menus')
    // console.log(res)
    if (meta.status === 200) {
      this.userList = data
      console.log(this.userList)
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logout () {
      this.$confirm('是否要退出', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message('取消退出')
      })
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  }
  // 一刷新高亮就没了,动态设置
}
</script>

<style lang="scss" scoped>
  .index {
    height: 100%;
    .el-header {
      background-color: #d8d8d8;
      display: flex;
      .logo {
        width: 200px;
        padding: 10px;
        img {
          width: 150px;
        }
      }
      .title {
        flex: 1;
        text-align: center;
        line-height: 60px;
      }
      .out {
        width: 200px;
        line-height: 60px;
        text-align: right;
        a {
          color: orange;
          font-weight: 700;
        }
      }
    }
    .el-aside {
      background-color: #545c64;
    }
    .el-main {
      background-color: #ecf0f1;
    }
  }
</style>
