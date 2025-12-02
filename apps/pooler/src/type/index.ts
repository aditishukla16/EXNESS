export type Data = {
  e: string,   // event type (like "trade", "kline", etc.)
  E: number,   // event timestamp (when Binance sent it)
  s: string,   // symbol (BTCUSDT, ETHUSDT)
  t: number,   // trade ID
  p: string,   // price in USDT per BTC (or whichever symbol)
  q: string,   // quantity traded
  T: number,   // trade timestamp
  m: boolean,  // is buyer the market maker?
  M: boolean   // ignore (Binance sends it but nobody uses it)
}
