package com.pushgroup.core.domain.statistics;

public class PayloadOverall {
    private Long campaignsTotal;
    private Long viewsTotal;
    private Long clicksTotal;

    public Long getCampaignsTotal() {
        return campaignsTotal;
    }

    public void setCampaignsTotal(Long campaignsTotal) {
        this.campaignsTotal = campaignsTotal;
    }

    public Long getViewsTotal() {
        return viewsTotal;
    }

    public void setViewsTotal(Long viewsTotal) {
        this.viewsTotal = viewsTotal;
    }

    public Long getClicksTotal() {
        return clicksTotal;
    }

    public void setClicksTotal(Long clicksTotal) {
        this.clicksTotal = clicksTotal;
    }
}