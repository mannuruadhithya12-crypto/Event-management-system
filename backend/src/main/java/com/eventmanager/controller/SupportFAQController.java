package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.SupportFAQ;
import com.eventmanager.service.SupportFAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/faqs")
public class SupportFAQController {

    @Autowired
    private SupportFAQService faqService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportFAQ>>> getFAQs() {
        List<SupportFAQ> faqs = faqService.getActiveFAQs();
        return ResponseEntity.ok(new ApiResponse<List<SupportFAQ>>(true, "FAQs retrieved successfully", faqs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupportFAQ>> createFAQ(@RequestBody SupportFAQ faq) {
        SupportFAQ created = faqService.createFAQ(faq);
        return ResponseEntity.ok(new ApiResponse<SupportFAQ>(true, "FAQ created successfully", created));
    }
}
