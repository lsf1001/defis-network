export default {
  public: {
    loginPls: '请先登录',
    login: '登录',
    warmTip: '本项目的智能合约已经过专业安全团队审计。但仍可能存在不可意料的风险。请注意并自行承担使用风险。',
    balance: '余额',
    noData: '暂无数据',
    loginOut: '退出',
    known: '我已知晓',
    noTip: '不再提示',
    fee: '手续费',
    cancel: '取消',
    useDefined: '自定义',
    balanLow: '余额不足',
    tokenLow: '可用凭证数量不足',
    success: '操作成功',
    tutorial: '教程',
  },
  tab: {
    bank: '金库',
    dex: '兑换',
    pools: '做市',
    hyk: '认购'
  },
  bank: {
    stake: '抵押',
    borrow: '生成',
    genFee: '铸币费',
    borrowBtn: '生成USDD',
    stakeNum: '抵押数量',
    mineStake: '抵押',
    borrowNum: '生成数量',
    redeem: '赎回',
    mining: '抵押中',
    record: '生成记录',
    stakeInMining: '抵押中',
    canRedeem: '后可进行赎回。',
  },
  dex: {
    pay: '支付',
    obtain: '获取',
    rate: '兑换比率',
    slipPoint: '滑点保护',
    slipTip: '如果您提交交易后，价格变化超过滑点保护的范围，交易将被撤销。',
    addMarket: '创建市场',
    swapNow: '立即兑换',
    coin: '币种{coin}',
    contract: '合约地址',
    plsContract: '输入合约地址',
    coinName: '币种名称',
    plsCoinName: '输入币种名称',
    coinDecimal: '币种精度',
    plsCoinDecimal: '输入币种精度',
    submit: '创建',
  },
  pools: {
    deposit: '存入',
    withdrawal: '取回',
    depositRate: '存入比率',
    poolsNum: '池内数量',
    getToken: '获得凭证数量',
    token: '凭证',
    ableToken: '可用凭证',
    chooseMarket: '选择市场',
  },
  hyk: {
    stock: '分红',
    stock2: '分红池',
    stockPrice: '认购价格',
    stockRate: '认购进度',
    buyCount: '认购金额',
    buyNum: '认购数量',
    bonusAcc: '分红账户',
    totalBonus: '分红总量',
    totalVal: '总估值',
    holdings: 'HYK持有量',
    perBonus: '每万DFS分红',
  },
  bonus: {
    myDividends: '我的红利',
    nextDividends: '下轮分红',
    totalDividends: '分红总量',
    dfsSupply: 'DFS流通量',
    dfsStaked: 'DFS质押总量',
    ofPercent: '占流通总量的 {percent}%',
    claim: '领取',
    ableStake: '可质押',
    inStake: '输入质押数量',
    inRedeem: '输入赎回数量',
    stake: '质押',
    staked: '已质押',
    redeemable: '可赎回',
    redeeming: '赎回中',
    redeemDetail: '赎回详情',
    redeemNum: '赎回数量',
    redeemTime: '赎回时间',
    lastTime: '剩余{day}天{hour}小时',
  },
  tutorial: {
    done: '搞定！',
    title1: '如何发行USDD',
    label1: '向智能合约发送抵押物EOS，立即得到新发行的USDD。',
    ul1_1: '进入金库页面',
    ul1_2: '输入抵押物数量',
    ul1_3: '点击「生成USDD」按钮',
    ul1_4: '确认交易',
    ul1_5: '等待交易被网络确认',

    title2: '如何赎回抵押物',
    label2: '向智能合约发送USDD，立即赎回对应的抵押物EOS。',
    ul2_1: '进入金库页面',
    ul2_2: '在下方生成记录中选择要赎回的记录',
    ul2_3: '点击「赎回」按钮, 请确保你的钱包中有足够的USDD余额',

    title3: '如何交易',
    label3: '想进行快速的币币交易，把USDD换成EOS，或把EOS换成USDD吗？',
    ul3_1: '进入兑换页面',
    ul3_2: '选择要兑换的币种',
    ul3_3: '输入要兑换的数量',
    ul3_4: '点击「立即兑换」按钮',

    title4: '如何创建交易所',
    label4: '如果兑换中，没有想要的交易所，您可以随时创建一个。',
    ul4_1: '进入兑换页面',
    ul4_2: '点击创建市场',
    ul4_3: '按要求输入币种信息',
    ul4_4: '点击「创建」按钮',

    title5: '如何添加流动性资金',
    ul5_1: '进入做市页面',
    ul5_2: '选择「存入」页签',
    ul5_3: '选择币种',
    ul5_4: '输入两个币种的金额',
    ul5_5: '点击「存入」按钮',

    title6: '如何提取流动性资金',
    ul6_1: '进入做市页面',
    ul6_2: '选择「取回」页签',
    ul6_3: '选择币种',
    ul6_4: '输入凭证数量',
    ul6_5: '点击「取回」按钮',
  }
}