import Vue from 'vue';
import Router from 'vue-router';
import Bet from '../page/bet';
import Game from '../page/game';
import Rule from '../page/rule';
import Wallet from '../page/wallet';
import ParaWallet from '../page/parawallet';
import Mnemonic from '../page/mnemonic';
import Keystore from '../page/keystore';
import Setting from '../page/setting';
import Mine from '../page/mine';
Vue.use(Router)

export const constantRouterMap = [{
        path: '/',
        name: 'Game',
        component: Game
    },
    {
        path: '/bet',
        name: 'Bet',
        component: Bet
    },
    {
        path: '/wallet',
        name: 'wallet',
        component: Wallet
    },
    {
        path: '/paraWallet',
        name: 'ParaWallet',
        component: ParaWallet
    },
    {
        path: '/mnemonic',
        name: 'mnemonic',
        component: Mnemonic
    },
    {
        path: '/setting',
        name: 'setting',
        component: Setting
    },
    {
        path: '/mine',
        name: 'mine',
        component: Mine
    },
    {
        path: '/keystore',
        name: 'keystore',
        component: Keystore
    },
    {
        path: '/rule',
        name: 'Rule',
        component: Rule
    }
]
export const routers = constantRouterMap;
export default new Router({
    routes: routers
})