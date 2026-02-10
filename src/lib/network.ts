import NetInfo from '@react-native-community/netinfo';

export const watchNetwork = (onChange: (online: boolean) => void): (() => void) => {
  return NetInfo.addEventListener((state) => {
    const online = Boolean(state.isConnected && state.isInternetReachable !== false);
    onChange(online);
  });
};

export const getNetworkState = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable !== false);
};
