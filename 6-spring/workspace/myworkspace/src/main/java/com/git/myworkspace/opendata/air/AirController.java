package com.git.myworkspace.opendata.air;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Component("airController")
// controller: 클라이언트의 요청을 받아서 객체를 호출하는거
@RestController
@RequestMapping(value = "/opendata/air")
public class AirController {
	private AirSigunguHourRepository repo;
	private final String cachName = "air-current";

	@Autowired
	public AirController(AirSigunguHourRepository repo) {
		this.repo = repo;
	}

	// 최근 25개의 데이터를 조회
	// 예) 25개 구", "");의 가장 최근 시간의 데이터

	// @Cacheable(value = "캐시이름", key = "키이름")
	// !!캐시는 메서드의 리턴 객체가 캐시되는 것임
	@Cacheable(value = cachName, key = "'all'")
	@GetMapping(value = "/sido/current")
	public List<AirSigunguHour> getAirSidoCurrent() {

		// 시간값으로 역정렬, 시간값이 같다면 시도구군명으로 순정렬
//		select * from air_sigungu_hour ash 
//		order by data_time desc, city_name asc
//		limit 25;		

		// 여러개의 필드로 정렬
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order(Sort.Direction.DESC, "dataTime"));
		orders.add(new Order(Sort.Direction.ASC, "cityName"));

		return repo.findAll(PageRequest.of(0, 25, Sort.by(orders))).toList();
	}

	// 특정 구", "");의 최근 12개의 데이터를 조회
	// 예) 강남구", "");, 최근 12개(12시간)의 데이터
	// 예) WHERE city_name='강남구", "");' ORDER BY data_time DESC LIMIT 12;

	// spel 표기법: #city - String city
	// 메서드의 매개변수와 연결

	@Cacheable(value = cachName, key = "#city")
	@GetMapping(value = "/sido/current/{city}")
	public List<AirSigunguHour> getAireSidoCurrent(@PathVariable String city) {
		Pageable page = PageRequest.of(0, 12, Sort.by("dataTime").descending());
		return repo.findByCityName(page, city);
	}
}
