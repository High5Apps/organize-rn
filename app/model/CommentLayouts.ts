import { useEffect, useState } from 'react';
import { measureHeights } from '@bigbee.dev/react-native-measure-text-size';
import { Comment } from './types';
import { getSubtitle, useCommentRowStyles, useTextButtonStyles, useUpvoteControlStyles } from '../components';

export default function useCommentLayouts(comments: Comment[]) {
  const [heights, setHeights] = useState<number[]>([]);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const {
    containerPaddingStart, nestedMarginStart, screenWidth, separatorHeight,
    styles, upvoteControlWidth,
  } = useCommentRowStyles();
  // For some reason, this is very slightly off from the actual layout width
  // e.g. actual: 324.7272644042969, calculated: 324.72727272727275
  // Occasionally, this can cause the number of lines to be off, usually by 1
  const width = screenWidth - upvoteControlWidth - containerPaddingStart
    - styles.container.paddingEnd;

  const additionalVerticalSpacing = 2 * styles.container.paddingVertical
    + 2 * styles.innerContainer.paddingVertical + separatorHeight;
  // console.log({ additionalVerticalSpacing, nestedMarginStart, width });

  const { styles: textButtonStyles } = useTextButtonStyles();
  const { styles: upvoteControlStyles } = useUpvoteControlStyles();

  useEffect(() => {
    console.log('in useEffect');
    if (!comments.length) { return; }
    console.log('calculate heights');

    setReady(false);

    const titles = comments.map((c) => c.body);
    const subtitles = comments.map(getSubtitle);
    // TODO: Deeply nested comments don't have a reply button
    // Could make this simpler by just disabling/graying it
    const textButtons = comments.map(() => 'Reply');
    const scores = comments.map((c) => c.score.toString());

    // TODO: Will need to do this for each comment depth

    // Note that measureHeights returns ceil'd ints, so the rounding errors will
    // add up over time
    Promise.all([
      measureHeights({
        fontFamily: styles.title.fontFamily,
        fontSize: styles.title.fontSize,
        texts: titles,
        width,
      }),
      measureHeights({
        fontFamily: styles.subtitle.fontFamily,
        fontSize: styles.subtitle.fontSize,
        texts: subtitles,
        width,
      }),
      measureHeights({
        fontFamily: textButtonStyles.text.fontFamily,
        fontSize: textButtonStyles.text.fontSize,
        texts: textButtons,
        width,
      }),
      measureHeights({
        fontFamily: upvoteControlStyles.text.fontFamily,
        fontSize: upvoteControlStyles.text.fontSize,
        texts: scores,
        width, // This should really be upvoteControlStyles.button.width
      }),
    ]).then(([titleHeights, subtitleHeights, textButtonHeights, scoreHeights]) => {
      const textHeights = titleHeights.map((titleHeight, i) => (
        titleHeight + subtitleHeights[i] + textButtonHeights[i]
      ));
      const itemHeights = textHeights.map((th) => th + additionalVerticalSpacing);
      // console.log({
      //   itemHeights, textHeights, titleHeights, scoreHeights, subtitleHeights, textButtonHeights,
      // });

      // Height should be at least upvoteControlHeight
      const additionalUpvoteControlVerticalSpacing = (
        2 * upvoteControlStyles.button.height
          // styles.container.paddingVertical is added to both, could be applied after
          + 2 * styles.container.paddingVertical
      );
      const upvoteControlHeights = scoreHeights.map(
        (sh) => sh + additionalUpvoteControlVerticalSpacing,
      );

      const calculatedHeights = itemHeights.map((h, i) => Math.max(h, upvoteControlHeights[i]));
      console.log({ calculatedHeights });

      let sum = 0;
      const cumulativeSums = calculatedHeights.map((n) => {
        sum += n;
        return sum;
      });
      setOffsets(cumulativeSums);

      setHeights(calculatedHeights);
      setReady(true);
    });
  }, [comments]);

  return { heights, offsets, ready };
}
