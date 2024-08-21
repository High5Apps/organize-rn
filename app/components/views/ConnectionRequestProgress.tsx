import React, { useEffect, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import {
  ConnectionPreview, getErrorMessage, Keys, QRCodeValue, useCurrentUser,
} from '../../model';
import { previewConnection } from '../../networking';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';

export const OTHER_ORG_ERROR_MESSAGE = "The code you scanned belongs to a member of another Org. You can't connect with people in other Orgs.";

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
  reviewFrameProvider, style,
}: Props) {
  const { groupKey, jwt: sharerJwt } = qrCodeValue;
  const { styles } = useStyles();
  const { RequestProgress, setLoading } = useRequestProgress();
  const [response, setResponse] = useState<ConnectionPreview>();

  const { currentUser } = useCurrentUser();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    const fetchRequestPreview = async () => {
      setLoading(true);

      try {
        const { decryptWithExposedKey } = Keys().aes;
        const { connectionPreview, errorMessage } = await previewConnection({
          decryptWithExposedKey, groupKey, sharerJwt,
        });

        if (!subscribed) { return; }

        if (errorMessage !== undefined) {
          onConnectionPreviewError?.(errorMessage);
        } else if (currentUser && currentUser.org
            && (currentUser.org.id !== connectionPreview.org.id)
        ) {
          onConnectionPreviewError?.(OTHER_ORG_ERROR_MESSAGE);
        } else {
          setResponse(connectionPreview);
          onConnectionPreview?.(connectionPreview);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        onConnectionPreviewError?.(errorMessage);
      }

      setLoading(false);
    };

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
  style: {},
};
