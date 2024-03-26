import React from "react"

type Props = {
  children?: React.ReactNode
}

type State = {
  hasError: boolean
}

// イベントハンドラ内と非同期コードではエラーをキャッチできない
// 主にjs側のエラーをキャッチする
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // エラー発生時にstateを更新
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // エラーが発生した場合のフォールバックUIを表示
      return <h2>予期せぬエラーが発生しました。</h2>;
    }

    // 通常時はそのまま子コンポーネントをレンダリング
    return this.props.children;
  }
}

export default ErrorBoundary
