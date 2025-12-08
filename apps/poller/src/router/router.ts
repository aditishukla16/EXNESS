
import type { TradeData, KlineData } from "../type";
import { pub } from "../connectionredis/connectredis";

const bidPriceIncrementRate = 0.0005;
const askPriceDecrementRate = 0.0005;

// ------------------------------------------------------------------
// 1) TRADE STREAM HANDLER  -> live price + spread Redis me publish
// ------------------------------------------------------------------
export async function handleTrade(data: TradeData) {
  const fetchedPrice = Number(data.p); // trade price

  const bidPrice = fetchedPrice + fetchedPrice * bidPriceIncrementRate;
  const askPrice = fetchedPrice - fetchedPrice * askPriceDecrementRate;

  const symbol = data.s;
  const channel = `symbol:${symbol}`; // e.g. "symbol:BTCUSDT"

  try {
    await pub.publish(
      channel,
      JSON.stringify({
        price: fetchedPrice,
        bid: bidPrice,
        ask: askPrice,
      })
    );

    console.log("Published trade price ->", channel);
  } catch (err) {
    console.error("Redis publish error (trade):", err);
  }
}

// ------------------------------------------------------------------
// 2) KLINE STREAM HANDLER -> candles Redis list me store
// ------------------------------------------------------------------
export async function handleKline(data: KlineData) {
  const k = data.k;
  if (!k) return;

  // Sirf CLOSED candle store karo
  if (k.x !== true) return;

  const interval = k.i;                  // "1m", "5m", etc
  const symbol = k.s.replace("USDT", ""); // "BTCUSDT" -> "BTC"

  const key = `candles:${interval}:${symbol}`; // e.g. "candles:1m:BTC"

  const candle = {
    t: k.t,
    o: k.o,
    h: k.h,
    l: k.l,
    c: k.c,
    v: k.v,
  };

  try {
    // latest candle push
    await pub.lPush(key, JSON.stringify(candle));

    // sirf last 1000 candles rakho
    await pub.lTrim(key, 0, 999);

    // optional: 24h expiry
    await pub.expire(key, 60 * 60 * 24);

    console.log("Saved candle ->", key);
  } catch (err) {
    console.error("Redis save error (kline):", err);
  }
}
