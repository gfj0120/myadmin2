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
           <!-- <el-menu>整个包裹着全部 -->
                <!-- <el-submenu> 导航一 -->
                   <!-- <el-menu-item-group> 导航下面的分组 -->
                      <!-- <el-menu-item 导航下面的分组下面的选项 -->
          <el-menu
          unique-opened
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
      </el-submenu>
      <!-- 第二部分 -->
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="2-1">
            <i class="el-icon-menu"></i>
            <span slot="title">权限列表</span>
          </el-menu-item>
          <el-menu-item index="2-2">
            <i class="el-icon-menu"></i>
            <span slot="title">角色列表</span>
          </el-menu-item>
      </el-submenu>
    </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>

</template>

<script>
// 退出的点击事件,logout 点击退出的时候,弹出框,点击确认的时候,移除本地的令牌数据,并且调到登录页面
export default {
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
  }
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
