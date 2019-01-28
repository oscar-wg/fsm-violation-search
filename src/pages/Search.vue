<template>
  <page-container centered :title="$t('pages.search.title')">
    <section class="page-container-section">
      <form novalidate class="md-layout" @submit.prevent="validateForm">
        <div class="md-layout-item md-size-25 md-small-hide">
        </div>
        <md-card class="md-layout-item md-size-50 md-small-size-100">
          <md-card-header>
            <div class="md-title">查詢</div>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('plateNumber')">
                  <label for="plate-number">車牌號碼</label>
                  <md-input name="plate-number" id="plate-number" autocomplete="given-name" v-model="form.plateNumber" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.plateNumber.required">Plate number is required</span>
                  <span class="md-error" v-else-if="!$v.form.plateNumber.minlength || !$v.form.plateNumber.maxlength">Invalid length</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('vin')">
                  <label for="vin">汽車識別代碼</label>
                  <md-input type="number" name="vin" id="vin" autocomplete="family-name" v-model="form.vin" :disabled="sending" maxlength="4" md-counter="false"/>
                  <span class="md-error" v-if="!$v.form.vin.required">VIN is required</span>
                  <span class="md-error" v-else-if="!$v.form.vin.minlength || !$v.form.vin.maxlength">Invalid length</span>
                </md-field>
              </div>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('category')">
                  <label for="category">車輛類型</label>
                  <md-select name="category" id="category" v-model="form.category" md-dense :disabled="sending">
                    <md-option value="C">摩托車</md-option>
                    <md-option value="L">汽車</md-option>
                  </md-select>
                  <span class="md-error">Category is required</span>
                </md-field>
              </div>
            </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button type="button" class="md-primary" v-if="jerkys.length > 0" @click="openLink('https://www.fsm.gov.mo/webticket/tq_c.aspx')">前往交局網站</md-button>
            <md-button type="submit" class="md-primary" :disabled="sending">查詢</md-button>
          </md-card-actions>
        </md-card>

        <md-snackbar :md-active.sync="result.notify">{{ result.msg }}</md-snackbar>
      </form>
      <div class="md-layout jerky-result">
        <template v-for="(j, index) in jerkys">
          <md-card :key="j.accusation_no" class="jerky-card md-primary md-layout-item md-size-30 md-medium-size-45 md-small-size-100">
            <md-card-header>
              <md-card-header-text>
                <div class="md-title">交通違例通知</div>
                <div class="md-subhead">控訴書編號: {{ j.accusation_no }}</div>
              </md-card-header-text>
              <md-card-media>
                <img :src="qrCodePath" alt="qrcode">
              </md-card-media>
            </md-card-header>

            <md-card-content class="md-layout jerky-card-detail">
              <div class="jerky-card-date md-layout-item md-size-50"><span>檢控日期</span><br>{{ j.datetime.substring(0, 4) }} / {{ j.datetime.substring(5, 7) }} / {{ j.datetime.substring(8, 10) }}</div>
              <div class="jerky-card-time md-layout-item md-size-25"><span>時間</span><br>{{ j.datetime.substring(11, 13) }} : {{ j.datetime.substring(14, 16) }}</div>
              <div class="jerky-card-fine md-layout-item md-size-25"><span>罰款</span><br>${{ j.fine }}</div>
              <div class="jerky-card-place md-layout-item md-size-100"><span>地點</span><br>{{ j.place }}</div>
              <div class="jerky-card-clause md-layout-item md-size-100"><span>違法行為</span><br>{{ j.penalty_clause_detail }}</div>
            </md-card-content>

          </md-card>
          <div :key="index" class="md-layout-item md-size-3 md-medium-size-5 md-small-hide"></div>
        </template>
      </div>
    </section>
  </page-container>
</template>

<script>
import { getCookie, setCookie } from '../util/util'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
import 'jquery/dist/jquery.min.js'

export default {
  name: 'Search',
  mixins: [validationMixin],
  data: () => ({
    // apiDomain: 'http://localhost:9002',
    apiDomain: '/api/iJerky',
    form: {
      plateNumber: null,
      vin: null,
      category: null
    },
    jerkys: [],
    result: {
      notify: false,
      msg: ''
    },
    sending: false
  }),
  validations: {
    form: {
      plateNumber: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(10)
      },
      vin: {
        required,
        minLength: minLength(4),
        maxLength: minLength(4)
      },
      category: {
        required
      }
    }
  },
  created () {
    this.form.plateNumber = getCookie('plate_number') !== null ? getCookie('plate_number') : ''
    this.form.vin = getCookie('vin') !== null ? getCookie('vin') : ''
    this.form.category = getCookie('category') !== null ? getCookie('category') : ''
  },
  methods: {
    openLink (link) {
      window.open(link, '_blank')
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    search () {
      this.sending = true
      this.result.notify = false
      this.jerkys = []
      setCookie('plate_number', this.form.plateNumber, 90)
      setCookie('vin', this.form.vin, 90)
      setCookie('category', this.form.category, 90)

      let vm = this

      this.$http.get(this.apiDomain + '/jerkySearch?plate_number=' + this.form.plateNumber + '&vin=' + this.form.vin + '&category=' + this.form.category)
        .then(function (response) {
          vm.jerkys = response.data.result.jerkys
          if (vm.jerkys.length > 0) {
            vm.result.msg = '你有' + vm.jerkys.length + '張未繳費牛肉乾!'
          } else {
            vm.result.msg = '恭喜你! 目前找不到未繳費的牛肉乾~'
          }
          vm.result.notify = true
        })
        .catch(function (error) {
          console.log(error)
          vm.result.msg = error.response.data.msg
          vm.result.notify = true
        })
        .finally(function (resp) {
          vm.sending = false
        })
    },
    validateForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.search()
      }
    }
  },
  computed: {
    qrCodePath () {
      return require('../../static/qrcode.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-layout-item.md-size-3 {
    min-width: 3.33%;
    max-width: 3.33%;
    flex: 0 1 3.33%;
  }

  .jerky-result {
    margin-top: 15px;
  }
  .jerky-card {
    margin-bottom: 15px;
    background-color: #36568c !important;
  }
  .jerky-card .md-subhead {
    background: #ef4f4f;
    color: #fff;
    opacity: 1;
    padding: 5px;
  }
  .jerky-card .md-title {
    letter-spacing: 5px;
    margin-bottom: 9px;
  }
  .jerky-card .jerky-card-detail > div {
    background: white;
    color: black;
    padding: 5px;
  }
  .jerky-card .jerky-card-detail .jerky-card-date,
  .jerky-card .jerky-card-detail .jerky-card-time {
    border-right: 5px solid #36568c;
  }
  .jerky-card .jerky-card-detail .jerky-card-place,
  .jerky-card .jerky-card-detail .jerky-card-clause{
    border-top: 5px solid #36568c;
  }
  .jerky-card .jerky-card-detail > div > span {
    font-size: 12px;
  }
</style>
