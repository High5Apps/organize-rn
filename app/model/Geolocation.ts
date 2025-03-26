import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';

const POSITION_TIMEOUT_MILLISECONDS = 30000;
const ANDROID_PERMISSION = 'android.permission.ACCESS_COARSE_LOCATION';

type PermissionStatus = 'denied' | 'granted' | 'unknown';

export default function useGeolocation() {
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [
    permissionStatus, setPermissionStatus,
  ] = useState<PermissionStatus>('unknown');

  useEffect(() => {
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
      skipPermissionRequests: true,
    });
  }, []);

  async function requestAuthorization(): Promise<PermissionStatus> {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(ANDROID_PERMISSION);
      if (!hasPermission) {
        const result = await PermissionsAndroid.request(ANDROID_PERMISSION, {
          title: 'Location Permission',
          message: 'Organize uses your location to help autocomplete your home address.',
          buttonPositive: 'OK',
        });

        if (result !== 'granted') {
          return 'denied';
        }
      }
    }

    try {
      await new Promise<void>(Geolocation.requestAuthorization);
      return 'granted';
    } catch (error) {
      console.error(error);
      return 'denied';
    }
  }

  function refreshPosition() {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
      },
      console.error,
      {
        enableHighAccuracy: false,
        timeout: POSITION_TIMEOUT_MILLISECONDS,
      },
    );
  }

  useEffect(() => {
    if (permissionStatus === 'unknown') {
      requestAuthorization()
        .then(setPermissionStatus)
        .catch(console.error);
    } else if (permissionStatus === 'granted') {
      refreshPosition();
    }
  }, [permissionStatus]);

  return {
    latitude,
    longitude,
    openPermissionSettings: async () => {
      await Linking.openSettings();

      // HACK: This timeout prevents an issue on physical Android devices where
      // sometimes settings wouldn't be launched. Sometimes it took 2-3 tries. I
      // think it was caused by a race between the system trying to launch
      // settings and the system also trying to redisplay the permissions
      // request dialog. The delay fixes things by postponing the state update
      // until the app is focused again, because timers are paused when the app
      // is not focused.
      setTimeout(() => {
        setPermissionStatus('unknown');
      }, 1000);
    },
    permissionStatus,
  };
}
