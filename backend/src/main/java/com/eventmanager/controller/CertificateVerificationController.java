package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.Certificate;
import com.eventmanager.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateVerificationController {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    /**
     * Public endpoint to verify certificate by ID and verification code
     */
    @GetMapping("/verify/{certificateId}/{verificationCode}")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificate(
            @PathVariable String certificateId,
            @PathVariable String verificationCode) {
        
        Certificate certificate = certificateRepository
                .findByCertificateIdAndVerificationCode(certificateId, verificationCode)
                .orElse(null);
        
        if (certificate == null) {
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error("Certificate not found or invalid verification code"));
        }
        
        if (certificate.getStatus() == Certificate.CertificateStatus.REVOKED) {
            return ResponseEntity
                    .status(403)
                    .body(ApiResponse.error("This certificate has been revoked"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(certificate));
    }
    
    /**
     * Public endpoint to verify certificate by certificate ID only
     */
    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificateById(
            @PathVariable String certificateId) {
        
        Certificate certificate = certificateRepository
                .findByCertificateId(certificateId)
                .orElse(null);
        
        if (certificate == null) {
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error("Certificate not found"));
        }
        
        if (certificate.getStatus() == Certificate.CertificateStatus.REVOKED) {
            return ResponseEntity
                    .status(403)
                    .body(ApiResponse.error("This certificate has been revoked"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(certificate));
    }
}
