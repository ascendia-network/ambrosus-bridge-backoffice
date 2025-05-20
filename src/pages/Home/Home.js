import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {Tab, Tabs} from '@mui/material';
import providers, {ambChainId, bscChainId, ethChainId} from '../../utils/providers';
import TabPanel from './components/TabPanel';
import {createBridgeContract} from '../../utils/contracts';
import Balance from '../Balance';
import Fees from '../Fees/Fees';
import ConfigContext from '../../context/ConfigContext/context';
import FeesBalances from "../FeesBalances/FeesBalances";

const solChainId = '6003100671677645902';

const Home = () => {
  const { bridges } = useContext(ConfigContext);

  const [currentTab, setCurrentTab] = useState('amb/eth');
  const [transactions, setTransactions] = useState([]);
  const [isAmbEthPaused, setIsAmbEthPaused] = useState(false);
  const [isEthAmbPaused, setIsEthAmbPaused] = useState(false);
  const [isEthBscPaused, setIsAmbBscPaused] = useState(false);
  const [isBscAmbPaused, setIsBscAmbPaused] = useState(false);

  useEffect(async () => {
    const ambEthContract = createBridgeContract(
      bridges[ethChainId].native,
      providers[ambChainId],
    );
    const ethAmbContract = createBridgeContract(
      bridges[ethChainId].foreign,
      providers[ethChainId],
    );
    const ambBscContract = createBridgeContract(
      bridges[bscChainId].native,
      providers[ambChainId],
    );
    const bscAmbContract = createBridgeContract(
      bridges[bscChainId].foreign,
      providers[bscChainId],
    );
    const ambEthPaused = await ambEthContract.paused();
    const ethAmbPaused = await ethAmbContract.paused();
    const ambBscPaused = await ambBscContract.paused();
    const bscAmbPaused = await bscAmbContract.paused();

    setIsAmbEthPaused(ambEthPaused);
    setIsEthAmbPaused(ethAmbPaused);
    setIsAmbBscPaused(ambBscPaused);
    setIsBscAmbPaused(bscAmbPaused);
  }, []);

  useEffect(() => {
    setTransactions([]);
    if (Number.isInteger(currentTab)) return;

    const chains = currentTab.split('/');

    if (currentTab.includes('sol')) {
      let chainFrom = 22040;
      let chainTo = solChainId;

      if (chains[0] === 'sol') {
        chainFrom = solChainId;
        chainTo = 22040;
      }
      axios.get(`https://bridge-v2-api.ambrosus-test.io/api/backoffice?chainFrom=${chainFrom}&chainTo=${chainTo}`)
        .then(({data}) => {
          setTransactions(data.map((tx) => ({
            ...tx,
            chainId: chains[0] === 'sol' ? solChainId : ambChainId,
            destChainId: chains[0] !== 'sol' ? solChainId : ambChainId,
            userAddress: tx.addressFrom,
            userAddressTo: tx.addressTo,
            eventId: tx.eventId,
            status: tx.status,
            withdrawTx: {
              destinationTxHash: tx.sendTx.txHash,
              txTimestamp: tx.sendTx.timestamp,
            }
          })))
        })
    } else {
      axios.get(`https://backoffice-api.ambrosus.io/backoffice?networkFrom=${chains[0]}&networkTo=${chains[1]}`)
        .then(({ data }) => {
          let txs = [];

          let departureChainId = ambChainId;
          let destinationChainId = ambChainId;

          if (chains[0] === 'eth') {
            departureChainId = ethChainId;
          } else if (chains[0] === 'bsc') {
            departureChainId = bscChainId;
          }
          if (chains[1] === 'eth') {
            destinationChainId = ethChainId;
          } else if (chains[1] === 'bsc') {
            destinationChainId = bscChainId;
          }

          data.forEach((el) => {
            txs = [...txs, ...el.transfers.map((tx) => ({
              ...tx,
              chainId: departureChainId,
              destChainId: destinationChainId,
              eventId: el.eventId,
              destinationTxHash: el.transferFinishTx.txHash,
              status: el.status
            }))]
          });
          setTransactions(txs.sort((a, b) => b.withdrawTx.txTimestamp - a.withdrawTx.txTimestamp))
        });

    }
  }, [currentTab]);

  const changeTab = (_, chainId) => {
    setCurrentTab(chainId);
  };

  return (
    <div className="transactions-page">
      <div className="navbar">
        <Tabs value={currentTab} onChange={changeTab} style={{width: 900}}>
          <Tab label="Amb/Eth" value={'amb/eth'} />
          <Tab label="Eth/Amb" value={'eth/amb'} />
          <Tab label="Amb/Bsc" value={'amb/bsc'} />
          <Tab label="Bsc/Amb" value={'bsc/amb'} />
          <Tab label="Sol/Amb" value={'sol/amb'} />
          <Tab label="Amb/Sol" value={'amb/sol'} />
          <Tab label="Balance" value={100} />
          <Tab label="Fees" value={99} />
          <Tab label="Fees balances" value={98} />
        </Tabs>
        <div className="paused-networks">
          <div>
            <p>Eth/Amb status: {isEthAmbPaused ? 'Paused' : 'Working'}</p>
            <p>Amb/Eth status: {isAmbEthPaused ? 'Paused' : 'Working'}</p>
          </div>
          <div>
            <p>Bsc/Amb status: {isEthBscPaused ? 'Paused' : 'Working'}</p>
            <p>Amb/Bsc status: {isBscAmbPaused ? 'Paused' : 'Working'}</p>
          </div>
        </div>
      </div>
      {currentTab === 99 && (
        <Fees />
      )}
      {currentTab === 100 && (
        <Balance />
      )}
      {currentTab === 98 && (
          <FeesBalances />
      )}
      {!Number.isInteger(currentTab) && (
        <TabPanel txs={transactions} />
      )}
    </div>
  )
}

export default Home;
