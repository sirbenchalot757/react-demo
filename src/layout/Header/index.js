import React from 'react'
import networkEnum from '../../networkEnum'
import BNLogo from '../../icons/SVG_SnowConeLogo.svg'
import avatarPlaceholder from '../../icons/avatar-placeholder.png'
import './Header.css'
import { useWeb3 } from '@chainsafe/web3-context';



const Header = (props) => {
  const { address, ethBalance, network } = useWeb3();



  return (
    <header className="user-info-container">
      <a className='bn-logo-link'
        href="https://www.blocknative.com/"
        target="_blank"
        rel="noopener noreferrer"
        title="Blocknative Site">
        <img className="bn-logo-demo" src={BNLogo} alt="Block Native Logo" />
      </a>
      <div className="user-info">

        {address && <span className="user-address">{address}</span>}

        {ethBalance != null && (
          <span>
            {Number(ethBalance) > 0 ? ethBalance : ethBalance}{' '}
            ETH
          </span>
        )}
        {network && (
          <span>{networkEnum?.[Number(network)] || 'local'} Network</span>
        )}
      </div>
    </header>
  )
}

export default Header
