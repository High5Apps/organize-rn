import React, { useEffect, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import useRequestProgress from './RequestProgress';
import {
  GENERIC_ERROR_MESSAGE, OTHER_ORG_ERROR_MESSAGE, useUserContext,
} from '../../model';
import {
  ConnectionPreview, ErrorResponse, isErrorResponse, previewConnection,
} from '../../networking';
import useTheme from '../../Theme';

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

  const { currentUser } = useUserContext();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    const fetchRequestPreview = async () => {
      try {
        const responseOrError = await previewConnection({ sharerJwt });
        if (!subscribed) { return; }

        if (isErrorResponse(responseOrError)) {
          const { errorMessage } = ErrorResponse(responseOrError);
          setResult('error', { message: errorMessage });
          return;
        }

        const connectionPreview = responseOrError;

        if (currentUser && currentUser.org) {
          if (currentUser.org.id !== connectionPreview.org.id) {
            setResult('error', { message: OTHER_ORG_ERROR_MESSAGE });
            return;
          }
        }

        setResponse(connectionPreview);
        setResult('success');
        onConnectionPreview?.(connectionPreview);
      } catch (error) {
        console.error(error);
        setResult('error', { message: GENERIC_ERROR_MESSAGE });
      }
    };

    setLoading(true);
    fetchRequestPreview();

    return unsubscribe;
  }, [currentUser]);

  return (
    <View style={[styles.container, style]}>
      { !response && <RequestProgress /> }
      { response && reviewFrameProvider(response) }
    </View>
  );
}

ConnectionRequestProgress.defaultProps = {
  onConnectionPreview: () => {},
  style: {},
};
