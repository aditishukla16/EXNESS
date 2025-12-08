import dotenv from "dotenv";
dotenv.config();

import WebSocket from "ws"; //Binance se live data lene ke liye
import type { TradeData, KlineData } from "./type"; //typescript types
import { connectRedis } from "./connectionredis/connectredis"; // redis se connection
import { handleTrade, handleKline } from "./router/router"; //data ko process krne vale functions

const symbol = "btcusdt"; // Binance se BTC/USDT ka data lana hai.

// ---- TRADE STREAM (live ticks) ----
const tradeWS = new WebSocket(
  `wss://stream.binance.com:9443/ws/${symbol}@trade` //Yeh har trade ka data deta hai.Real-time me price move hota hai na?Wo data yahan aayega

);

// ---- KLINE STREAM (1m candles) ----//Yeh 1-minute candle ka data deta hai:open,high,low,close,volume//Candle chart banane ke liye perfect.
const klineWS = new WebSocket(
  `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`
);

// Redis connection
connectRedis(); //Redis ek fast storage hai.Is line se Redis se connection ban jata hai.

// -------------------------- TRADE HANDLER --------------------------
tradeWS.on("open", () => {
  console.log("Connected to Binance TRADE stream");  //Binance se connection ho gaya
});

tradeWS.on("message", async (msg) => {    
  try {
    const data: TradeData = JSON.parse(msg.toString());              //Binance se message aaya,Usko JSON me convert kiya,handleTrade() ko bhej diya
    await handleTrade(data);
  } catch (err) {
    console.error("Error in tradeWS message handler:", err);
  }
});

// -------------------------- KLINE HANDLER --------------------------
klineWS.on("open", () => {
  console.log("Connected to Binance KLINE stream");
});

klineWS.on("message", async (msg) => {
  try {
    const data: KlineData = JSON.parse(msg.toString());
    await handleKline(data);
  } catch (err) {
    console.error("Error in klineWS message handler:", err);
  }
});
