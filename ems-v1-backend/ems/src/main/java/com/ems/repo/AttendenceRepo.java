package com.ems.repo;

import com.ems.modal.Attendence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendenceRepo extends JpaRepository<Attendence, Long> {
    List<Attendence> findByUserId(Long userId);

    @Query("SELECT COUNT(a) > 0 FROM Attendence a WHERE a.userId = :userId " +
           "AND a.status != 'REJECTED' " + 
           "AND ( (a.startDate BETWEEN :start AND :end) OR (a.endDate BETWEEN :start AND :end) " +
           "OR (:start BETWEEN a.startDate AND a.endDate) )")
    boolean existsOverlappingRequest(@Param("userId") Long userId, 
                                     @Param("start") LocalDate start, 
                                     @Param("end") LocalDate end);
}