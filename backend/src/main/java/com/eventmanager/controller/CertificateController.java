package com.eventmanager.controller;

import com.eventmanager.model.Certificate;
import com.eventmanager.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(
            @RequestParam String userId,
            @RequestParam String eventId,
            @RequestParam String type,
            @RequestParam(required = false) String position) {
        return ResponseEntity.ok(certificateService.generateCertificate(userId, eventId, type, position));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String id) {
        byte[] pdf = certificateService.downloadCertificatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/verify/{number}")
    public ResponseEntity<Boolean> verifyCertificate(@PathVariable String number) {
        return ResponseEntity.ok(certificateService.verifyCertificate(number));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getUserCertificates(@PathVariable String userId) {
        return ResponseEntity.ok(certificateService.getUserCertificates(userId));
    }
}
