import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';

import cellStyles from './QuizViewCell.module.scss';
import skeletonStyles from './QuizViewSkeleton.module.scss';

import verseTextStyles from '@/components/Verse/VerseText.module.scss';
import Skeleton from '@/dls/Skeleton/Skeleton';
import { selectQuranReaderStyles } from '@/redux/slices/QuranReader/styles';
import { getFontClassName } from '@/utils/fontFaceHelper';
import { QuranFont } from 'types/QuranReader';

const QuizViewCellSkeleton: React.FC = () => {
  const { quranFont, quranTextFontScale, mushafLines } = useSelector(
    selectQuranReaderStyles,
    shallowEqual,
  );

  const isTajweedFont = quranFont === QuranFont.Tajweed;

  return (
    <div className={classNames(cellStyles.cellContainer, skeletonStyles.cellContainer)}>

      {/* We're not using VersePreview as Skeleton's children here 
      because it has layout shift problem when loading the font. Which is not ideal for skeleton */}
      <div className={cellStyles.contentContainer}>
        <Skeleton
          className={classNames(skeletonStyles.verseContainer, cellStyles.arabicVerseContainer, {
            [verseTextStyles[getFontClassName(quranFont, quranTextFontScale, mushafLines)]]:
              !isTajweedFont,
          })}
        />
      </div>
    </div>
  );
};

export default QuizViewCellSkeleton;
