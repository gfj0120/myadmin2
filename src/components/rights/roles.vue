<template>
  <div class="roles">
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-button @click="showAdd" plain type="success" class="addRoles">添加角色</el-button>
    <!-- 主体表格 -->
    <el-table :data="rolesList">
      <el-table-column  type="expand">
         <!-- 这里的row是角色信息的每一项, -->
               <!-- row 是一条遍历的数据, 就是一个角色, row.children是全部的一级权限数组 -->
        <template v-slot:default="{row}">
          <el-row v-for="l1 in row.children" :key="l1.id" class="f1">
            <el-col :span="4"><el-tag closable @close="delRight(row, l1.id)">{{ l1.authName }}</el-tag> <i class="el-icon-arrow-right"></i></el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key="l2.id" class="f2">
                <el-col :span="4"><el-tag type="success" closable @close="delRight(row, l2.id)">{{ l2.authName }}</el-tag> <i class="el-icon-arrow-right"></i></el-col>
                <el-col :span="20"><el-tag type="warning"  closable @close="delRight(row, l3.id)" v-for="l3 in l2.children" :key="l3.id" class="f3">{{ l3.authName }}</el-tag></el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
         <template v-slot:default="{ row }">
         <el-button @click="showEdit(row)" plain size="small" type="primary" icon="el-icon-edit"></el-button>
         <el-button @click="delRoles(row.id)" plain size="small" type="danger" icon="el-icon-delete"></el-button>
         <el-button @click="showAuthorityDialog(row)" plain size="small" type="success" icon="el-icon-check">分配权限</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户 -->
    <el-dialog
    @closed="closeDialog"
      title="添加角色"
      :visible.sync="dialogVisible"
      width="40%"
      >
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item  label="角色名称" prop="roleName">
          <el-input  placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item  label="描述" prop="roleDesc">
          <el-input  placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改角色"
      :visible.sync="dialogChange"
      width="40%">
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px">
        <el-form-item  label="角色名称" prop="roleName">
          <el-input  placeholder="请输入角色名称" v-model="changeForm.roleName"></el-input>
        </el-form-item>
        <el-form-item  label="描述" prop="roleDesc">
          <el-input  placeholder="请输入角色描述" v-model="changeForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChange = false">取 消</el-button>
        <el-button type="primary" @click="changeRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
       title="分配权限"
       :visible.sync="authorityDialog"
       width="30%">
       <el-tree
       ref="tree"
       node-key = "id"
       show-checkbox
       default-expand-all
       :data="data"
       :props="defaultProps"></el-tree>
       <span slot="footer" class="dialog-footer">
         <el-button @click="authorityDialog = false">取 消</el-button>
         <el-button @click="addAllocation" type="primary">分配</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['change', 'blur'] }
        ]
      },
      dialogChange: false,
      changeForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      authorityDialog: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 配置的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      try {
        const { data, meta } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.rolesList = data
          console.log(this.rolesList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delRight (row, rightId) {
      // console.log(roleId, rightId)
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)

      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    async delRoles (id) {
      try {
        await this.$confirm('你确定要删除该角色吗', '温馨提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message('取消删除')
      }
    },
    // 添加框显示
    showAdd () {
      this.dialogVisible = true
    },
    // 添加角色
    async  addRoles () {
      try {
        await this.$refs.form.validate()
        // console.log('校验通过')
        const { meta } = await this.$axios.post('roles', this.form)
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getRolesList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 修改框出现
    showEdit (row) {
      this.dialogChange = true
      this.changeForm.id = row.id
      this.changeForm.roleName = row.roleName
      this.changeForm.roleDesc = row.roleDesc
    },
    // 修改
    async  changeRoles () {
      try {
        await this.$refs.changeForm.validate()
        const { id, roleName, roleDesc } = this.changeForm
        console.log('校验通过')
        const { meta } = await this.$axios.put(`roles/${id}`, { roleName, roleDesc })
        // console.log(res)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.dialogChange = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分配权限展示框,发送ajax,权限回显,三级的渲染,拿到选中半选的id,点击分配,拿到需要的参数发送ajax,渲染数据
    async  showAuthorityDialog (row) {
      this.roleId = row.id
      console.log(this.roleId)
      this.authorityDialog = true
      // 打开页面发送ajax请求,拿到需要数据
      const { data, meta } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // this.$refs.tree.setCheckedKeys([101])
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
              // console.log(ids)
            })
          })
        })
        // 权限的回显
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击分配权限
    async addAllocation () {
      const id = this.$refs.tree.getCheckedKeys() // 全选
      const ids = this.$refs.tree.getHalfCheckedKeys() // 半选
      // console.log(id, ids)
      const rids = [...id, ...ids].join(',')
      console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.authorityDialog = false
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
   .roles {
     .f1{
       padding-bottom: 5px;
       margin-bottom: 5px;
       border-bottom: 1px solid slategrey;
     }
     .f2 {
       margin-bottom: 5px;
     }
     .f3 {
       margin-right: 5px;
       margin-bottom: 5px;
     }
     .addRoles {
       margin-bottom: 10px;
     }
   }
</style>
