package com.cp.rest.managedata.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cp.filter.BaseDao;

@Service("manageDataDao")
public class ManageDataDaoImpl extends BaseDao
{

	/**
	 * 根据批次卡名称查询批次信息
	 */
	public List< Map<String,Object>>findBatchByName(Map<String,Object> map){	
		return getSqlSession().selectList("manageData.findBatchByName",map);
	}
	
	/**
	 * 查询影院
	 */
	public List<Map<String,Object>> findCinema(String theatername){
		return getSqlSession().selectList("manageData.findCinema", theatername);
	}
	
     /**
      * 查询批次有多少条数据
      */
     public int findBatch_count(Map<String,Object>map){
    	 return getSqlSession().selectOne("manageData.findBatch_count",map);
     }
     
     /**
      * 查询可用影院（根据卡号）
      */
     public List<Map<String,Object>>findUsableCinema_cardnumber(Map<String,Object>map){
    	 return getSqlSession().selectList("manageData.findUsableCinema_cardnumber",map);
     }
     
     /**
      * 查询可用影院的条数(根据卡号 - cardnumber)
      */
     public int findUsableCinema_cardnumber_Count(Map<String,Object> map){
    	 return getSqlSession().selectOne("manageData.findUsableCinema_cardnumber_Count", map);
     }
     
	/**
	 * 卡详情
	 */
	public Map<String, Object> cardDeatil(String filter)
	{
		return getSqlSession().selectOne("manageData.cardDeatil", filter);
	}
     
     
     /**
      * 查询消费记录（全部）
      */
     public List<Map<String,Object>>findCardRecord_qb(Map<String,Object>map){
    	 return getSqlSession().selectList("manageData.findCardRecord_qb", map);
     }
     
     /**
      * 查询消费记录的条数（全部）
      */
     public int findCardRecord_qb_Count(Map<String,Object>map){
    	 return getSqlSession().selectOne("manageData.findCardRecord_qb_Count", map);
     }

	/**
	 * 鏌ヨ鍏ㄩ儴鎵规淇℃伅
	 */
     public List<Map<String,Object>> findAllBatch (String cardname){
    	 return getSqlSession().selectList("manageData.findAllBatch", cardname);
     }

//    /**
//     * @Title: cinemaBatchListTotal 
//     * @Description: 批次影院结算列表
//     * @param @param cardconfid
//     * @param @return
//     * @return int
//     * @throws
//     */
//    public int cinemaBatchListTotal(Map<String, Integer> param)
//	{
//    	 return getSqlSession().selectOne("manageData.cinemaBatchListTotal", param);
//	}
//	public List<Map<String, Object>> cinemaBatchList(Map<String, Integer> param)
//	{
//		 return getSqlSession().selectList("manageData.cinemaBatchList", param);
//	}
}