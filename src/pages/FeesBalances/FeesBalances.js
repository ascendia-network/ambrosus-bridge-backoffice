import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import providers, {ambChainId, bscChainId, ethChainId} from '../../utils/providers';
import formatValue from '../../utils/formatAmount';
import {ethers, utils} from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {getSolBalance} from '../../utils/getSolBalance';
import NetworksConfig from '../../utils/networks.json';

const FeesBalances = (address) => {
  const [balances, setBalances] = useState([]);

  useEffect(async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      NetworksConfig.testnet.amb.rpcUrl,
      22040
    );
    const ambBscTransfer = providers[ambChainId].getBalance('0xba971570E4352a700de3ca57Fe882E2d4C70F42F');
    const ambBscBridge = providers[ambChainId].getBalance('0x893dF80919D7e89A56ED2668466ad4EB84C367a0');
    const bscBscTransfer = providers[bscChainId].getBalance('0x90268508333A15BC932f63faD95E40B7a251eFB1');
    const bscBscBridge = providers[bscChainId].getBalance('0x4CD40e00eBD87acbA000071439B647Aaa2810683');
    const ambEthTransfer = providers[ambChainId].getBalance('0xba971570E4352a700de3ca57Fe882E2d4C70F42F');
    const ambEthBridge = providers[ambChainId].getBalance('0xD3bd2Ac57e3FE109BF29dF67b251E1BfC96DA7b8');
    const ethEthTransfer = providers[ethChainId].getBalance('0x0BD1dD0F45f0F180001e6BD84477B985e8Ce7295');
    const ethEthBridge = providers[ethChainId].getBalance('0x3f3DA18920Ca95bC55353E8e4Fd3C1123D3A07B4');
    const ambSolBridge = provider.getBalance('0x3a1ebA2998777ec9C880C1764f7201514e8610D6');
    const solAmbBridge = getSolBalance('E7Jji6yJQyK81rNPJG6ufwXcSvYRrus5PVoZmPgbSCfS');
    Promise.all([
      ambBscTransfer,
      ambBscBridge,
      bscBscTransfer,
      bscBscBridge,
      ambEthTransfer,
      ambEthBridge,
      ethEthTransfer,
      ethEthBridge,
      ambSolBridge,
      solAmbBridge
    ])
      .then((response) => {
        setBalances(response.map((el) => formatValue(utils.formatUnits(el, 18))));
      })
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableCell />
          <TableCell>Amb-Bsc</TableCell>
          <TableCell>Bsc-Amb</TableCell>
          <TableCell>Amb-Eth</TableCell>
          <TableCell>Eth-Amb</TableCell>
          <TableCell>Amb-Sol</TableCell>
          <TableCell>Sol-Amb</TableCell>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Transfer fee</TableCell>
            <TableCell>{balances[0]}</TableCell>
            <TableCell>{balances[2]}</TableCell>
            <TableCell>{balances[4]}</TableCell>
            <TableCell>{balances[6]}</TableCell>
            <TableCell>{balances[8]}</TableCell>
            <TableCell>{balances[9]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bridge fee</TableCell>
            <TableCell>{balances[1]}</TableCell>
            <TableCell>{balances[3]}</TableCell>
            <TableCell>{balances[5]}</TableCell>
            <TableCell>{balances[7]}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeesBalances;
