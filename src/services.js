import stagingNotify from 'bnc-notify-staging'
import Notify from 'bnc-notify'

import Onboard from '@bn-onboard/core'
import injectedWalletsModule from '@bn-onboard/injected-wallets'
import ledgerModule from '@bn-onboard/ledger'
import walletConnectModule from '@bn-onboard/walletconnect'
import walletLinkModule from '@bn-onboard/walletlink'
import portisModule from '@bn-onboard/portis'
import fortmaticModule from '@bn-onboard/fortmatic'
import torusModule from '@bn-onboard/torus'
import trezorModule from '@bn-onboard/trezor'
import keepkeyModule from '@bn-onboard/keepkey'

const networkId = 4
const rpcUrl = 'https://rinkeby.infura.io/v3/cea9deb6467748b0b81b920b005c10c1'
const apiUrl = process.env.REACT_APP_API_URL
const staging = process.env.REACT_APP_STAGING
const dappId = '12153f55-f29e-4f11-aa07-90f10da5d778'

const injected = injectedWalletsModule()
const walletLink = walletLinkModule()
const walletConnect = walletConnectModule()

const portis = portisModule({
  apiKey: 'b2b7586f-2b1e-4c30-a7fb-c2d1533b153b'
})

const fortmatic = fortmaticModule({
  apiKey: 'pk_test_886ADCAB855632AA'
})

const torus = torusModule()
const ledger = ledgerModule()
const trezor = trezorModule({
  appUrl: 'https://reactdemo.blocknative.com',
  email: 'aaron@blocknative.com'
})
const keepkey = keepkeyModule()

export function initOnboard() {
  return Onboard({
    wallets: [
      walletConnect,
      walletLink,
      injected,
      fortmatic,
      portis,
      torus,
      ledger,
      trezor,
      keepkey
    ],
    chains: [
      {
        id: '0x4',
        token: 'rETH',
        label: 'Ethereum Rinkeby Testnet',
        rpcUrl: 'https://rinkeby.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
      }
    ]
  })
}

export function initNotify() {
  const notify = staging ? stagingNotify : Notify
  return notify({
    dappId,
    networkId,
    apiUrl,
    onerror: error => console.log(`Notify error: ${error.message}`)
  })
}
