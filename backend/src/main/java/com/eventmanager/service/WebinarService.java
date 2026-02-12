package com.eventmanager.service;

import com.eventmanager.model.Webinar;
import java.util.List;
import java.util.Optional;

public interface WebinarService {
    Webinar createWebinar(Webinar webinar);

    List<Webinar> getAllWebinars();

    Optional<Webinar> getWebinarById(String id);

    List<Webinar> getWebinarsByCollege(String collegeId);

    void deleteWebinar(String id);
}
