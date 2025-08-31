package com.example.Hotel_Project.Service;

import com.example.Hotel_Project.Dto.ReservationDto;
import com.example.Hotel_Project.Entity.*;
import com.example.Hotel_Project.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final PriceRepository priceRepository;
    private final HolidayRepository holidayRepository;
    private final SeasonRepository seasonRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomRepository roomRepository,
                              PriceRepository priceRepository,
                              HolidayRepository holidayRepository,
                              SeasonRepository seasonRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.priceRepository = priceRepository;
        this.holidayRepository = holidayRepository;
        this.seasonRepository = seasonRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public ReservationDto createReservation(ReservationDto dto) {
        if (!dto.getCheckInDate().isBefore(dto.getCheckOutDate())) {
            throw new IllegalArgumentException("체크인/체크아웃 날짜가 올바르지 않습니다.");
        }

        // 비관적 락으로 Room 로우 잠금
        Room room = roomRepository.findByIdForUpdate(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 기간 겹침 검증
        boolean overlap = reservationRepository.existsOverlap(
                room.getId(), dto.getCheckInDate(), dto.getCheckOutDate());
        if (overlap) {
            throw new IllegalArgumentException("해당 기간에 이미 예약이 존재합니다.");
        }

        // 요금 계산
        int total = computeTotalPrice(room.getId(), dto.getCheckInDate(), dto.getCheckOutDate());
        dto.setTotalPrice(total);

        Reservation reservation = dto.toEntity(room);
        reservationRepository.save(reservation);
        return ReservationDto.fromEntity(reservation);
    }

    private int computeTotalPrice(Integer roomId, LocalDate checkIn, LocalDate checkOut) {
        // 룸/시즌별 가격 목록
        List<Price> prices = priceRepository.findByRoom_Id(roomId);
        Map<Integer, Price> priceBySeasonId = prices.stream()
                .collect(Collectors.toMap(p -> p.getSeason().getId(), p -> p));

        // 시즌/휴일 미리 로드
        List<Season> seasons = seasonRepository.findAll();
        List<Holiday> holidays = holidayRepository.findAll();
        Set<LocalDate> holidaySet = holidays.stream()
                .map(h -> h.getHolidayDate().toLocalDate())
                .collect(Collectors.toSet());

        int sum = 0;
        for (LocalDate d = checkIn; d.isBefore(checkOut); d = d.plusDays(1)) {
            Integer seasonId = findSeasonIdForDate(seasons, d);
            Price price = priceBySeasonId.get(seasonId);
            if (price == null) throw new IllegalArgumentException("가격 정보가 없습니다. seasonId=" + seasonId);

            boolean isHoliday = holidaySet.contains(d) || d.getDayOfWeek() == DayOfWeek.SUNDAY;
            boolean isWeekend = (d.getDayOfWeek() == DayOfWeek.SATURDAY || d.getDayOfWeek() == DayOfWeek.SUNDAY);

            if (isHoliday)      sum += nvl(price.getHolidayPrice());
            else if (isWeekend) sum += nvl(price.getWeekendPrice());
            else                sum += nvl(price.getWeekdayPrice());
        }
        return sum;
    }

    private Integer findSeasonIdForDate(List<Season> seasons, LocalDate target) {
        for (Season s : seasons) {
            LocalDate start = s.getStartDate().toLocalDate();
            LocalDate end = s.getEndDate().toLocalDate();
            if ((target.isEqual(start) || target.isAfter(start)) &&
                (target.isEqual(end)   || target.isBefore(end))) {
                return s.getId();
            }
        }
        throw new IllegalArgumentException("해당 날짜에 맞는 시즌이 없습니다. date=" + target);
    }

    private int nvl(Integer v) { return v == null ? 0 : v; }
}
