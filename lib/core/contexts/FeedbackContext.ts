import { createContext, useContext } from 'react';

import { Feedback } from '../types/Feedback';

type FeedbackContextProps = {
  feedback: Feedback | null;
  setFeedback: (f: Feedback | null) => void;
  isFeedbackVisible: boolean;
};

export const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined,
);

export const useFeedbackContext = () => {
  const feedbackContext = useContext(FeedbackContext);
  if (!feedbackContext)
    throw new Error(
      'No FeedbackContext.Provider found when calling useFeedbackContext.',
    );
  return feedbackContext;
};
