<template>
  <div class="lists flexa" v-loading="loading">
    <div class="coinDiv flexc">
      <img class="coin" src="https://apps.defis.network/static/coin/dbctokenmain-dbc.png" alt="">
    </div>
    <div class="f1">
      <div class="projectName flexb">
        <span>DBC大白菜</span>
        <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
      </div>
      <div class="reward">
        <span>收益：</span>
        <span>{{ allClaim }} DBC</span>
      </div>
      <div class="about">
        <span>≈ {{ aboutEos }} EOS</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { toFixed, toLocalTime, accAdd, accSub, accDiv, getAccYfcReward, countdown } from '@/utils/public';
import { EosModel } from '@/utils/eos';
// https://apps.defis.network/static/coin/yfctokenmain-yfc.png
// https://ndi.340wan.com/eos/eosdmdtokens-dmd.png
// https://ndi.340wan.com/eos/minedfstoken-dfs.png
// https://apps.defis.network/static/coin/looptoken123-loop.png
// https://apps.defis.network/static/coin/dbctokenmain-dbc.png
export default {
  name: 'dbc',
  props: {
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      poolsBal: state => state.sys.poolsBal,
      lpPoolsBal: state => state.config.lpPoolsBal,
      lpDamping: state => state.config.lpDamping,
      lpMineList: state => state.config.lpMineList,
      marketLists: state => state.sys.marketLists,
    }),
    allClaim() {
      let all = '0.0000000000';
      this.newLists.forEach(v => {
        // console.log(v.showReward)
        all = accAdd(all, v.showReward || 0)
        // all = accAdd(all, Number(v.reward))
      })
      // console.log(all)
      return toFixed(all, 8)
    },
    aboutEos() {
      const price = parseFloat(this.marketData.reserve0) / parseFloat(this.marketData.reserve1) || 0;
      const num = price * this.allClaim;
      return toFixed(num, 4)
    },
  },
  data() {
    return {
      loading: true,
      project: 'DBC',
      pondsList: [], // 池子数据 - 未处理
      dealArr: [], // 池子数据 - 已处理
      showReward: '0.00000000',
      hasGet: false,
      timerArr: [],
      newLists: [],
      claiming: false,
      mid: 346, // dfs: 39 | DMD: 326 | YFC: 329 | DBC: 346 | LOOP: 424
      marketData: {},
    }
  },
  watch: {
    '$store.state.config.tampList': {
      handler: function lml() {
        const newVal = this.lpMineList[this.project] || [];
        if (!newVal || !newVal.length) {
          return
        }
        const rows = newVal.sort((a, b) => {
          return Number(b.weight) - Number(a.weight)
        })
        this.pondsList = rows;
        this.handleDealList();
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function ml(newVal, oldVal) {
        this.marketData = newVal.find(v => v.mid === this.mid) || {}
        if (!newVal.length || JSON.stringify(newVal) === JSON.stringify(oldVal)) {
          return
        }
        this.handleDealList();
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          // this.handleGetAccLpt();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.handleGetPonds();
  },
  methods: {
    handleClaim() {
      if (this.allClaiming || this.claiming) {
        return
      }
      const actions = this.handleGetActions()
      if (!actions.length) {
        return
      }
      this.claiming = true;
      const params = {
        actions,
      }
      EosModel.toTransaction(params, (res) => {
        this.claiming = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
          this.handleGetUnclaim()
        }, 1000);
      })
    },
    handleGetActions() {
      const actions = [];
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      this.newLists.forEach(v => {
        if (!v.showReward || !Number(v.showReward)) {
          return
        }
        const action = {
          account: 'dbcfarmers11',
          name: 'harvest',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            id: v.id
          }
        }
        actions.push(action)
      })
      return actions;
    },
    handleDealList() {
      if (!this.pondsList.length || !this.marketLists.length) {
        return;
      }
      this.loading = false
      const newListArr = []
      const wArr = [];
      this.pondsList.forEach(pond => {
        let list = JSON.stringify(this.marketLists.find(vv => vv.mid === pond.id) || {});
        list = JSON.parse(list)
        list.multiple = Number(pond.weight)
        list.maxNum = parseFloat(pond.max_supply)
        if (pond.start) {
          let beginTime = toLocalTime(`${pond.start}.000+0000`);
          beginTime = moment(beginTime).valueOf();
          list.beginTime = beginTime / 1000;
        }
        if (pond.end) {
          let endTime = toLocalTime(`${pond.end}.000+0000`);
          endTime = moment(endTime).valueOf();
          list.endTime = endTime / 1000;
        }
        list.name = `${list.symbol1} Pond`
        const newList = Object.assign(pond, list)
        const leng = wArr.length;
        if (!leng) {
          wArr[0] = []
        } else {
          const upWeight = wArr[leng - 1][0].multiple;
          if (upWeight > list.multiple) {
            wArr[leng] = []
          }
        }
        wArr[wArr.length - 1].push(newList)
      })
      wArr.forEach(arr => {
        const tArr = arr.sort((a, b) => {
          return parseFloat(b.supply) - parseFloat(a.supply)
        })
        newListArr.push(...tArr)
      })
      this.dealArr = newListArr;
      this.handleGetMarketList();
    },
    handleGetMarketList() {
      if (this.hasGet || !this.scatter || !this.scatter.identity || !this.dealArr.length) {
        return;
      }
      this.timerArr.forEach(v => {
        clearInterval(v)
      })
      this.hasGet = true;
      const formName = this.scatter.identity.accounts[0].name;
      this.dealArr.forEach((v, index) => {
        let tDateStart = countdown(v.beginTime, true);
        let tDateEnd = countdown(v.endTime, true);
        if (!(tDateStart.total <= 0 && tDateEnd.total > 0) || parseFloat(v.supply) >= parseFloat(v.max_supply)) {
          return
        }
        setTimeout(() => {
          const params = {
            code: 'dbcfarmers11',
            scope: v.id,
            table: 'miners',
            lower_bound: ` ${formName}`,
            upper_bound: ` ${formName}`,
            json: true,
          }
          EosModel.getTableRows(params, (res) => {
            const rows = res.rows || []
            if (!rows.length) {
              this.$set(v, 'minnerData', {})
              this.$set(v, 'showReward', '0.00000000')
              this.$set(v, 'reward', '0.00000000')
              return
            }
            const minnerData = rows[0];
            let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
            lastTime = moment(lastTime).valueOf();
            minnerData.lastTime = lastTime;
            const liq = minnerData.liq_bal0.split(' ')[1] === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
            minnerData.liq = liq;
            this.$set(v, 'minnerData', minnerData)
            this.$set(v, 'showReward', '0.00000000')
            this.$set(v, 'reward', '0.00000000')
            // console.log(minnerData)
            this.handleRunReward()
          })
        }, index * 200);
      })
    },
    handleRunReward() {
      if (!Number(this.poolsBal) || !Number(this.lpPoolsBal.DBC)) {
        return;
      }
      clearTimeout(this.timer)
      this.handleRunMyReward()
      this.timer = setTimeout(() => {
        this.handleRunReward()
      }, 1000);
    },
    handleRunMyReward() {
      this.newLists = this.dealArr;
      this.newLists.forEach((v, index) => {
        if (this.timerArr[index]) {
          clearInterval(this.timerArr[index])
        }
        if (!v.minnerData || !v.minnerData.miner) {
          return
        }
        const data = {
          weight: v.multiple,
          yfcBal: this.lpPoolsBal.DBC,
          eosBal: this.poolsBal,
          damping: this.lpDamping.DBC,
        }
        const reward = getAccYfcReward(v.minnerData, data)
        let showReward = v.showReward || 0;
        let countReward = showReward;
        this.$set(v, 'reward', reward)
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        // console.log(reward, showReward, t, v.showReward)
        this.timerArr[index] = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.timerArr[index])
          } else {
            showReward = toFixed(countReward, 8);
          }
          this.$set(v, 'showReward', showReward);
        }, 50);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import './comp.scss';
</style>
