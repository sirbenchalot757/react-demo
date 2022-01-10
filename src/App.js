import Onboard from '@bn-onboard/core'
import injectedWalletsModule from '@bn-onboard/injected-wallets'
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import VConsole from 'vconsole'
import { initOnboard, initNotify } from './services'
import networkEnum from './networkEnum'
import BNLogo from './icons/blocknative-logo-dark.svg'
import avatarPlaceholder from './icons/avatar-placeholder.png'
import Footer from './views/Footer/Footer.js'
import './App.css'

if (window.innerWidth < 700) {
  new VConsole()
}

let provider

const internalTransferABI = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address'
      }
    ],
    name: 'internalTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

let internalTransferContract

const App = () => {
  const [wallets, setWallets] = useState([])
  const [onboard, setOnboard] = useState(null)
  const [notify, setNotify] = useState(null)

  const [darkMode, setDarkMode] = useState(false)
  const [desktopPosition, setDesktopPosition] = useState('bottomRight')
  const [mobilePosition, setMobilePosition] = useState('top')

  const [toAddress, setToAddress] = useState('')

  useEffect(() => {
    const injected = injectedWalletsModule()
    setOnboard(
      Onboard({
        wallets: [injected],
        chains: [
          {
            id: '0x4',
            token: 'rETH',
            label: 'Ethereum Rinkeby Testnet',
            rpcUrl:
              'https://rinkeby.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
          }
        ]
      })
    )

    setNotify(initNotify())
  }, [])

  useEffect(() => {
    if (onboard) {
      const connectedWallets = onboard.state.select('wallets')
      const subscription = connectedWallets.subscribe(setWallets)

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [onboard])

  useEffect(() => {
    const previouslySelectedWallet =
      window.localStorage.getItem('selectedWallet')

    if (previouslySelectedWallet && onboard) {
      onboard.connectWallet({ autoSelect: previouslySelectedWallet })
    }
  }, [])

  const sendHash = async () => {
    if (!toAddress) {
      alert('An Ethereum address to send Eth to is required.')
      return
    }

    const signer = provider.getUncheckedSigner()

    const { hash } = await signer.sendTransaction({
      to: toAddress,
      value: 1000000000000000
    })

    const { emitter } = notify.hash(hash)

    emitter.on('txPool', transaction => {
      return {
        // message: `Your transaction is pending, click <a href="https://rinkeby.etherscan.io/tx/${transaction.hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
        // or you could use onclick for when someone clicks on the notification itself
        onclick: () =>
          window.open(`https://rinkeby.etherscan.io/tx/${transaction.hash}`)
      }
    })

    emitter.on('txSent', console.log)
    emitter.on('txConfirmed', console.log)
    emitter.on('txSpeedUp', console.log)
    emitter.on('txCancel', console.log)
    emitter.on('txFailed', console.log)
  }

  const sendInternalTransaction = async () => {
    if (!toAddress) {
      alert('An Ethereum address to send Eth to is required.')
      return
    }

    const { hash } = await internalTransferContract.internalTransfer(
      toAddress,
      {
        value: 1000000000000000
      }
    )

    const { emitter } = notify.hash(hash)

    emitter.on('txSent', console.log)
    emitter.on('txPool', console.log)
    emitter.on('txConfirmed', console.log)
    emitter.on('txSpeedUp', console.log)
    emitter.on('txCancel', console.log)
    emitter.on('txFailed', console.log)
  }

  const sendTransaction = async () => {
    if (!toAddress) {
      alert('An Ethereum address to send Eth to is required.')
    }

    const signer = provider.getUncheckedSigner()

    const txDetails = {
      to: toAddress,
      value: 1000000000000000
    }

    const sendTransaction = () => {
      return signer.sendTransaction(txDetails).then(tx => tx.hash)
    }

    const gasPrice = () => provider.getGasPrice().then(res => res.toString())

    const estimateGas = () => {
      return provider.estimateGas(txDetails).then(res => res.toString())
    }

    const { emitter } = await notify.transaction({
      sendTransaction,
      gasPrice,
      estimateGas,
      balance: onboard.getState().balance,
      txDetails
    })

    emitter.on('txRequest', console.log)
    emitter.on('nsfFail', console.log)
    emitter.on('txRepeat', console.log)
    emitter.on('txAwaitingApproval', console.log)
    emitter.on('txConfirmReminder', console.log)
    emitter.on('txSendFail', console.log)
    emitter.on('txError', console.log)
    emitter.on('txUnderPriced', console.log)
    emitter.on('txSent', console.log)
    emitter.on('txPool', console.log)
    emitter.on('txConfirmed', console.log)
    emitter.on('txSpeedUp', console.log)
    emitter.on('txCancel', console.log)
    emitter.on('txFailed', console.log)
  }

  const renderDeviceSettings = () => {
    if (window.innerWidth < 700) {
      return (
        <div className={'conditional-ui-settings'}>
          <h3>Notify Mobile Positioning</h3>
          <button
            className={`bn-demo-button ${
              mobilePosition === 'top'
                ? 'selected-toggle-btn'
                : 'unselected-toggle-btn'
            }`}
            onClick={() => {
              setMobilePosition('top')
              notify.config({ mobilePosition: 'top' })
            }}
          >
            Top
          </button>
          <button
            className={`bn-demo-button ${
              mobilePosition === 'bottom'
                ? 'selected-toggle-btn'
                : 'unselected-toggle-btn'
            }`}
            onClick={() => {
              setMobilePosition('bottom')
              notify.config({ mobilePosition: 'bottom' })
            }}
          >
            Bottom
          </button>
        </div>
      )
    }

    return (
      <div className={'conditional-ui-settings'}>
        {' '}
        <h3>Notify Desktop Positioning</h3>
        <button
          className={`bn-demo-button ${
            desktopPosition === 'topLeft'
              ? 'selected-toggle-btn'
              : 'unselected-toggle-btn'
          }`}
          onClick={() => {
            setDesktopPosition('topLeft')
            notify.config({ desktopPosition: 'topLeft' })
          }}
        >
          Top Left
        </button>
        <button
          className={`bn-demo-button ${
            desktopPosition === 'topRight'
              ? 'selected-toggle-btn'
              : 'unselected-toggle-btn'
          }`}
          onClick={() => {
            setDesktopPosition('topRight')
            notify.config({ desktopPosition: 'topRight' })
          }}
        >
          Top Right
        </button>
        <button
          className={`bn-demo-button ${
            desktopPosition === 'bottomRight'
              ? 'selected-toggle-btn'
              : 'unselected-toggle-btn'
          }`}
          onClick={() => {
            setDesktopPosition('bottomRight')
            notify.config({ desktopPosition: 'bottomRight' })
          }}
        >
          Bottom Right
        </button>
        <button
          className={`bn-demo-button ${
            desktopPosition === 'bottomLeft'
              ? 'selected-toggle-btn'
              : 'unselected-toggle-btn'
          }`}
          onClick={() => {
            setDesktopPosition('bottomLeft')
            notify.config({ desktopPosition: 'bottomLeft' })
          }}
        >
          Bottom Left
        </button>
      </div>
    )
  }

  if (!onboard || !notify) return <div>Loading...</div>

  return (
    <main>
      <header className="user-info-container">
        <a
          className="bn-logo-link"
          href="https://www.blocknative.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Blocknative Site"
        >
          <img className="bn-logo-demo" src={BNLogo} alt="Block Native Logo" />
        </a>
        {wallets[0] && (
          <div className="user-info">
            {wallets[0].accounts[0].ens?.name ? (
              <span>
                <img
                  className="user-avatar"
                  src={
                    wallets[0].accounts[0].ens.avatar
                      ? wallets[0].accounts[0].ens.avatar
                      : avatarPlaceholder
                  }
                  alt="avatar"
                ></img>
                <div
                  style={{
                    marginLeft: '10px'
                  }}
                >
                  {wallets[0].accounts[0].ens.name}
                </div>
              </span>
            ) : (
              wallets[0].accounts[0].address && (
                <span className="user-address">
                  {wallets[0].accounts[0].address}
                </span>
              )
            )}
            {wallets[0].accounts[0]?.balance?.rETH != null && (
              <span>
                {Number(wallets[0].accounts[0]?.balance?.rETH) > 0
                  ? wallets[0].accounts[0]?.balance?.rETH
                  : wallets[0].accounts[0]?.balance?.rETH}{' '}
                ETH
              </span>
            )}
            {wallets[0].chain && (
              <span>
                {networkEnum?.[Number(wallets[0].chain)] || 'local'} Network
              </span>
            )}
          </div>
        )}
      </header>
      <section className="main">
        <div className="main-content">
          <div className="vertical-main-container">
            <div className="container onboard">
              <h2>Onboarding Users with Onboard</h2>
              {!wallets[0]?.provider && (
                <button
                  className="bn-demo-button"
                  onClick={() => {
                    onboard.connectWallet()
                  }}
                >
                  Connect a Wallet
                </button>
              )}

              {wallets[0]?.provider && (
                <button
                  className="bn-demo-button"
                  onClick={onboard.connectWallet}
                >
                  Connect another wallet
                </button>
              )}

              {wallets[0]?.provider && (
                <button
                  className="bn-demo-button"
                  onClick={onboard.disconnectWallet}
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
          <div className="container notify">
            <h2>Transaction Notifications with Notify</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}
            >
              {wallets[0] && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Send 0.001 Rinkeby Eth to:</label>
                    <input
                      type="text"
                      style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '10px',
                        marginLeft: '0.5rem',
                        width: '18rem'
                      }}
                      value={toAddress}
                      placeholder="address"
                      onChange={e => setToAddress(e.target.value)}
                    />
                  </div>
                  <div className={'send-transaction-container'}>
                    <button
                      className="bn-demo-button"
                      onClick={async () => {
                        try {
                          await onboard.setChain('0x4')
                          sendHash()
                        } catch (error) {
                          // user rejected switch network request
                        }
                      }}
                    >
                      Send
                    </button>
                    with in-flight notifications
                  </div>
                  <div className={'send-transaction-container'}>
                    <button
                      className="bn-demo-button"
                      onClick={async () => {
                        try {
                          await onboard.setChain('0x4')
                          sendTransaction()
                        } catch (error) {
                          // user rejected switch network request
                        }
                      }}
                    >
                      Send
                    </button>
                    with pre-flight and in-flight notifications
                  </div>
                  <div className={'send-transaction-container'}>
                    <button
                      className="bn-demo-button"
                      onClick={async () => {
                        try {
                          await onboard.setChain('0x4')
                          sendInternalTransaction()
                        } catch (error) {
                          // user rejected switch network request
                        }
                      }}
                    >
                      Send
                    </button>
                    via a internal transaction
                  </div>
                </div>
              )}
              <div>
                <button
                  className="bn-demo-button"
                  onClick={async () => {
                    wallets[0] && notify.account(wallets[0].accounts[0].address)
                  }}
                >
                  Watch Current Account
                </button>
                <button
                  className="bn-demo-button"
                  onClick={async () => {
                    wallets[0] &&
                      notify.unsubscribe(wallets[0].accounts[0].address)
                  }}
                >
                  Un-watch Current Account
                </button>
                <button
                  className="bn-demo-button"
                  onClick={() => {
                    const { update } = notify.notification({
                      eventCode: 'dbUpdate',
                      type: 'pending',
                      message:
                        'This is a custom notification triggered by the dapp'
                    })
                    setTimeout(
                      () =>
                        update({
                          eventCode: 'dbUpdateSuccess',
                          message: 'Updated status for custom notification',
                          type: 'success'
                        }),
                      4000
                    )
                  }}
                >
                  Custom Notification
                </button>
              </div>
            </div>
          </div>
          <div className="container ui-settings">
            <h3>Onboard / Notify UI Settings</h3>
            <button
              className={`bn-demo-button ${
                darkMode ? 'selected-toggle-btn' : 'unselected-toggle-btn'
              }`}
              onClick={() => {
                setDarkMode(true)
                notify.config({ darkMode: true })
                onboard.config({ darkMode: true })
              }}
            >
              Dark Mode
            </button>
            <button
              className={`bn-demo-button ${
                !darkMode ? 'selected-toggle-btn' : 'unselected-toggle-btn'
              }`}
              onClick={() => {
                setDarkMode(false)
                notify.config({ darkMode: false })
                onboard.config({ darkMode: false })
              }}
            >
              Light Mode
            </button>

            {renderDeviceSettings()}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default App
