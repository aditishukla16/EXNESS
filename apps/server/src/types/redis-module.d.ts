
declare module "../../../../../ws/src/services/redis" {
  export const redisClient: any;
  export function initRedis(): Promise<void>;
  // add export default if your file exports default
  // export default any;
}
