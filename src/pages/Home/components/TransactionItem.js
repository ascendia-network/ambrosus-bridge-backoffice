import React, { useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {BigNumber, utils} from 'ethers';
import {allNetworks} from '../../../utils/networks';
import {ambChainId} from "../../../utils/providers";

const TransactionItem = ({item}) => {
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);

  useEffect(async () => {
    setDestinationNetTxHash(
      item.status === 5 ? item.destinationTxHash : '',
    );
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear()}, ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  const getExplorerLink = (chainId) => {
    if (chainId === '6003100671677645902') {
      return `https://explorer.solana.com/tx`
    }
    const explorerLink = Object.values(allNetworks).find(
      (el) => el.chainId === chainId,
    );
    return explorerLink ? explorerLink.explorerUrl : null;
  };

  const cropAddress = (address) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`
  }

  return (
    <>
      <TableRow
        key={item.transactionHash}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <a href={`${getExplorerLink(item.chainId)}address/${item.userAddress}`} target="_blank">
            {cropAddress(item.userAddress)}
          </a>
          {item.userAddressTo && (
            <>
              {" "}|{" "}
              <a href={`${getExplorerLink(item.destChainId)}address/${item.userAddressTo}`} target="_blank">
                {cropAddress(item.userAddressTo)}
              </a>
            </>
          )}
        </TableCell>
        <TableCell>
          <a href={`${getExplorerLink(item.chainId)}address/${item.tokenFrom.address}`} target="_blank">
            {item.tokenFrom.name}
          </a>
          ->
          <a href={`${getExplorerLink(item.destChainId)}address/${item.tokenTo.address}`} target="_blank">
            {item.tokenTo.name}
          </a>
        </TableCell>
        <TableCell>{item.eventId}</TableCell>
        <TableCell>
          {item.denominatedAmount}
        </TableCell>
        <TableCell>
          {!item.feeTransfer ? '-' : utils.formatUnits(
            BigNumber.from(item.feeTransfer.toString())
              .add(BigNumber.from(item.feeBridge.toString())),
            18
          )}
        </TableCell>
        <TableCell>{formatDate(item.withdrawTx.txTimestamp)}</TableCell>
        <TableCell>
          {item.status}/5
        </TableCell>
      </TableRow>
    </>
  )
};

export default TransactionItem;
