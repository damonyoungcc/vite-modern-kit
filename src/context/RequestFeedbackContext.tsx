import React, { createContext, useReducer, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { Spin, message } from "antd";

// 状态类型
interface FeedbackState {
  loading: boolean;
  error: string | null;
  loadingCount: number;
}

// 动作类型
type FeedbackAction =
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | { type: "SHOW_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

const FeedbackContext = createContext<{
  state: FeedbackState;
  dispatch: React.Dispatch<FeedbackAction>;
}>({
  state: { loading: false, error: null, loadingCount: 0 },
  dispatch: () => {},
});

function feedbackReducer(state: FeedbackState, action: FeedbackAction): FeedbackState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loadingCount: state.loadingCount + 1, loading: true };
    case "STOP_LOADING":
      const newCount = Math.max(0, state.loadingCount - 1);
      return { ...state, loadingCount: newCount, loading: newCount > 0 };
    case "SHOW_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(feedbackReducer, {
    loading: false,
    error: null,
    loadingCount: 0,
  });

  // 错误提示
  useEffect(() => {
    if (state.error) {
      message.error(state.error, 3, () => dispatch({ type: "CLEAR_ERROR" }));
    }
  }, [state.error]);

  return (
    <FeedbackContext.Provider value={{ state, dispatch }}>
      {state.loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.5)",
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);
