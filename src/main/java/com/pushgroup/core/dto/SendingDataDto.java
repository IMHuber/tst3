package com.pushgroup.core.dto;

import com.pushgroup.core.filtering.Condition;

import java.util.List;

public class SendingDataDto {
    List<Condition> conditions;
    PayloadDto payloadDto;

    public SendingDataDto() {
    }

    public List<Condition> getConditions() {
        return conditions;
    }

    public void setConditions(List<Condition> conditions) {
        this.conditions = conditions;
    }

    public PayloadDto getPayloadDto() {
        return payloadDto;
    }

    public void setPayloadDto(PayloadDto payloadDto) {
        this.payloadDto = payloadDto;
    }
}
