<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button @click="serachUser" slot="append" icon="el-icon-search"></el-button>
  </el-input>
    <el-button @click="showAdd" plain type="success" class="addUser">添加用户</el-button>
    <!-- 表格渲染 -->
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
        @change="changeStart(obj.row)"
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column

        label="操作">
        <template v-slot:default="obj">
         <el-button @click="showChange(obj.row)" plain size="small" type="primary" icon="el-icon-edit"></el-button>
         <el-button @click="delUser(obj.row.id)" plain size="small" type="danger" icon="el-icon-delete"></el-button>
         <el-button @click="showRolesDialog(obj.row)" plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <!-- @size-change  每页多少条触发事件"
      @current-change 当前页触发事件
      :current-page 当前页
      :page-sizes 可供选择的, 每页多少条
      :page-size 当前页多少条
      layout 可变的控件
      :total 总条数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size=" pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加模态框 -->
    <el-dialog
    status-icon
      @closed="closeDialog"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input  placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
           <el-input placeholder="请输入密码"  type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
           <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
           <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
 <!-- 修改模态框 -->
    <el-dialog
    status-icon
      title="修改用户"
      :visible.sync="dialogChange"
      width="40%">
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px">
        <!-- pro去掉*就没了 -->
        <el-form-item label="用户名">
          <el-tag type="info">{{ changeForm.username }}</el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
           <el-input v-model="changeForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
           <el-input v-model="changeForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChange = false">取 消</el-button>
        <el-button type="primary" @click="changeUser">确 定</el-button>
      </span>
    </el-dialog>

  <!-- 分配角色对话框 -->

<el-dialog
  title="分配角色"
  :visible.sync="rolesDialog"
  width="30%">
 <el-form :model="rlesForm" label-width="80px">
   <el-form-item label="用户名">
      <el-tag type="info">{{ rlesForm.username }}</el-tag>
    </el-form-item>
    <el-form-item  label="角色列表">
      <el-select v-model="rlesForm.rid" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
  </el-select>
    </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesDialog = false">取 消</el-button>
    <el-button @click="assignRoles" type="primary">分配角色</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
// 进入到页面就应该是先发送请求渲染数据,在初始化时就可以请求了

export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]

      },
      dialogChange: false,
      changeForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rolesDialog: false,
      rlesForm: {
        username: '',
        id: '',
        rid: ''
      },
      options: []
    }
  },
  created () {
    this.getUseList()
  },
  methods: {
    async getUseList () {
      try {
        const { data, meta } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.total = data.total
          // console.log(this.total)
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$axios.get('users', {
      //   params: {
      //     query: this.query,
      //     pagenum: this.pagenum,
      //     pagesize: this.pagesize
      //   }

      // }).then(res => {
      //   // console.log(res.data)
      //   const { data, meta } = res
      //   if (meta.status === 200) {
      //     this.total = data.total
      //     // console.log(this.total)
      //     this.userList = data.users
      //     console.log(this.userList)
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },
    handleSizeChange (val) {
      // console.log(val)
      this.pagesize = val
      this.pagenum = 1
      this.getUseList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUseList()
    },
    // 删除
    async delUser (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {

          type: 'warning'
        })
        console.log('点了取消')
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUseList()
        } else {
          this.$message.error('meta.msg')
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 搜索
    serachUser () {
      this.pagenum = 1
      this.getUseList()
    },
    // 修改状态
    async changeStart (row) {
      // console.log(flag)
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        // console.log(res)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAdd () {
      this.dialogVisible = true
    },
    // 添加用户
    async addUser () {
      // 先校验,校验通过再添加
      try {
        await this.$refs.form.validate()
        console.log('校验通过')
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 调到最后一页展示新加的数据
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUseList()
          this.dialogVisible = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    showChange (row) {
      this.dialogChange = true
      // console.log(row)
      this.changeForm.id = row.id
      this.changeForm.username = row.username
      this.changeForm.email = row.email
      this.changeForm.mobile = row.mobile
    },
    async changeUser () {
      try {
        await this.$refs.changeForm.validate()
        // console.log('校验通过')
        // 拿到需要用的参数
        const { id, email, mobile } = this.changeForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        // console.log(res)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.dialogChange = false
          this.getUseList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {

      }
    },
    // 展现分配角色的对话框
    async showRolesDialog (row) {
      this.rolesDialog = true
      // console.log(row)
      this.rlesForm.username = row.username
      this.rlesForm.id = row.id
      // this.rlesForm.rid = row.rid
      // 进入页面就要回显,等到发送ajax拿到角色列表后虽然有角色id,但是并不是当前点击时,需要拿到的角色id,而是所有的角色id,进行model和options配置
      const res = await this.$axios.get(`users/${this.rlesForm.id}`)
      if (res.meta.status === 200) {
        // this.rlesForm.rid = res.data.rid
        const rid = res.data.rid
        this.rlesForm.rid = rid === -1 ? '' : rid
      }
      const { data, meta } = await this.$axios.get('roles')
      // console.log(res)
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击分配角色,发送ajax,渲染数据
    async  assignRoles () {
      const { id, rid } = this.rlesForm
      if (rid === '') {
        return
      }
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.rolesDialog = false
        this.getUseList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .el-pagination {
  margin-top: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;

  }
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid slategrey;
    margin-bottom: 10px;
  }
  .addUser {
     margin-left: 20px;
  }
}
</style>
