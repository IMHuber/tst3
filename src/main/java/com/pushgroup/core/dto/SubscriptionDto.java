package com.pushgroup.core.dto;



import com.pushgroup.core.domain.Subscription;

import java.sql.Timestamp;

public class SubscriptionDto {
    private Long id;
    private String categoryName;
    private String sourceUrl;
    private String endpoint;
    private Timestamp expirationTime;
    private KeyDto keys;

    public SubscriptionDto() {
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Timestamp getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Timestamp expirationTime) {
        this.expirationTime = expirationTime;
    }

    public KeyDto getKeys() {
        return keys;
    }

    public void setKeys(KeyDto keys) {
        this.keys = keys;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public Subscription toDomain() {
        Subscription res = new Subscription();
        res.setId(this.id);
        res.setEndpoint(this.endpoint);
        res.setExpirationTime(this.expirationTime);
        res.setP256dh(this.keys != null? this.keys.p256dh : null);
        res.setAuth(this.keys != null? this.keys.auth : null);
        res.setSourceUrl(this.sourceUrl);
        return res;
    }


    private class KeyDto {
        private String p256dh;
        private String auth;

        public KeyDto() {
        }

        public String getP256dh() {
            return p256dh;
        }

        public void setP256dh(String p256dh) {
            this.p256dh = p256dh;
        }

        public String getAuth() {
            return auth;
        }

        public void setAuth(String auth) {
            this.auth = auth;
        }
    }
}
