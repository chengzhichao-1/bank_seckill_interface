local pathKey = KEYS[1] -- 秒杀链接key
local orderKey = KEYS[2] -- 订单key
local userId = KEYS[3] -- 用户id
local activityKey = KEYS[4] -- 活动key
local path = KEYS[5] -- 秒杀链接

-- 判断专属秒杀链接是否正确
local pathValue = redis.call("GET", pathKey)
redis.call("DEL", pathKey)
if path ~= pathValue then
    return 2
end

-- 判断是否重复购买商品
local isPurchased = redis.call("SISMEMBER", orderKey, userId)
if tonumber(isPurchased) == 1 then
    return 3
end

-- 判断库存是否充足
local stock = redis.call("GET", activityKey)
if tonumber(stock) <= 0
then
    return 0
else
    redis.call("DECR", activityKey)
    redis.call("SADD", orderKey, userId)
    return 1
end
