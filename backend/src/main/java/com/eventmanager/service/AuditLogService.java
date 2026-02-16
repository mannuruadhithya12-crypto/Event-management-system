package com.eventmanager.service;

import com.eventmanager.model.AuditLog;
import com.eventmanager.model.User;
import com.eventmanager.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String action, String details, User actor, String entityType, String entityId) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setDetails(details);
        log.setActor(actor);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        auditLogRepository.save(log);
    }
}
