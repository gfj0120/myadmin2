<template>
  <div class="rights">
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体表格 -->
    <el-table :data="rightsList">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{ row }">
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">er级</p>
          <p v-if="row.level === '2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    const { data } = await this.$axios.get('rights/list')
    this.rightsList = data
    console.log(this.rightsList)
  }
}
</script>

<style>

</style>
