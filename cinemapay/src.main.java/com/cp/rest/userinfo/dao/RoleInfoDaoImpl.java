package com.cp.rest.userinfo.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cp.filter.BaseDao;

@Service("roleDao")
public class RoleInfoDaoImpl extends BaseDao{

	/**
	 * 新增角色
	 * 
	 * @param insertMap
	 */
	public Map<String, Object> insertRole(Map<String, Object> insertMap){
		getSqlSession().insert("role.insertRole", insertMap);
		return insertMap;
	}
	
	/**
	 * 修改角色信息
	 * 
	 * @param updateMap
	 */
	public Map<String, Object> updateRole(Map<String, Object> updateMap){
		getSqlSession().update("role.updateRole", updateMap);
		return updateMap;
	}
	
	/**
	 * 删除角色信息
	 * 
	 * @param deleteMap
	 */
	public Map<String, Object> deleteRole(Map<String, Object> paramMap){
		getSqlSession().delete("role.deleteRole", paramMap);
		return paramMap;
	}
	
	
	/**
	 * 查询角色列表
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getRoleList(Map<String, Object> paramMap){
		List<Map<String, Object>> roleList = getSqlSession().selectList("role.getRoleList", paramMap);
		return roleList;
	}
	
	/**
	 * 查询用户总数量
	 */
	public Map<String, Object> getRoleListCount(Map<String, Object> paramMap){
		Map<String, Object> countMap = getSqlSession().selectOne("role.getRoleListCount", paramMap);
		return countMap;
	}
	
	/**
	 * 查询角色列表
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getRoleInfo(Map<String, Object> paramMap){
		List<Map<String, Object>> roleList = getSqlSession().selectList("role.getRoleInfo", paramMap);
		return roleList;
	}
	
	/**
	 * 新增影院查询信息
	 * 
	 * @param insertMap
	 */
	public Map<String, Object> insertTheater(Map<String, Object> insertMap){
		insertMap.put("theatertype", "2");
		getSqlSession().insert("role.insertTheater", insertMap);
		return insertMap;
	}
	
	/**
	 * 查询影院列表
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> getTheater(Map<String, Object> paramMap){
		List<Map<String, Object>> theaterList = getSqlSession().selectList("role.getTheater", paramMap);
		return theaterList;
	}
	
	/**
	 * 查询角色是否被使用
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> checkRoleForUser(Map<String, Object> paramMap){
		List<Map<String, Object>> list = getSqlSession().selectList("role.checkRoleForUser", paramMap);
		return list;
	}
	
	/**
	 * 查询角色名称是否被使用
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> checkRepeatRoleName(Map<String, Object> paramMap){
		List<Map<String, Object>> list = getSqlSession().selectList("role.checkRepeatRoleName", paramMap);
		return list;
	}
}
