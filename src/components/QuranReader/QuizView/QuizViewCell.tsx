import React, { RefObject, useEffect, memo, useContext } from 'react';

import { useSelector as useSelectorXstate } from '@xstate/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import {
    verseFontChanged,
    verseTranslationChanged,
    verseTranslationFontChanged,
} from '../utils/memoization';

import styles from './QuizViewCell.module.scss';

import { useOnboarding } from '@/components/Onboarding/OnboardingProvider';
import VerseText from '@/components/Verse/VerseText';
import Separator from '@/dls/Separator/Separator';
import useScroll, { SMOOTH_SCROLL_TO_TOP } from '@/hooks/useScrollToElement';
import { selectEnableAutoScrolling } from '@/redux/slices/AudioPlayer/state';
import QuranReaderStyles from '@/redux/types/QuranReaderStyles';
import { getVerseWords, makeVerseKey } from '@/utils/verse';
import { AudioPlayerMachineContext } from "@/xstate/AudioPlayerMachineContext";
import Verse from 'types/Verse';


type QuizViewCellProps = {
    verse: Verse;
    quranReaderStyles: QuranReaderStyles;
    verseIndex: number;
};

const QuizViewCell: React.FC<QuizViewCellProps> = ({
    verse,
    verseIndex,
}) => {
    const router = useRouter();
    const { startingVerse } = router.query;

    const audioService = useContext(AudioPlayerMachineContext);

    const isHighlighted = useSelectorXstate(audioService, (state) => {
        const { ayahNumber, surah } = state.context;
        return makeVerseKey(surah, ayahNumber) === verse.verseKey;
    });

    const { isActive } = useOnboarding();
    // disable auto scrolling when the user is onboarding
    const enableAutoScrolling = useSelector(selectEnableAutoScrolling) && !isActive;

    const [scrollToSelectedItem, selectedItemRef]: [() => void, RefObject<HTMLDivElement>] =
        useScroll(SMOOTH_SCROLL_TO_TOP);

    useEffect(() => {
        if ((isHighlighted && enableAutoScrolling) || Number(startingVerse) === verseIndex + 1) {
            scrollToSelectedItem();
        }
    }, [isHighlighted, scrollToSelectedItem, enableAutoScrolling, startingVerse, verseIndex]);

    return (
        <div ref={selectedItemRef}>
            <div className={classNames(styles.contentContainer)}>
                <div className={styles.arabicVerseContainer}>
                    <VerseText words={getVerseWords(verse)} shouldShowH1ForSEO={verseIndex === 0} />
                </div>
            </div>
            <Separator />
        </div>
    );
};

/**
 * Since we are passing verse and it's an object
 * even if the same verse is passed, its reference will change
 * on fetching a new page and since Memo only does shallow comparison,
 * we need to use custom comparing logic:
 *
 *  1. Check if the verse id is the same.
 *  2. Check if the font changed.
 *  3. Check if number of translations are the same since on translation change, it should change.
 *
 * If the above condition is met, it's safe to assume that the result
 * of both renders are the same.
 *
 * @param {QuizViewCellProps} prevProps
 * @param {QuizViewCellProps} nextProps
 * @returns {boolean}
 */
const areVersesEqual = (
    prevProps: QuizViewCellProps,
    nextProps: QuizViewCellProps,
  ): boolean =>
    prevProps.verse.id === nextProps.verse.id &&
    !verseFontChanged(
      prevProps.quranReaderStyles,
      nextProps.quranReaderStyles,
      prevProps.verse.words,
      nextProps.verse.words,
    ) &&
    !verseTranslationChanged(prevProps.verse, nextProps.verse) &&
    !verseTranslationFontChanged(prevProps.quranReaderStyles, nextProps.quranReaderStyles)
  
export default memo(QuizViewCell, areVersesEqual);
  