<template>
  <div class="container">
    <div class="login-card">
      <div class="logo">
        <i class="iconfont icon-logo"></i>
      </div>
      <div class="login-from">
        <div class="welcome-text">欢迎登陆Trunkverse</div>
        <el-form
          ref="userLogin"
          :model="loginForm"
          :rules="rules"
          style="max-width: 460px"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              :suffix-icon="User"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              :suffix-icon="Lock"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-button class="login-button" @click="submitUserInfo(userLogin)"
            >登陆</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import axios from "@/request";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { userType } from '@/router';

const store = useStore();
const router = useRouter();

const nameRegex = new RegExp("^[A-Za-z0-9_@.]{3,20}$");
const userLogin = ref(null);

const loginForm = reactive({
  username: "root",
  password: "12345",
});
const validateUsername = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else if (!nameRegex.test(value)) {
    callback(new Error("输入账号不符合规范"));
  } else {
    callback();
  }
};
const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const rules = reactive({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});
const submitUserInfo = (fromValue) => {
  if (!fromValue) return;
  fromValue.validate((valid) => {
    if (valid) {
      axios
        .post("/login", {
          username: loginForm.username,
          password: loginForm.password,
        })
        .then((res) => {
          if (res.code === 200) {
            const token = res.access_token;
            localStorage.setItem("token", token);
            if (loginForm.username === 'root') {
              store.commit('SAVE_MENU_LIST', userType['root']);
              localStorage.setItem('menuList', JSON.stringify(userType['root']));
            }
            else {
              store.commit('SAVE_MENU_LIST', userType['other']);
              localStorage.setItem('menuList', JSON.stringify(userType['other']));
            }
            router.push("/");
          }
        })
        .catch((error) => {
          console.error(error.msg);
        });
    } else {
      return false;
    }
  });
};
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  background: #e9f6ff url("@/assets/img/logo_bg.png") no-repeat;
  background-size: 100% 100%;

  .login-card {
    width: 600px;
    height: 100%;
    background: rgba(241, 248, 255, 0.92);
    box-shadow: 0px 2px 18px 8px rgba(151, 191, 208, 0.5);
    border-radius: 24px;
    position: relative;
    overflow: hidden;

    .logo {
      margin-top: 35px;
      margin-left: 38px;
      color: #092b6f;
      i {
        font-size: 24px;
      }
    }

    .login-from {
      width: 360px;
      height: 320px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .welcome-text {
        width: 100%;
        height: 48px;
        font-size: 30px;
        font-weight: bold;
        color: #092b6f;
        line-height: 24px;
        text-align: center;
        margin-bottom: 26px;
      }

      :deep(.el-form) {
        .el-form-item {
          flex-direction: column;
          margin-bottom: 20px;
          .el-form-item__label {
            color: #092b6f;
            font-size: 16px;
            text-align: left;
            line-height: 24px;
            margin-bottom: 8px;
          }
          .el-form-item__content {
            width: 360px;
            height: 40px;
            border-radius: 4px;
            .el-input__inner {
              box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4) inset;
              &:focus {
                box-shadow: 0 0 0 1px #092b6f inset;
              }
            }
            .el-input__icon {
              svg {
                color: rgba(0, 0, 0, 0.4);
              }
            }
            .el-form-item__error {
              margin-top: 2px;
            }
          }
        }
        .login-button {
          width: 100%;
          height: 40px;
          background: #5098ff;
          border-radius: 8px;
          color: #fff;
          margin-top: 38px;
          font-size: 16px;
          line-height: 24px;
        }
        .login-button:hover {
          transform: scale(1.01);
        }
      }
      :deep(.el-form-item.is-error) {
        .el-form-item__content {
          .el-input__inner {
            box-shadow: 0 0 0 1px #f56c6c inset;
          }
        }
      }
    }
  }
}
</style>