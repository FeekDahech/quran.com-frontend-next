/* eslint-disable react/no-multi-comp */
import React from "react";

import dynamic from "next/dynamic";

import useSyncReadingProgress from "./hooks/useSyncReadingProgress";
import ReadingPreferenceSwitcher from "./ReadingPreferenceSwitcher";
import TranslationView from "./TranslationView";
import QuizView from "./QuizView";

import QuranReaderStyles from "@/redux/types/QuranReaderStyles";
import { VersesResponse } from "types/ApiResponses";
import { QuranReaderDataType, ReadingPreference } from "types/QuranReader";

const ReadingView = dynamic(() => import("./ReadingView"));

interface Props {
  readingPreference: ReadingPreference;
  quranReaderStyles: QuranReaderStyles;
  quranReaderDataType: QuranReaderDataType;
  initialData: VersesResponse;
  resourceId: number | string;
}

const QuranReaderView: React.FC<Props> = ({
  readingPreference,
  quranReaderStyles,
  quranReaderDataType,
  initialData,
  resourceId,
}) => {
  useSyncReadingProgress({
    readingPreference,
  });

  if (readingPreference === ReadingPreference.Reading) {
    return (
      <>
        <ReadingPreferenceSwitcher />
        <ReadingView
          quranReaderStyles={quranReaderStyles}
          quranReaderDataType={quranReaderDataType}
          initialData={initialData}
          resourceId={resourceId}
        />
      </>
    );
  } else if (readingPreference === ReadingPreference.Quiz) {
    return (
      <>
        <ReadingPreferenceSwitcher />
        <QuizView
          quranReaderStyles={quranReaderStyles}
          quranReaderDataType={quranReaderDataType}
          initialData={initialData}
          resourceId={resourceId}
        />
      </>
    );
  }

  return (
    <>
      <ReadingPreferenceSwitcher />
      <TranslationView
        quranReaderStyles={quranReaderStyles}
        quranReaderDataType={quranReaderDataType}
        initialData={initialData}
        resourceId={resourceId}
      />
    </>
  );
};

export default QuranReaderView;
