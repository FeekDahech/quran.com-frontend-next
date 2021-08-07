import React, { useMemo } from 'react';
import styled from 'styled-components';
import range from 'lodash/range';
import Button, { ButtonSize } from '../Button/Button';
import NextIcon from '../../../../public/icons/caret-forward.svg';
import PreviousIcon from '../../../../public/icons/caret-back.svg';

interface Props {
  currentPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  pageSize?: number;
  siblingsCount?: number;
  showSummary?: boolean;
}

const DOTS = '...';
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SIBLINGS_COUNT = 1;

/**
 * @param {number} start
 * @param {number} end
 * @returns {Number[]}
 */
const generateRange = (start: number, end: number): number[] => range(start, end + 1);
const Pagination: React.FC<Props> = ({
  onPageChange,
  totalCount,
  currentPage,
  pageSize = DEFAULT_PAGE_SIZE,
  siblingsCount = DEFAULT_SIBLINGS_COUNT,
  showSummary = true,
}) => {
  const paginationRange = useMemo(() => {
    // Math.ceil is used to round the number to the next higher integer value e.g. 0.7 gets rounded to 1, 1.1 gets rounded to 2. This ensures that we are reserving an extra page for the remaining data.
    const totalPageCount = Math.ceil(totalCount / pageSize);
    // Pages count is the sum of siblingsCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingsCount + 5;
    // if the page numbers we want to show is >= the actual number of pages we have (e.g. only pages 1, 2), we just return the range [1..totalPageCount] without any addition like the dots before and after and first and last page since the range is too small.
    if (totalPageNumbers >= totalPageCount) {
      return generateRange(1, totalPageCount);
    }
    // Calculate left and right siblings index and make sure they are within the range 1 => totalPageCount
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPageCount);
    // We do not want to show dots if there is only one position left after/before the left/right page count.
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;
    // No left dots to be shown, but the right dots should be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingsCount;
      const leftRange = generateRange(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }
    // No right dots to be shown, but the left dots should be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingsCount;
      const rightRange = generateRange(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    // the right and left dots should be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = generateRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    return [];
  }, [totalCount, pageSize, siblingsCount, currentPage]);

  if (currentPage === 0 || paginationRange.length < 1) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const showingUntilItem = currentPage * pageSize;
  return (
    <PaginationContainer>
      <ButtonContainer isSelected={false}>
        <Button
          disabled={currentPage === 1}
          size={ButtonSize.Small}
          icon={<PreviousIcon />}
          onClick={onPrevious}
        />
      </ButtonContainer>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <div>{DOTS}</div>;
        }

        return (
          <ButtonContainer isSelected={pageNumber === currentPage} key={pageNumber}>
            <Button
              size={ButtonSize.Small}
              text={pageNumber.toString()}
              onClick={() => onPageChange(pageNumber as number)}
            />
          </ButtonContainer>
        );
      })}
      <ButtonContainer isSelected={false}>
        <Button
          disabled={currentPage === paginationRange[paginationRange.length - 1]}
          size={ButtonSize.Small}
          icon={<NextIcon />}
          onClick={onNext}
        />
      </ButtonContainer>
      {showSummary && (
        <p>
          {showingUntilItem - (pageSize - 1)}-
          {totalCount < showingUntilItem ? totalCount : showingUntilItem} OF {totalCount} SEARCH
          RESULTS
        </p>
      )}
    </PaginationContainer>
  );
};

const ButtonContainer = styled.div<{ isSelected: boolean }>`
  margin: ${({ theme }) => theme.spacing.micro};
  ${({ isSelected, theme }) =>
    isSelected &&
    `background: ${theme.colors.background.fadedGreyScale}; border-radius: ${theme.borderRadiuses.circle};`}
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export default Pagination;