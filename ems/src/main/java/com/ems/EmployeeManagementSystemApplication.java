package com.ems;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ems.modal.User;
import com.ems.repo.UserRepo;

import java.time.LocalDate;

@SpringBootApplication
public class EmployeeManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeManagementSystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner initUsers(UserRepo userRepo, PasswordEncoder passwordEncoder) {
		return args -> {
			// 1. Create ADMIN
			if (userRepo.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole(User.Role.ADMIN);
				admin.setActive(true);
				
				// New Fields
				admin.setMobileNumber("9876543210");
				admin.setAge(35);
				admin.setJoiningDate(LocalDate.now().minusYears(5));
				admin.setExperience(10.0);
				admin.setDepartment(User.Department.MANAGEMENT);
				admin.setEmploymentType(User.EmploymentType.FULL_TIME);

				userRepo.save(admin);
				System.out.println("✅ ADMIN Created (admin/admin123)");
			}

			// 2. Create MANAGER
			if (userRepo.findByUsername("manager").isEmpty()) {
				User manager = new User();
				manager.setUsername("manager");
				manager.setPassword(passwordEncoder.encode("manager123"));
				manager.setRole(User.Role.MANAGER);
				manager.setActive(true);
				
				// New Fields
				manager.setMobileNumber("9123456789");
				manager.setAge(30);
				manager.setJoiningDate(LocalDate.now().minusYears(3));
				manager.setExperience(7.5);
				manager.setDepartment(User.Department.IT);
				manager.setEmploymentType(User.EmploymentType.FULL_TIME);

				userRepo.save(manager);
				System.out.println("✅ MANAGER Created (manager/manager123)");
			}

			// 3. Create EMPLOYEE
			if (userRepo.findByUsername("employee").isEmpty()) {
				User employee = new User();
				employee.setUsername("employee");
				employee.setPassword(passwordEncoder.encode("employee123"));
				employee.setRole(User.Role.EMPLOYEE);
				// Assuming the Manager created above has ID 2 (auto-increment dependent, but safe for fresh DB)
				employee.setReportingId(2L); 
				employee.setActive(true);
				
				// New Fields
				employee.setMobileNumber("9988776655");
				employee.setAge(24);
				employee.setJoiningDate(LocalDate.now().minusMonths(6));
				employee.setExperience(2.0);
				employee.setDepartment(User.Department.DEVELOPMENT);
				employee.setEmploymentType(User.EmploymentType.CONTRACT);

				userRepo.save(employee);
				System.out.println("✅ EMPLOYEE Created (employee/employee123)");
			}
		};
	}
}