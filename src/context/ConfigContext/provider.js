import React, { useEffect, useState } from 'react';
import ConfigMock from '../../utils/bridge-config.json';
import ConfigContext from './context';
import formatTokenListFromConfig from '../../utils/formatTokenListFromConfig';
import formatBridgesFromConfig from '../../utils/formatBridgesFromConfig';

const ConfigProvider = (props) => {
  const [config, setConfig] = useState({});

  useEffect(async () => {
    const { tokens, bridges } = await fetch(
      process.env.REACT_APP_CONFIG_URL,
    ).then((res) => (res.status <= 400 ? res.json() : ConfigMock));

    const formattedTokens = formatTokenListFromConfig(tokens);
    const formattedBridges = formatBridgesFromConfig(bridges);

    setConfig({ tokens: formattedTokens, bridges: formattedBridges });
  }, []);

  return <ConfigContext.Provider value={config} {...props} />;
};

export default ConfigProvider;
