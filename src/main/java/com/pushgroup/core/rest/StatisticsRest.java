package com.pushgroup.core.rest;


import com.pushgroup.core.dto.PayloadStatDto;
import com.pushgroup.core.service.statistics.StatisticsService;
import com.pushgroup.core.service.subscription.SubscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/statistics")
public class StatisticsRest {
    private static final Logger LOGGER = LoggerFactory.getLogger(StatisticsRest.class);

    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private SubscriptionService subscriptionService;

    
    @RequestMapping(method= RequestMethod.GET)
    public @ResponseBody ResponseEntity<Object> getCurrent() {
        try {
            LOGGER.info("GET to api/statistics");
            return ResponseEntity.ok(statisticsService.getCurrentStatistics());
        } catch (Exception e) {
            LOGGER.error("GET to api/statistics failed. Error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body("");
        }
    }

    @RequestMapping(path = "/payload", method = RequestMethod.PUT)
    public @ResponseBody ResponseEntity<Object> updatePayloadStat(@RequestBody PayloadStatDto payloadStatDto) {
        try {
            LOGGER.info("POST to api/updatePayloadStat");
            subscriptionService.updatePayloadStat(payloadStatDto.getHash(), payloadStatDto.isClick(), payloadStatDto.isView(), payloadStatDto.isPush());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            LOGGER.error("POST to api/updatePayloadStat failed. Error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body("");
        }
    }
}
