export function PowerTree() {
  return (
    <svg viewBox="0 0 720 320" className="h-auto w-full" role="img" aria-label="Power tree">
      <rect width="720" height="320" rx="12" fill="#f4f1e8" />
      <Box x={20} y={24} w={160} h={56} title="USB-C 5 V" sub="bench / laptop" fill="#d9ead3" />
      <Box x={200} y={24} w={160} h={56} title="Solar 6 V" sub="field daytime" fill="#fce5cd" />
      <Box x={380} y={24} w={160} h={56} title="12 V adapter" sub="pump + valve" fill="#cfe2f3" />
      <Box x={110} y={120} w={200} h={56} title="BQ24074 / PowerBoost" sub="charge + 5.2 V load" fill="#fff2cc" />
      <Box x={360} y={120} w={180} h={56} title="LiPo 3.7 V" sub="keep cool, not in sun" fill="#ead1dc" />
      <Box x={40} y={220} w={200} h={64} title="Nano ESP32 3.3 V I/O" sub="sensors, GPS, IMU, Wi-Fi" fill="#d9ead3" />
      <Box x={280} y={220} w={180} h={64} title="Relay / MOSFET" sub="GPIO only as signal" fill="#f8cbad" />
      <Box x={500} y={220} w={190} h={64} title="12 V pump + solenoid" sub="own GND star to 12 V PSU" fill="#cfe2f3" />
      <line x1="100" y1="80" x2="180" y2="120" stroke="#3d5c40" />
      <line x1="280" y1="80" x2="240" y2="120" stroke="#3d5c40" />
      <line x1="210" y1="176" x2="140" y2="220" stroke="#3d5c40" />
      <line x1="450" y1="176" x2="210" y2="148" stroke="#3d5c40" />
      <line x1="460" y1="80" x2="370" y2="220" stroke="#3d5c40" />
      <line x1="370" y1="252" x2="500" y2="252" stroke="#3d5c40" />
    </svg>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  fill: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke="#3d5c40" />
      <text x={x + 10} y={y + 24} fontSize="13" fontFamily="ui-sans-serif" fill="#1f3d2b">
        {title}
      </text>
      <text x={x + 10} y={y + 42} fontSize="11" fontFamily="ui-sans-serif" fill="#4d6a52">
        {sub}
      </text>
    </g>
  );
}

export function WiringSvg() {
  return (
    <svg viewBox="0 0 780 420" className="h-auto w-full" role="img" aria-label="Breadboard wiring">
      <rect width="780" height="420" rx="12" fill="#f7f4ea" />
      <rect x="280" y="40" width="220" height="120" rx="8" fill="#1f3d2b" />
      <text x="300" y="90" fill="#f4f1e8" fontSize="16">
        Nano ESP32
      </text>
      <text x="300" y="112" fill="#d9ead3" fontSize="11">
        USB-C · 3.3 V I/O
      </text>
      <Chip x={40} y={40} label="DHT22" sub="DATA → D2" />
      <Chip x={40} y={130} label="Soil Qwiic" sub="SDA/SCL A4/A5" />
      <Chip x={40} y={220} label="MPU-6050" sub="I²C 0x68" />
      <Chip x={40} y={310} label="NEO-6M GPS" sub="TX → RX D0" />
      <Chip x={560} y={40} label="YF-S201" sub="pulse → D5" />
      <Chip x={560} y={130} label="Rain (opt.)" sub="DO → D3" />
      <Chip x={560} y={220} label="Float level" sub="→ D4 pull-up" />
      <Chip x={560} y={310} label="Relay 12 V" sub="IN1 D6 / IN2 D7" />
      <line x1="180" y1="70" x2="280" y2="80" stroke="#c45c26" />
      <line x1="180" y1="160" x2="280" y2="100" stroke="#2a6f8f" />
      <line x1="180" y1="250" x2="300" y2="140" stroke="#2a6f8f" />
      <line x1="180" y1="340" x2="320" y2="150" stroke="#6b8f3d" />
      <line x1="560" y1="70" x2="500" y2="80" stroke="#c45c26" />
      <line x1="560" y1="160" x2="500" y2="100" stroke="#2a6f8f" />
      <line x1="560" y1="250" x2="500" y2="120" stroke="#6b8f3d" />
      <line x1="560" y1="340" x2="490" y2="140" stroke="#1f3d2b" />
      <text x="24" y="400" fontSize="11" fill="#4d6a52">
        Common GND (star) · 12 V PSU only to relay COM / pump · flyback diode on solenoid
      </text>
    </svg>
  );
}

function Chip({ x, y, label, sub }: { x: number; y: number; label: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={140} height={56} rx={8} fill="#fff" stroke="#3d5c40" />
      <text x={x + 10} y={y + 24} fontSize="13" fill="#1f3d2b">
        {label}
      </text>
      <text x={x + 10} y={y + 42} fontSize="11" fill="#4d6a52">
        {sub}
      </text>
    </g>
  );
}

export function ArchitectureSvg() {
  return (
    <svg viewBox="0 0 860 280" className="h-auto w-full" role="img" aria-label="Comms architecture">
      <rect width="860" height="280" rx="12" fill="#eef5ea" />
      <Node x={20} y={90} w={150} title="Sensors" sub="soil DHT flow GPS IMU" />
      <Node x={190} y={90} w={160} title="Nano ESP32" sub="JSON every 2 s" />
      <Node x={380} y={40} w={150} title="Wi-Fi MQTT" sub="robofarm/telemetry" />
      <Node x={380} y={150} w={150} title="BLE / LoRa" sub="rural fallback" />
      <Node x={560} y={90} w={140} title="Next.js API" sub="/api/telemetry mock" />
      <Node x={720} y={90} w={120} title="Dashboard" sub="poll 1.4 s" />
      <line x1="170" y1="118" x2="190" y2="118" stroke="#1f3d2b" />
      <line x1="350" y1="118" x2="380" y2="70" stroke="#1f3d2b" />
      <line x1="350" y1="118" x2="380" y2="180" stroke="#1f3d2b" />
      <line x1="530" y1="70" x2="560" y2="118" stroke="#1f3d2b" />
      <line x1="530" y1="180" x2="560" y2="118" stroke="#1f3d2b" />
      <line x1="700" y1="118" x2="720" y2="118" stroke="#1f3d2b" />
    </svg>
  );
}

function Node({
  x,
  y,
  w,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={70} rx={10} fill="#fff" stroke="#1f3d2b" />
      <text x={x + 12} y={y + 28} fontSize="14" fill="#1f3d2b">
        {title}
      </text>
      <text x={x + 12} y={y + 48} fontSize="11" fill="#4d6a52">
        {sub}
      </text>
    </g>
  );
}
