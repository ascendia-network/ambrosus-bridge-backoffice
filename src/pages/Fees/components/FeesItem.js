import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { BigNumber, utils } from 'ethers';
import formatAmount from '../../../utils/formatAmount';
import {ambChainId, bscChainId, ethChainId} from '../../../utils/providers';

const FeesItem = ({
  item,
  handleSelectedTxs,
  isOpen,
  tokensPrice,
  chains,
}) => {
  const currentFee = useMemo(() => {
    return item.transfers.reduce((totalBalance, el) => {
      return totalBalance.add(BigNumber.from(el.feeTransfer.toString().includes('+') ? '0' : el.feeTransfer.toString()));
    }, BigNumber.from(0));
  }, [item]);

  const handleTxOpen = () => {
    const chns = chains.split('/');

    let departureChainId = ambChainId;
    let destinationChainId = ambChainId;

    if (chns[0] === 'eth') {
      departureChainId = ethChainId;
    } else if (chns[0] === 'bsc') {
      departureChainId = bscChainId;
    }
    if (chns[1] === 'eth') {
      destinationChainId = ethChainId;
    } else if (chns[1] === 'bsc') {
      destinationChainId = bscChainId;
    }

    const txs = item.transfers.map((tx) => ({
      ...tx,
      chainId: departureChainId,
      destChainId: destinationChainId,
      eventId: item.eventId,
      destinationTxHash: item.transferFinishTx.txHash,
      status: item.status
    }))
    handleSelectedTxs(txs);
  }

  const leftUsd = useMemo(
    () =>
      (
        +formatAmount(utils.formatUnits(currentFee, 18)) * +tokensPrice[chains.split('/')[0] === 'amb' ? 'amb' : 'token']
      ).toFixed(2),
    [tokensPrice],
  );

  const rightUsd = useMemo(
    () =>
      (
        +formatAmount(utils.formatUnits((item.gasUsedByRelay[chains.split('/')[1]]?.toString() || '0'), 18)) * +tokensPrice[chains.split('/')[1] === 'amb' ? 'amb' : 'token']
      ).toFixed(2),
    [tokensPrice],
  );

  return (
    <TableRow
      sx={{ background: isOpen ? '#e2e2e2' : 'white' }}
      onClick={handleTxOpen}
    >
      <TableCell>#{item.eventId}</TableCell>
      <TableCell>
        {`${formatAmount(utils.formatUnits(currentFee, 18))} `}
        <span style={{ color: '#008000' }}>{`(${leftUsd}$)`}</span>
      </TableCell>
      <TableCell>
        {`${formatAmount(utils.formatUnits((item.gasUsedByRelay[chains.split('/')[1]]?.toString() || '0'), 18))}`}
        <span style={{ color: '#008000' }}>{` (${rightUsd}$)`}</span>
      </TableCell>
      <TableCell>{item.status === 5 ? 'Success' : 'Pending'}</TableCell>
    </TableRow>
  );
};

export default FeesItem;
