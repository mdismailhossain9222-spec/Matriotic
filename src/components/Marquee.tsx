export default function Marquee({
  items,
  speed = 38,
  reverse = false,
}: {
  items: string[];
  /** seconds per full loop */
  speed?: number;
  reverse?: boolean;
}) {
  const chunk = (
    <>
      {items.map((item) => (
        <span key={item} className="marquee-item">
          <span className="u-display marquee-word">{item}</span>
          <span className="marquee-diamond" aria-hidden />
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee" aria-hidden>
      <div
        className={`marquee-track${reverse ? " is-reverse" : ""}`}
        style={{ "--mq-speed": `${speed}s` } as React.CSSProperties}
      >
        <div className="marquee-chunk">{chunk}</div>
        <div className="marquee-chunk">{chunk}</div>
      </div>
    </div>
  );
}
