import styles from "./site.module.css";

export default function ConsoleHead({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.consoleHead}>
      <div>
        <h1 className={styles.consoleTitle}>{title}</h1>
        <p className={styles.consoleLede}>{lede}</p>
      </div>
      {children ? <div className={styles.row}>{children}</div> : null}
    </div>
  );
}
