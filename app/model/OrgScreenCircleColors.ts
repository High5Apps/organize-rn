import { ThemeColors } from '../Theme';
import { getHighestOffice } from './Rank';

type GetCircleColorsProps = {
  colors: ThemeColors;
  isMe?: boolean;
  offices?: string[];
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
  const highestOfficeName = getHighestOffice(offices);
  let circleBackgroundColor: string;
  let circleBorderColor: string;
  let shadow: boolean;
  if (highestOfficeName) {
    circleBackgroundColor = officeColors[highestOfficeName];
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
