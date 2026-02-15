package com.eventmanager.service;

import com.eventmanager.model.SupportFAQ;
import com.eventmanager.repository.SupportFAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupportFAQServiceImpl implements SupportFAQService {

    @Autowired
    private SupportFAQRepository faqRepository;

    @Override
    public List<SupportFAQ> getActiveFAQs() {
        return faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public List<SupportFAQ> getFAQsByCategory(String category) {
        return faqRepository.findByCategoryAndIsActiveTrue(category);
    }

    @Override
    public SupportFAQ createFAQ(SupportFAQ faq) {
        return faqRepository.save(faq);
    }

    @Override
    public SupportFAQ updateFAQ(String id, SupportFAQ faqDetails) {
        SupportFAQ faq = faqRepository.findById(id).orElseThrow(() -> new RuntimeException("FAQ not found"));
        faq.setQuestion(faqDetails.getQuestion());
        faq.setAnswer(faqDetails.getAnswer());
        faq.setCategory(faqDetails.getCategory());
        faq.setDisplayOrder(faqDetails.getDisplayOrder());
        faq.setActive(faqDetails.isActive());
        faq.setUpdatedAt(java.time.LocalDateTime.now());
        return faqRepository.save(faq);
    }

    @Override
    public void deleteFAQ(String id) {
        faqRepository.deleteById(id);
    }
}
