<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
  html, body, #app {
    width: 100%;
    height: 100%;

  }
  #app {
    .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid slategrey;
    margin-bottom: 10px;
  }
  }
</style>
