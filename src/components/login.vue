<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form"  label-width="80px" class="demo-ruleForm">
      <img src="../assets/f8.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input  @keyup.enter.native="login" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''

      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        console.log('校验通过了,发送请求')
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          localStorage.setItem('token', data.token)
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$refs.form.validate(isvalid => {
      //   // 校验失败直接return
      //   if (!isvalid) return
      //   // 校验成功,发送ajax请求,根据后台数据再进行判断用户名
      //   this.$axios.post('login', this.form).then(res => {
      //     // console.log(res.data)
      //     const { meta, data } = res
      //     if (meta.status === 200) {
      //       this.$message({
      //         message: meta.msg,
      //         type: 'success'
      //       })
      //       localStorage.setItem('token', data.token)
      //       this.$router.push({ name: 'index' })
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
      // })
    }
  }
}
</script>

<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    background-color: #2d434c;
    overflow: hidden;
      .el-form {
        position: relative;
        width: 400px;
        border-radius: 20px;
        background-color: #fff;
        padding: 25px;
        padding-top: 75px;
        margin: 0 auto;
        margin-top: 200px;
          .loginBtn {
            margin-right: 70px;
          }
          img {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -50px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 5px solid #fff;
          }
      }
  }
</style>
