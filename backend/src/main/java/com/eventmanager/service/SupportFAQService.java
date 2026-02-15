package com.eventmanager.service;

import com.eventmanager.model.SupportFAQ;
import java.util.List;

public interface SupportFAQService {
    List<SupportFAQ> getActiveFAQs();
    List<SupportFAQ> getFAQsByCategory(String category);
    SupportFAQ createFAQ(SupportFAQ faq);
    SupportFAQ updateFAQ(String id, SupportFAQ faq);
    void deleteFAQ(String id);
}
