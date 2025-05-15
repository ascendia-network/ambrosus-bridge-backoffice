import React, {useContext, useEffect, useState} from 'react';
import providers, {ambChainId, bscChainId, ethChainId,} from '../../utils/providers';
import {ethers, utils} from 'ethers';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import ConfigContext from '../../context/ConfigContext/context';
import formatValue from '../../utils/formatAmount';
import ABI from '../../utils/balanceAbi.json';
import {Connection, PublicKey} from '@solana/web3.js';
import {getMint} from '@solana/spl-token';
import {getSolTokenBalance} from '../../utils/getSolTokenBalance';

const tableHeads = [
  '',
  'AMB (ETH)',
  'AMB (BSC)',
  'ETH',
  'BSC',
  'AMB (SOL)',
  'SOL'
];


const getTokenTotalSupply = async (mintAddress) => {
  const connection = new Connection('https://api.devnet.solana.com');
  const mintPublicKey = new PublicKey(mintAddress);

  const mintInfo = await getMint(connection, mintPublicKey);

  return Number(mintInfo.supply) / 10 ** mintInfo.decimals;
};

const Balance = () => {
  const { bridges, tokens } = useContext(ConfigContext);

  const [balances, setBalances] = useState(null);
  const [solBalances, setSolBalances] = useState(null);

  useEffect(() => {
    handleBalances();
    handleSolBalances();
  }, []);

  const handleBalances = async () => {
    const sAMBOnAMB = new ethers.Contract(getTokenAddress('SAMB', ambChainId), ABI, providers[ambChainId]);
    const sAMBOnETHLocked = sAMBOnAMB.balanceOf(bridges[ethChainId].native);
    const sAMBOnBSCLocked = sAMBOnAMB.balanceOf(bridges[bscChainId].native);
    const sAMBOnETH = new ethers.Contract(getTokenAddress('SAMB', ethChainId), ABI, providers[ethChainId]);
    const sAMBOnBSC = new ethers.Contract(getTokenAddress('SAMB', bscChainId), ABI, providers[bscChainId]);
    const sAMBOnETHSupplied = sAMBOnETH.totalSupply();
    const sAMBOnBSCSupplied = sAMBOnBSC.totalSupply();

    const USDCOnETH = new ethers.Contract(getTokenAddress('USDC', ethChainId), ABI, providers[ethChainId]);
    const USDCOnEthLocked = USDCOnETH.balanceOf(bridges[ethChainId].foreign);
    const USDCOnBSC = new ethers.Contract(getTokenAddress('USDC', bscChainId), ABI, providers[bscChainId]);
    const USDCOnBSCLocked = USDCOnBSC.balanceOf(bridges[bscChainId].foreign);
    const USDCOnAMB = new ethers.Contract(getTokenAddress('USDC', ambChainId), ABI, providers[ambChainId]);
    const USDCOnAMBETHThinkLocked = USDCOnAMB.bridgeBalances(bridges[ethChainId].native);
    const USDCOnAMBBSCThinkLocked = USDCOnAMB.bridgeBalances(bridges[bscChainId].native);


    const BUSDOnETH = new ethers.Contract(getTokenAddress('BUSD', bscChainId), ABI, providers[bscChainId]);
    const BUSDOnEthLocked = BUSDOnETH.balanceOf(bridges[bscChainId].foreign);
    // const BUSDOnBSC = new ethers.Contract(getTokenAddress('USDC', bscChainId), ABI, providers[bscChainId]);
    // const BUSDOnBSCLocked = USDCOnBSC.balanceOf(bridges[bscChainId].foreign);
    const BUSDOnAMB = new ethers.Contract(getTokenAddress('BUSD', ambChainId), ABI, providers[ambChainId]);
    // const BUSDOnAMBETHThinkLocked = USDCOnAMB.bridgeBalances(bridges[ethChainId].native);
    const BUSDOnAMBBSCThinkLocked = BUSDOnAMB.bridgeBalances(bridges[bscChainId].native);

    Promise.all([
      sAMBOnETHLocked,
      sAMBOnBSCLocked,
      sAMBOnETHSupplied,
      sAMBOnBSCSupplied,
      USDCOnEthLocked,
      USDCOnBSCLocked,
      USDCOnAMBETHThinkLocked,
      USDCOnAMBBSCThinkLocked,
      BUSDOnEthLocked,
      BUSDOnAMBBSCThinkLocked,
    ]).then((res) => {
      setBalances(res);
    });
  };

  const handleSolBalances = async () => {
    const sAMBOnSOL = new ethers.Contract('0x8D3e03889bFCb859B2dBEB65C60a52Ad9523512c', ABI, providers[ambChainId]);
    const sAMBOnSOLLocked = sAMBOnSOL.balanceOf('0xfdbBEc1347B64c6eAc2cbabfc98D908AC2A91570');
    const sAMBOnSOLSupplied = getTokenTotalSupply('sambYmW5WDE3nmJLuUMHsZqJEdwqoFhGvsf6PVthu3a');

    const USDCOnSolLocked = getSolTokenBalance('usdcfEkwfCV5owknRwdZGWVSnaZjCdTmjLtmiG6P1GF', 'ambZMSUBvU8bLfxop5uupQd9tcafeJKea1KoyTv2yM1')
    const USDCOnAMB = new ethers.Contract('0xF7c8f345Ac1d29F13c16d8Ae34f534D9056E3FF2', ABI, providers[ambChainId]);
    const USDCOnAMBSOLThinkLocked = USDCOnAMB.bridgeBalances('0xF8493e24ca466442fA285ACfAFE2faa50B1AeF8d');

    const wSOLOnSolLocked = await getSolTokenBalance('So11111111111111111111111111111111111111112', 'ambZMSUBvU8bLfxop5uupQd9tcafeJKea1KoyTv2yM1')
    const wSOLOnAMB = new ethers.Contract('0x28559D10F1C1E0D74F7Cfbb0Bf48e75F605b73Ac', ABI, providers[ambChainId]);
    const USDwSOLOnAMBSOLThinkLocked = await wSOLOnAMB.bridgeBalanceOf('0xF8493e24ca466442fA285ACfAFE2faa50B1AeF8d');

    Promise.all([sAMBOnSOLLocked, sAMBOnSOLSupplied, USDCOnSolLocked, USDCOnAMBSOLThinkLocked, wSOLOnSolLocked, USDwSOLOnAMBSOLThinkLocked]).then(setSolBalances);
  };

  const getTokenAddress = (symbol, chainId) => {
    return tokens.find(
        (token) => token.symbol === symbol && token.chainId === chainId,
    )?.address;
  };
  return (
      balances && solBalances && (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {tableHeads.map((el) => (
                        <TableCell key={el}>{el}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>sAMB</TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[0], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[2], 18))}
                    </TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[1], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[3], 18))}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      {utils.formatEther(solBalances[0])}
                      /
                      {solBalances[1]}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>USDC</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[4], 6))}
                      /
                      {formatValue(utils.formatUnits(balances[6], 18))}
                    </TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[5], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[7], 18))}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      {solBalances[2]}
                      /
                      {utils.formatEther(solBalances[3])}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BUSD</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[8], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[9], 18))}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>wSOL</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {solBalances[4]}
                      /
                      {utils.formatEther(solBalances[5])}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
      )
  );
};

export default Balance;
