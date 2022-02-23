import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import VConsole from 'vconsole'
import { initOnboard, initNotify } from './services'
import './App.css'
import Layout from './layout'
import Home from './components/home'
import { Web3Provider } from '@chainsafe/web3-context';




const App = () => {

  return (
    <Web3Provider
      networkIds={[5, 6]}
      tokensToWatch={{
        5: [
          {
            address: '0x14dd060db55c0e7cc072bd3ab4709d55583119c0',
            name: 'TEST Goerli',
            symbol: 'TSTG',
          },
        ],
        6: [
          {
            address: '0x14dd060db55c0e7cc072bd3ab4709d55583119c0',
            name: 'TEST Kotti',
            symbol: 'TSTK',
          },
        ],
      }}
    >
      <Layout>
        <Home />
      </Layout>
    </Web3Provider>

  )
}

export default App
