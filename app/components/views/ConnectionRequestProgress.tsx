import React, { useEffect, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import useRequestProgress from './RequestProgress';
import { GENERIC_ERROR_MESSAGE } from '../../model';
import {
  ConnectionPreview, ErrorResponse, isErrorResponse, previewConnection,
} from '../../networking';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    frameButton: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      justifyContent: 'center',
      padding: spacing.m,
    },
  });
  return { styles };
};

type Props = {
  onConnectionPreview?: (connectionPreview: ConnectionPreview) => void;
  reviewFrameProvider: (response: ConnectionPreview) => JSX.Element;
  sharerJwt: string;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionRequestProgress({
  onConnectionPreview, reviewFrameProvider, sharerJwt, style,
}: Props) {
  const { styles } = useStyles();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();
  const [response, setResponse] = useState<ConnectionPreview>();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    const fetchRequestPreview = async () => {
      try {
        const responseOrError = await previewConnection({ sharerJwt });
        if (!subscribed) { return; }

        if (isErrorResponse(responseOrError)) {
          const { errorMessage } = ErrorResponse(responseOrError);
          setResult('error', errorMessage);
          return;
        }

        const connectionPreview = responseOrError;
        setResponse(connectionPreview);
        setResult('success');
        onConnectionPreview?.(connectionPreview);
      } catch (error) {
        console.error(error);
        setResult('error', GENERIC_ERROR_MESSAGE);
      }
    };

    setLoading(true);
    fetchRequestPreview();

    return unsubscribe;
  }, []);

  return (
    <View style={[styles.frameButton, style]}>
      { !response && <RequestProgress /> }
      { response && reviewFrameProvider(response) }
    </View>
  );
}

ConnectionRequestProgress.defaultProps = {
  onConnectionPreview: () => {},
  style: {},
};
