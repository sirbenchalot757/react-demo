import stagingNotify from 'bnc-notify-staging'
import Notify from 'bnc-notify'

const networkId = 4
const rpcUrl = 'https://rinkeby.infura.io/v3/cea9deb6467748b0b81b920b005c10c1'
const apiUrl = process.env.REACT_APP_API_URL
const staging = process.env.REACT_APP_STAGING
const dappId = '12153f55-f29e-4f11-aa07-90f10da5d778'

export function initNotify() {
  const notify = staging ? stagingNotify : Notify
  return notify({
    dappId,
    networkId,
    apiUrl,
    onerror: error => console.log(`Notify error: ${error.message}`)
  })
}
