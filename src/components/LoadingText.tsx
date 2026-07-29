interface LoadingTextProps {
  label: string;
}

export function LoadingText({ label }: LoadingTextProps) {
  return <p className="state-text">{label}</p>;
}
