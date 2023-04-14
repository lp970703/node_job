var target = `INSERT_-_-	INTO_-_-	BIEC.TM_PP_WXT_SP_LIVE_STREAM_CPTPP_POPU_-_-(W_TIMESTAMP,_-_-	SHOP_DOWNLOAD,_-_-	CONVENTION_CYCLE_D,_-_-        BID_METHOD,_-_-	CALDAY,_-_-	ORDER_NO,_-_-	PLAN_NAME,_-_-	WATCHS,_-_-	WATCH_COST,_-_-	COST,_-_-	INTERACTIONS,_-_-	INTERACTION_R,_-_-	AVG_WATCH_T,_-_-	CLICKS,_-_-	CLICK_R,_-_-	SUBSCRIBE_FANS,_-_-	PAY_ORDERS,_-_-	TRANSACTION_AMT,_-_-	CLT_PRODUCTS,_-_-	SCTS,_-_-	ROI,_-_-	LIVE_STREAM_LIKES,_-_-	LIVE_STREAM_SHARES,_-_-	LIVE_STREAM_COMMENTS,_-_-	PSL_ORDERS,_-_-	PSL_AMT,_-_-	BALANCE_RECHARGES,_-_-	BALANCE_RECHARGE_AMT,_-_-	PUTIN_CHANNEL)_-_-VALUES(CAST ('2023-01-11 00:00:00' AS TIMESTAMP),_-_-'百雀羚旗舰店',_-_-'15天',_-_-'直播看点',_-_-CAST ('2022-11-02' AS DATE),_-_-'3865201043',_-_-'超级直播专业版计划_帧颜套装1101',_-_-CAST ('801' AS INTEGER),_-_-CAST ('2.35895' AS DOUBLE),_-_-CAST ('1889.52229' AS DOUBLE),_-_-CAST ('381.00000' AS DOUBLE),_-_-CAST ('0.47570' AS DOUBLE),_-_-CAST ('79.51060' AS DOUBLE),_-_-CAST ('3' AS INTEGER),_-_-CAST ('3' AS DOUBLE),_-_-CAST ('58' AS INTEGER),_-_-CAST ('269' AS INTEGER),_-_-CAST ('0.33580' AS DOUBLE),_-_-CAST ('6' AS INTEGER),_-_-CAST ('15' AS INTEGER),_-_-CAST ('5199.29000' AS DOUBLE),_-_-CAST ('3' AS INTEGER),_-_-CAST ('42' AS DOUBLE),_-_-CAST ('2.75164' AS INTEGER),_-_-CAST ('0' AS INTEGER),_-_-CAST ('0.00000' AS DOUBLE),_-_-CAST ('0' AS INTEGER),_-_-CAST ('0' AS DOUBLE),_-_-'超级直播');_-_-`
var replaceText = '';

function replaceSql(target, replaceText) { 
  let reg = /_-_-/g
  let res = target.replace(reg, '');
  console.log(res);
}

replaceSql(target, replaceText);
