<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <span class="login-title">Login</span>
              <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="login-description">
                Please ensure you are not being watched or that only people who should have access to the account are present.
              </div>
              <div v-bind:class="{ 'seed-input-red': !isValid, 'seed-input-green': isValid }">
                <textarea class="form-control span6 prvKey" name="mnemonic" placeholder="Generate a new SEED with the button below" v-model="mnemonic" rows="3" />
              </div>
              <div class="generate-new">
                <a href=""><i class="fa fa-refresh"></i> Generate New SEED</a>
              </div>
              <div v-if=erroResponse class="text-red">
                <p>{{erroResponse}}</p>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-success btn-lg btn-block" type="submit" @click="signin">Continue to verification</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import gql from 'graphql-tag'
import {
  isEmpty
} from 'lodash'
import {
  computeAccessKey,
  isValid
} from '../../lib/credentials'
import {
  setCreds
} from '../../lib/vault'

export default {
  name: 'EntranceModal',
  data: function () {
    return {
      mnemonic: null,
      erroResponse: null
    }
  },
  methods: {
    close: function (event) {
      this.$emit('close');
    },
    signin: function (event) {
      // TODO:: toggle progress bar
      if (this.creds !== null) {
        // access query
        this.erroResponse = null;
        // if (!this.profile.traderId) {
        //   this.erroResponse = 'Unknown seed, please register or check your seed.';
        // } else {
          setCreds(this.creds);
          // workaround: update traderId explicility
          this.$parent.traderId = this.creds.traderId
          this.close();
        // }
      } else if (isEmpty(this.mnemonic)) {
        // empty phrase
        this.erroResponse = 'seed is empty';
      } else if (!isValid(this.mnemonic)) {
        // check phrase
        this.erroResponse = 'seed is not valid, seed must be 12 words.';
      }
    }
  },
  computed: {
    isValid: function () {
      return this.mnemonic && isValid(this.mnemonic.trim())
    },
    creds: function () {
      if (this.mnemonic && isValid(this.mnemonic.trim())) {
        return computeAccessKey(this.mnemonic.trim());
      } else {
        return null;
      }
    },
  },
  apollo: {
    profile: {
      query: function () {
        if (this.creds) {
          const traderId = this.creds.traderId;
          return gql`query {
          profile(traderId : "${traderId}") {
              traderId
          }}`;
        }
        return null;
      },
      variables() {
        return {
          creds: this.creds
        }
      },
      skip() {
        return this.creds === null;
      }
    },
  },
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 650px;
  height: 440px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-header {
  text-align: center;
}




/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}

.input-group input {
  height: 4em;
}

textarea {
  resize: none;
}

.seed-input-red textarea:focus{
  border-color: red;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.seed-input-green textarea:focus{
  border-color: #258C42;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6);
  outline: 0 none;
}

.login-title {
	color: #141414;
	font-family: "Open Sans";
	font-size: 18px;
	font-weight: 600;
	line-height: 24px;
	text-align: center;
}

.login-description {
  color: #141414;
	font-family: "Open Sans";
	font-size: 14px;
	line-height: 19px;
  margin: 15px 0 40px 0;
}

.generate-new {
  margin-top: 10px;
}
.generate-new a{
  color: #258C42;
}

</style>