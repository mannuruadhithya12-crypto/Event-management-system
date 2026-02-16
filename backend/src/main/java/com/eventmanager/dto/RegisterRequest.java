package com.eventmanager.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String collegeId;
    private String department;
    private Integer year;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    private String directorRole;

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getDirectorRole() {
        return directorRole;
    }

    public void setDirectorRole(String directorRole) {
        this.directorRole = directorRole;
    }

    private String subRole;
    private Integer academicYear;
    private String facultySubRole;

    public String getSubRole() {
        return subRole;
    }

    public void setSubRole(String subRole) {
        this.subRole = subRole;
    }

    public Integer getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(Integer academicYear) {
        this.academicYear = academicYear;
    }

    public String getFacultySubRole() {
        return facultySubRole;
    }

    public void setFacultySubRole(String facultySubRole) {
        this.facultySubRole = facultySubRole;
    }
}
