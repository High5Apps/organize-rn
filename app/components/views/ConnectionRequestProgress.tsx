import React, { JSX, useEffect, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import {
  ConnectionPreview, getErrorMessage, QRCodeValue, useConnection,
} from '../../model';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      justifyContent: 'center',
    },
  });
  return { styles };
};

type Props = {
  onConnectionPreview: (connectionPreview: ConnectionPreview) => void;
  onConnectionPreviewError: (errorMessage: string) => void;
  qrCodeValue: QRCodeValue;
  reviewFrameProvider: (response: ConnectionPreview) => JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionRequestProgress({
  onConnectionPreview, onConnectionPreviewError, qrCodeValue,
  reviewFrameProvider, style = {},
}: Props) {
  const { groupKey, jwt: sharerJwt } = qrCodeValue;
  const { styles } = useStyles();
  const { RequestProgress, setLoading } = useRequestProgress();
  const [response, setResponse] = useState<ConnectionPreview>();

  const { previewConnection } = useConnection({ sharerJwt });

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    const fetchRequestPreview = async () => {
      setLoading(true);

      try {
        const connectionPreview = await previewConnection({ groupKey });
        if (!subscribed) { return; }

        setResponse(connectionPreview);
        onConnectionPreview?.(connectionPreview);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        onConnectionPreviewError?.(errorMessage);
      }

      setLoading(false);
    };

    fetchRequestPreview();

    return unsubscribe;
  }, [previewConnection]);

  return (
    <View style={[styles.container, style]}>
      { !response && <RequestProgress /> }
      { response && reviewFrameProvider(response) }
    </View>
  );
}
