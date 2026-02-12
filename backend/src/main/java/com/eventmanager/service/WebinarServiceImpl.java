package com.eventmanager.service;

import com.eventmanager.model.Webinar;
import com.eventmanager.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WebinarServiceImpl implements WebinarService {

    @Autowired
    private WebinarRepository webinarRepository;

    @Override
    public Webinar createWebinar(Webinar webinar) {
        return webinarRepository.save(webinar);
    }

    @Override
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    @Override
    public Optional<Webinar> getWebinarById(String id) {
        return webinarRepository.findById(id);
    }

    @Override
    public List<Webinar> getWebinarsByCollege(String collegeId) {
        return webinarRepository.findByCollegeId(collegeId);
    }

    @Override
    public void deleteWebinar(String id) {
        webinarRepository.deleteById(id);
    }
}
