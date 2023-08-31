import { ForwardedRef, useImperativeHandle } from 'react';
import { VisNetworkRef } from 'react-native-vis-network';

export type OrgGraphRef = Pick<VisNetworkRef, 'focus'>;

const focusNoOp: VisNetworkRef['focus'] = () => {};

export default function useOrgGraphRef(
  ref: ForwardedRef<OrgGraphRef>,
  visNetworkRef: VisNetworkRef | null,
) {
  useImperativeHandle(
    ref,
    () => {
      const { focus } = visNetworkRef ?? { focus: focusNoOp };
      return { focus };
    },
    [visNetworkRef],
  );
}
