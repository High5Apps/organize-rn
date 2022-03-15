import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import useTheme from '../../app/Theme';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const styles = StyleSheet.create({
  svgSquare: {
    width: '100%',
    aspectRatio: 1,
  },
});

function SvgComponent() {
  const theme = useTheme();
  const innerColor = theme.colors.primary;
  const outterColor = theme.colors.fillSecondary;
  return (
    <Svg
      viewBox="0 0 315 315"
      style={styles.svgSquare}
    >
      <G fill="none" fillRule="evenodd">
        <G transform="translate(220 220)" fill={outterColor}>
          <Circle cx={27.5} cy={87.5} r={7.5} />
          <Circle cx={67.5} cy={67.5} r={7.5} />
          <Circle cx={67.5} cy={47.5} r={7.5} />
          <Circle cx={67.5} cy={87.5} r={7.5} />
          <Circle cx={47.5} cy={67.5} r={7.5} />
          <Circle cx={47.5} cy={87.5} r={7.5} />
          <Circle cx={7.5} cy={87.5} r={7.5} />
          <Circle cx={87.5} cy={27.5} r={7.5} />
          <Circle cx={87.5} cy={67.5} r={7.5} />
          <Circle cx={87.5} cy={47.5} r={7.5} />
          <Circle cx={87.5} cy={7.5} r={7.5} />
          <Circle cx={87.5} cy={87.5} r={7.5} />
        </G>
        <G transform="translate(0 220)" fill={outterColor}>
          <Circle cx={7.5} cy={27.5} r={7.5} />
          <Circle cx={7.5} cy={67.5} r={7.5} />
          <Circle cx={7.5} cy={47.5} r={7.5} />
          <Circle cx={7.5} cy={7.5} r={7.5} />
          <Circle cx={7.5} cy={87.5} r={7.5} />
          <Circle cx={87.5} cy={87.5} r={7.5} />
          <Circle cx={47.5} cy={67.5} r={7.5} />
          <Circle cx={47.5} cy={87.5} r={7.5} />
          <Circle cx={27.5} cy={67.5} r={7.5} />
          <Circle cx={27.5} cy={47.5} r={7.5} />
          <Circle cx={27.5} cy={87.5} r={7.5} />
          <Circle cx={67.5} cy={87.5} r={7.5} />
        </G>
        <G transform="translate(220)" fill={outterColor}>
          <Circle cx={27.5} cy={7.5} r={7.5} />
          <Circle cx={67.5} cy={7.5} r={7.5} />
          <Circle cx={67.5} cy={47.5} r={7.5} />
          <Circle cx={67.5} cy={27.5} r={7.5} />
          <Circle cx={47.5} cy={7.5} r={7.5} />
          <Circle cx={47.5} cy={27.5} r={7.5} />
          <Circle cx={7.5} cy={7.5} r={7.5} />
          <Circle cx={87.5} cy={7.5} r={7.5} />
          <Circle cx={87.5} cy={87.5} r={7.5} />
          <Circle cx={87.5} cy={47.5} r={7.5} />
          <Circle cx={87.5} cy={27.5} r={7.5} />
          <Circle cx={87.5} cy={67.5} r={7.5} />
        </G>
        <G fill={outterColor}>
          <Circle cx={7.5} cy={7.5} r={7.5} />
          <Circle cx={7.5} cy={87.5} r={7.5} />
          <Circle cx={7.5} cy={47.5} r={7.5} />
          <Circle cx={7.5} cy={27.5} r={7.5} />
          <Circle cx={7.5} cy={67.5} r={7.5} />
          <Circle cx={87.5} cy={7.5} r={7.5} />
          <Circle cx={47.5} cy={7.5} r={7.5} />
          <Circle cx={47.5} cy={27.5} r={7.5} />
          <Circle cx={27.5} cy={7.5} r={7.5} />
          <Circle cx={27.5} cy={47.5} r={7.5} />
          <Circle cx={27.5} cy={27.5} r={7.5} />
          <Circle cx={67.5} cy={7.5} r={7.5} />
        </G>
        <G fill={innerColor}>
          <Circle cx={7.5} cy={167.5} r={7.5} />
          <Circle cx={167.5} cy={7.5} r={7.5} />
          <Circle cx={167.5} cy={167.5} r={7.5} />
          <Circle cx={167.5} cy={87.5} r={7.5} />
          <Circle cx={167.5} cy={247.5} r={7.5} />
          <Circle cx={7.5} cy={207.5} r={7.5} />
          <Circle cx={167.5} cy={47.5} r={7.5} />
          <Circle cx={167.5} cy={207.5} r={7.5} />
          <Circle cx={7.5} cy={127.5} r={7.5} />
          <Circle cx={167.5} cy={127.5} r={7.5} />
          <Circle cx={167.5} cy={287.5} r={7.5} />
          <Circle cx={7.5} cy={187.5} r={7.5} />
          <Circle cx={167.5} cy={27.5} r={7.5} />
          <Circle cx={167.5} cy={187.5} r={7.5} />
          <Circle cx={7.5} cy={107.5} r={7.5} />
          <Circle cx={167.5} cy={107.5} r={7.5} />
          <Circle cx={167.5} cy={267.5} r={7.5} />
          <Circle cx={167.5} cy={67.5} r={7.5} />
          <Circle cx={167.5} cy={227.5} r={7.5} />
          <Circle cx={7.5} cy={147.5} r={7.5} />
          <Circle cx={167.5} cy={147.5} r={7.5} />
          <Circle cx={167.5} cy={307.5} r={7.5} />
          <Circle cx={87.5} cy={167.5} r={7.5} />
          <Circle cx={247.5} cy={167.5} r={7.5} />
          <Circle cx={87.5} cy={87.5} r={7.5} />
          <Circle cx={87.5} cy={247.5} r={7.5} />
          <Circle cx={247.5} cy={87.5} r={7.5} />
          <Circle cx={247.5} cy={247.5} r={7.5} />
          <Circle cx={87.5} cy={47.5} r={7.5} />
          <Circle cx={87.5} cy={207.5} r={7.5} />
          <Circle cx={247.5} cy={47.5} r={7.5} />
          <Circle cx={247.5} cy={207.5} r={7.5} />
          <Circle cx={87.5} cy={127.5} r={7.5} />
          <Circle cx={87.5} cy={287.5} r={7.5} />
          <Circle cx={247.5} cy={127.5} r={7.5} />
          <Circle cx={247.5} cy={287.5} r={7.5} />
          <Circle cx={87.5} cy={27.5} r={7.5} />
          <Circle cx={87.5} cy={187.5} r={7.5} />
          <Circle cx={247.5} cy={27.5} r={7.5} />
          <Circle cx={247.5} cy={187.5} r={7.5} />
          <Circle cx={87.5} cy={107.5} r={7.5} />
          <Circle cx={87.5} cy={267.5} r={7.5} />
          <Circle cx={247.5} cy={107.5} r={7.5} />
          <Circle cx={247.5} cy={267.5} r={7.5} />
          <Circle cx={87.5} cy={67.5} r={7.5} />
          <Circle cx={87.5} cy={227.5} r={7.5} />
          <Circle cx={247.5} cy={67.5} r={7.5} />
          <Circle cx={247.5} cy={227.5} r={7.5} />
          <Circle cx={87.5} cy={147.5} r={7.5} />
          <Circle cx={247.5} cy={147.5} r={7.5} />
          <Circle cx={47.5} cy={167.5} r={7.5} />
          <Circle cx={207.5} cy={7.5} r={7.5} />
          <Circle cx={207.5} cy={167.5} r={7.5} />
          <Circle cx={47.5} cy={87.5} r={7.5} />
          <Circle cx={47.5} cy={247.5} r={7.5} />
          <Circle cx={207.5} cy={87.5} r={7.5} />
          <Circle cx={207.5} cy={247.5} r={7.5} />
          <Circle cx={47.5} cy={47.5} r={7.5} />
          <Circle cx={47.5} cy={207.5} r={7.5} />
          <Circle cx={207.5} cy={47.5} r={7.5} />
          <Circle cx={207.5} cy={207.5} r={7.5} />
          <Circle cx={47.5} cy={127.5} r={7.5} />
          <Circle cx={207.5} cy={127.5} r={7.5} />
          <Circle cx={207.5} cy={287.5} r={7.5} />
          <Circle cx={47.5} cy={187.5} r={7.5} />
          <Circle cx={207.5} cy={27.5} r={7.5} />
          <Circle cx={207.5} cy={187.5} r={7.5} />
          <Circle cx={47.5} cy={107.5} r={7.5} />
          <Circle cx={47.5} cy={267.5} r={7.5} />
          <Circle cx={207.5} cy={107.5} r={7.5} />
          <Circle cx={207.5} cy={267.5} r={7.5} />
          <Circle cx={47.5} cy={67.5} r={7.5} />
          <Circle cx={47.5} cy={227.5} r={7.5} />
          <Circle cx={207.5} cy={67.5} r={7.5} />
          <Circle cx={207.5} cy={227.5} r={7.5} />
          <Circle cx={47.5} cy={147.5} r={7.5} />
          <Circle cx={207.5} cy={147.5} r={7.5} />
          <Circle cx={207.5} cy={307.5} r={7.5} />
          <Circle cx={127.5} cy={7.5} r={7.5} />
          <Circle cx={127.5} cy={167.5} r={7.5} />
          <Circle cx={287.5} cy={167.5} r={7.5} />
          <Circle cx={127.5} cy={87.5} r={7.5} />
          <Circle cx={127.5} cy={247.5} r={7.5} />
          <Circle cx={287.5} cy={87.5} r={7.5} />
          <Circle cx={287.5} cy={247.5} r={7.5} />
          <Circle cx={127.5} cy={47.5} r={7.5} />
          <Circle cx={127.5} cy={207.5} r={7.5} />
          <Circle cx={287.5} cy={207.5} r={7.5} />
          <Circle cx={127.5} cy={127.5} r={7.5} />
          <Circle cx={127.5} cy={287.5} r={7.5} />
          <Circle cx={287.5} cy={127.5} r={7.5} />
          <Circle cx={127.5} cy={27.5} r={7.5} />
          <Circle cx={127.5} cy={187.5} r={7.5} />
          <Circle cx={287.5} cy={187.5} r={7.5} />
          <Circle cx={127.5} cy={107.5} r={7.5} />
          <Circle cx={127.5} cy={267.5} r={7.5} />
          <Circle cx={287.5} cy={107.5} r={7.5} />
          <Circle cx={127.5} cy={67.5} r={7.5} />
          <Circle cx={127.5} cy={227.5} r={7.5} />
          <Circle cx={287.5} cy={67.5} r={7.5} />
          <Circle cx={287.5} cy={227.5} r={7.5} />
          <Circle cx={127.5} cy={147.5} r={7.5} />
          <Circle cx={127.5} cy={307.5} r={7.5} />
          <Circle cx={287.5} cy={147.5} r={7.5} />
          <Circle cx={27.5} cy={167.5} r={7.5} />
          <Circle cx={187.5} cy={7.5} r={7.5} />
          <Circle cx={187.5} cy={167.5} r={7.5} />
          <Circle cx={27.5} cy={87.5} r={7.5} />
          <Circle cx={27.5} cy={247.5} r={7.5} />
          <Circle cx={187.5} cy={87.5} r={7.5} />
          <Circle cx={187.5} cy={247.5} r={7.5} />
          <Circle cx={27.5} cy={207.5} r={7.5} />
          <Circle cx={187.5} cy={47.5} r={7.5} />
          <Circle cx={187.5} cy={207.5} r={7.5} />
          <Circle cx={27.5} cy={127.5} r={7.5} />
          <Circle cx={187.5} cy={127.5} r={7.5} />
          <Circle cx={187.5} cy={287.5} r={7.5} />
          <Circle cx={27.5} cy={187.5} r={7.5} />
          <Circle cx={187.5} cy={27.5} r={7.5} />
          <Circle cx={187.5} cy={187.5} r={7.5} />
          <Circle cx={27.5} cy={107.5} r={7.5} />
          <Circle cx={187.5} cy={107.5} r={7.5} />
          <Circle cx={187.5} cy={267.5} r={7.5} />
          <Circle cx={27.5} cy={67.5} r={7.5} />
          <Circle cx={27.5} cy={227.5} r={7.5} />
          <Circle cx={187.5} cy={67.5} r={7.5} />
          <Circle cx={187.5} cy={227.5} r={7.5} />
          <Circle cx={27.5} cy={147.5} r={7.5} />
          <Circle cx={187.5} cy={147.5} r={7.5} />
          <Circle cx={187.5} cy={307.5} r={7.5} />
          <Circle cx={107.5} cy={7.5} r={7.5} />
          <Circle cx={107.5} cy={167.5} r={7.5} />
          <Circle cx={267.5} cy={167.5} r={7.5} />
          <Circle cx={107.5} cy={87.5} r={7.5} />
          <Circle cx={107.5} cy={247.5} r={7.5} />
          <Circle cx={267.5} cy={87.5} r={7.5} />
          <Circle cx={267.5} cy={247.5} r={7.5} />
          <Circle cx={107.5} cy={47.5} r={7.5} />
          <Circle cx={107.5} cy={207.5} r={7.5} />
          <Circle cx={267.5} cy={47.5} r={7.5} />
          <Circle cx={267.5} cy={207.5} r={7.5} />
          <Circle cx={107.5} cy={127.5} r={7.5} />
          <Circle cx={107.5} cy={287.5} r={7.5} />
          <Circle cx={267.5} cy={127.5} r={7.5} />
          <Circle cx={107.5} cy={27.5} r={7.5} />
          <Circle cx={107.5} cy={187.5} r={7.5} />
          <Circle cx={267.5} cy={187.5} r={7.5} />
          <Circle cx={107.5} cy={107.5} r={7.5} />
          <Circle cx={107.5} cy={267.5} r={7.5} />
          <Circle cx={267.5} cy={107.5} r={7.5} />
          <Circle cx={267.5} cy={267.5} r={7.5} />
          <Circle cx={107.5} cy={67.5} r={7.5} />
          <Circle cx={107.5} cy={227.5} r={7.5} />
          <Circle cx={267.5} cy={67.5} r={7.5} />
          <Circle cx={267.5} cy={227.5} r={7.5} />
          <Circle cx={107.5} cy={147.5} r={7.5} />
          <Circle cx={107.5} cy={307.5} r={7.5} />
          <Circle cx={267.5} cy={147.5} r={7.5} />
          <Circle cx={67.5} cy={167.5} r={7.5} />
          <Circle cx={227.5} cy={167.5} r={7.5} />
          <Circle cx={67.5} cy={87.5} r={7.5} />
          <Circle cx={67.5} cy={247.5} r={7.5} />
          <Circle cx={227.5} cy={87.5} r={7.5} />
          <Circle cx={227.5} cy={247.5} r={7.5} />
          <Circle cx={67.5} cy={47.5} r={7.5} />
          <Circle cx={67.5} cy={207.5} r={7.5} />
          <Circle cx={227.5} cy={47.5} r={7.5} />
          <Circle cx={227.5} cy={207.5} r={7.5} />
          <Circle cx={67.5} cy={127.5} r={7.5} />
          <Circle cx={67.5} cy={287.5} r={7.5} />
          <Circle cx={227.5} cy={127.5} r={7.5} />
          <Circle cx={227.5} cy={287.5} r={7.5} />
          <Circle cx={67.5} cy={27.5} r={7.5} />
          <Circle cx={67.5} cy={187.5} r={7.5} />
          <Circle cx={227.5} cy={27.5} r={7.5} />
          <Circle cx={227.5} cy={187.5} r={7.5} />
          <Circle cx={67.5} cy={107.5} r={7.5} />
          <Circle cx={67.5} cy={267.5} r={7.5} />
          <Circle cx={227.5} cy={107.5} r={7.5} />
          <Circle cx={227.5} cy={267.5} r={7.5} />
          <Circle cx={67.5} cy={67.5} r={7.5} />
          <Circle cx={67.5} cy={227.5} r={7.5} />
          <Circle cx={227.5} cy={67.5} r={7.5} />
          <Circle cx={227.5} cy={227.5} r={7.5} />
          <Circle cx={67.5} cy={147.5} r={7.5} />
          <Circle cx={227.5} cy={147.5} r={7.5} />
          <Circle cx={147.5} cy={7.5} r={7.5} />
          <Circle cx={147.5} cy={167.5} r={7.5} />
          <Circle cx={307.5} cy={167.5} r={7.5} />
          <Circle cx={147.5} cy={87.5} r={7.5} />
          <Circle cx={147.5} cy={247.5} r={7.5} />
          <Circle cx={147.5} cy={47.5} r={7.5} />
          <Circle cx={147.5} cy={207.5} r={7.5} />
          <Circle cx={307.5} cy={207.5} r={7.5} />
          <Circle cx={147.5} cy={127.5} r={7.5} />
          <Circle cx={147.5} cy={287.5} r={7.5} />
          <Circle cx={307.5} cy={127.5} r={7.5} />
          <Circle cx={147.5} cy={27.5} r={7.5} />
          <Circle cx={147.5} cy={187.5} r={7.5} />
          <Circle cx={307.5} cy={187.5} r={7.5} />
          <Circle cx={147.5} cy={107.5} r={7.5} />
          <Circle cx={147.5} cy={267.5} r={7.5} />
          <Circle cx={307.5} cy={107.5} r={7.5} />
          <Circle cx={147.5} cy={67.5} r={7.5} />
          <Circle cx={147.5} cy={227.5} r={7.5} />
          <Circle cx={147.5} cy={147.5} r={7.5} />
          <Circle cx={147.5} cy={307.5} r={7.5} />
          <Circle cx={307.5} cy={147.5} r={7.5} />
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
