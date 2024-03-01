import { ThemeColors } from '../Theme';
import { Office } from './types';

type GetCircleColorsProps = {
  colors: ThemeColors;
  isMe?: boolean;
  offices: Office[];
};

type GetCircleColorsReturn = {
  circleBorderColor: string | undefined;
  circleBackgroundColor: string;
  shadow: boolean;
};

export default function getCircleColors({
  colors, isMe, offices,
}: GetCircleColorsProps): GetCircleColorsReturn {
  const { fill, office: officeColors, primary } = colors;
  const highestOfficeCategory = offices[0]?.type;
  let circleBackgroundColor: string;
  let circleBorderColor: string;
  let shadow: boolean;
  if (highestOfficeCategory) {
    circleBackgroundColor = officeColors[highestOfficeCategory];
    circleBorderColor = circleBackgroundColor;
    shadow = true;
  } else if (isMe) {
    circleBackgroundColor = fill;
    circleBorderColor = primary;
    shadow = true;
  } else {
    circleBackgroundColor = primary;
    circleBorderColor = primary;
    shadow = false;
  }

  return { circleBorderColor, circleBackgroundColor, shadow };
}
