<template>
  <div class="users">
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
       <el-table-column

        label="用户状态">
        <template v-slot:default="obj">

        <el-switch
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column

        label="操作">
         <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
         <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
         <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
// 进入到页面就应该是先发送请求渲染数据,在初始化时就可以请求了
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      userList: []
    }
  },
  created () {
    this.getUseList()
  },
  methods: {
    getUseList () {
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: { 'Authorization': localStorage.getItem('token') }
      }).then(res => {
        console.log(res.data)
        const { data, meta } = res.data
        if (meta.status === 200) {
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
